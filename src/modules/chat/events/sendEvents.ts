import type {ChatMessage, LocalUserId} from "lemmy-js-client";
import {UserService} from "@/services";
import {encrypt} from "@/utils";
import {dbg} from "@/modules/chat/utils";
import {MessagePayload, PhoenixEvent, PhoenixPacket, SendMessageDeps} from "@/modules/chat/types";
import {createMessage} from "@/modules/chat/domain/entities/message";
import {waitForAck, wsSend} from "@/modules/chat/utils/socketSend";
import {useChatStore} from "@/modules/chat/store/chatStore";

// ---- Packet helpers ----
export function createEvent<T>(event: PhoenixEvent, payload?: T): PhoenixPacket<T> & {
    roomId?: string;
    timestamp: string
} {
    const p: any = {event, payload, timestamp: new Date().toISOString()};
    Object.keys(p).forEach((k) => p[k] === undefined && delete p[k]);
    return p;
}

export interface SendEventDeps {
    roomId: string;
    senderId: LocalUserId;
    adapter?: SendMessageDeps['adapter'];
    sender?: SendMessageDeps['sender'];
}

// ---- Lightweight emits ----
export function sendTyping(deps: SendEventDeps, typing: boolean) {
    const a = (deps as any).adapter;
    if(!a) return;
    wsSend(a, createEvent('chat:typing', {typing, senderId: deps.senderId, roomId: deps.roomId}));
}

export function sendReadReceipt(deps: SendEventDeps, lastMessageId: string) {
    const a = (deps as any).adapter;
    if(!a) return;
    const pkt = createEvent('chat:read_up_to', {
        secure: false,
        roomId: deps.roomId,
        readerId: deps.senderId,
        lastReadMessageId: lastMessageId || ''
    });
    dbg('sendReadReceipt', pkt);
    wsSend(a, pkt);
}

export function sendRoomUpdateEvent(deps: SendEventDeps, update: Record<string, any>) {
    const a = (deps as any).adapter;
    if(!a) return;
    wsSend(a, createEvent('chat:update', {roomId: deps.roomId, ...update}));
}

// ---- Core send/ack ----
async function doSend(deps: SendMessageDeps, msg: ChatMessage): Promise<{ id: string; sent: boolean }> {
    const id = String(msg.id);
    const s = (deps as any).sender;
    if(!s) return {id, sent: false};
    dbg('doSend:start', {id, roomId: (deps as any)?.roomId});
    try {
        const ok = await s.sendMessage('chat:message', msg);
        if(!ok) return (dbg('doSend:sendMessage failed', {id}), {id, sent: false});
        const acked = await waitForAck(deps, msg.id, 8000).catch((e) => (dbg('doSend:waitForAck error', e), false));
        return acked ? (dbg('doSend:ack ok', {id}), {id, sent: true}) : (dbg('doSend:ack timeout', {id}), {
            id,
            sent: false
        });
    } catch (err) {
        dbg('doSend:error', err);
        return {id, sent: false};
    }
}

// ---- Public: send chat message ----
export async function sendChatMessage(deps: SendMessageDeps, data: MessagePayload): Promise<{
    id: string;
    sent: boolean
} | undefined> {
    const store = useChatStore.getState();
    const message = data?.message ?? '';
    if(!message) return;
    const hasSender = !!(deps as any)?.sender, hasRoom = !!(deps as any)?.roomId, hasSenderId = !!data?.senderId;
    if(!hasSender || !hasRoom || !hasSenderId) return;

    const msgId = data?.id ? String(data.id) : undefined;
    const sentSet = (deps as any)?.sentSet as Set<string> | undefined;
    if(msgId && sentSet?.has?.(msgId)) return {id: msgId, sent: false};

    const allowEncrypt = data?.secure !== false;
    const p = createMessage(message, (deps as any).roomId, data.senderId, data.secure, data.id);
    if(!p) return;
    p.status = 'pending' as any;
    try {
        store?.addPending?.(p);
    } catch {
    }
    if(msgId) try {
        sentSet?.add?.(msgId);
    } catch {
    }

    try {
        const key = UserService.Instance.authInfo?.sharedKey;
        const useEnc = !!(key && message && allowEncrypt);
        const cipher = useEnc ? await encrypt(message, key!) : null;
        (p as any).content = cipher && cipher !== message ? cipher : message;
        (p as any).secure = !!(cipher && cipher !== message);
    } catch {
        (p as any).content = message;
        (p as any).secure = false;
    }

    if(!(deps as any)?.sender) return; // guard (shouldn’t happen; already checked)

    try {
        const res = await doSend(deps, p);
        const pid = String(p.id);
        const rid = String(res?.id ?? pid);
        store?.commitStatus?.(res?.sent ? rid : pid, res?.sent ? 'sent' : 'failed');
        return res;
    } catch (err) {
        dbg('sendChatMessage: transport error', err);
        store?.commitStatus?.(String(p.id), 'failed');
        return {id: String(p.id), sent: false};
    } finally {
        if(msgId) try {
            sentSet?.delete?.(msgId);
        } catch {
        }
    }
}