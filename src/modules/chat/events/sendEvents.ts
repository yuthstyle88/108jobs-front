import type {ChatMessage, LocalUserId} from "lemmy-js-client";
import {UserService} from "@/services";
import {encrypt} from "@/utils";
import {dbg} from "@/modules/chat/utils";
import {MessagePayload, PhoenixEvent, PhoenixPacket, SendMessageDeps} from "@/modules/chat/types";
import {createMessage} from "@/modules/chat/domain/entities/message";
import {waitForAck, wsSend} from "@/modules/chat/utils/socketSend";
import {useChatStore} from "@/modules/chat/store/chatStore";

// ฟังก์ชันกลาง สำหรับสร้าง event (รองรับ meta + ลบ key undefined)
export function createEvent<T>(
  event: PhoenixEvent,
  payload?: T,
): PhoenixPacket<T> & {
    roomId?: string;
    timestamp: string;
} {
    const packet: any = {
        event,
        payload,
        timestamp: new Date().toISOString(),
    };
    Object.keys(packet).forEach((k) => {
        if(packet[k] === undefined) delete packet[k];
    });
    return packet;
}

// --- Generic event-deps for socket sends ---
export interface SendEventDeps {
    roomId: string;
    senderId: LocalUserId;
    adapter?: SendMessageDeps['adapter'];
    sender?: SendMessageDeps['sender'];
}

// --- Typing events ---
export function sendTyping(deps: SendEventDeps, typing: boolean) {
    const {senderId, roomId} = deps as any;
    const adapter = (deps as any).adapter as SendMessageDeps['adapter'];
    const secure = false;
    const unified = createEvent('chat:typing', {secure, typing, senderId, roomId});
    if(!adapter) return;
    wsSend(adapter, unified);
}

// --- Read receipt ---
export function sendReadReceipt(deps: SendEventDeps, lastMessageId: string) {
    const {roomId, senderId} = deps as any;
    const adapter = (deps as any).adapter as SendMessageDeps['adapter'];
    const secure = false;
    const packet = createEvent('chat:read_up_to', {
        secure,
        roomId: roomId,
        readerId: senderId,
        lastReadMessageId: lastMessageId ?? '',
    });
    if(!adapter) return;
    dbg('sendReadReceipt', packet);
    wsSend(adapter, packet);
}

// --- Room update ---
export function sendRoomUpdateEvent(
  deps: SendEventDeps,
  update: Record<string, any>
) {
    const {roomId} = deps as any;
    const adapter = (deps as any).adapter as SendMessageDeps['adapter'];
    const packet = createEvent('chat:update', {roomId, ...update});
    if(!adapter) return;
    wsSend(adapter, packet);
}

/** Internal helper to send a message, wait for ack, update status and emit UI event */
async function doSend(deps: SendMessageDeps, msg: ChatMessage): Promise<{ id: string; sent: boolean; }> {
    const {sender} = deps as any;
    if(!sender) return {id: String(msg.id), sent: false};
    dbg('doSend', msg);
    const sent = deps.sender ? Boolean(await deps.sender.sendMessage('chat:message', msg)) : false;
    if(sent) {
        const acked = await waitForAck(deps, msg.id, 8000)
          .catch((err) => {
              dbg('waitForAck error', err);
              return false;
          });
        if(acked) {
            dbg('waitForAck success', acked);
            try {
                (deps as any).onAfterSend?.();
            } catch {
            }
            return {id: String(msg.id), sent};
        }
        try {
            (deps as any).onAfterSend?.();
        } catch {
        }
        return {id: String(msg.id), sent: false};
    }

    return {id: String(msg.id), sent};
}

/** Centralized send-message flow used by PhoenixSocketProvider */
export async function sendChatMessage(deps: SendMessageDeps, data: MessagePayload): Promise<{
    id: string;
    sent: boolean;
} | undefined> {
    const {roomId} = deps as any;
    const store = useChatStore.getState();
    try {
        // ---- 0) Sanitize & validate input here (do not rely on caller) ----
        const raw = (data?.message ?? '');
        const message = typeof raw === 'string' ? raw.trim() : raw;
        if(!message) {
            try {
                (deps as any).onAfterSend?.();
            } catch {
            }
            return undefined; // nothing to send
        }

        // ---- 1) Deduplicate by id to avoid double-submits ----
        const msgId = data?.id ? String(data.id) : undefined;
        const sentSet = (deps as any)?.sentSet as Set<string> | undefined;
        if(msgId && sentSet?.has?.(msgId)) {
            try {
                (deps as any).onAfterSend?.();
            } catch {
            }
            return {id: msgId, sent: false};
        }

        // Respect caller's intent: if data.secure === false, force plaintext
        const allowEncrypt = data?.secure !== false;

        // ---- 2) Create a single pending entity and optimistically insert once ----
        const p = createMessage(data.secure, message, roomId, data.senderId, data.id);
        if(!p) {
            try {
                (deps as any).onAfterSend?.();
            } catch {
            }
            return undefined;
        }
        p.status = "pending" as any;

        try {
            store?.addPending?.(p);
        } catch {
        }

        // mark as attempted
        try {
            if(msgId) sentSet?.add?.(msgId);
        } catch {
        }
        try {
            const aesKey = UserService.Instance.authInfo?.sharedKey;
            const shouldEncrypt = Boolean(aesKey && message && allowEncrypt);
            if(shouldEncrypt && aesKey) {
                try {
                    const cipher = await encrypt(message, aesKey);
                    if(cipher && cipher !== message) {
                        (p as any).content = cipher;
                    }
                } catch (err) {
                    (p as any).secure = false; // encryption failed → plaintext
                    if(process.env.NODE_ENV !== 'production') {
                        console.warn(`[crypto] encryption failed, falling back to plaintext`, err);
                    }
                }
            } else {
                (p as any).secure = false; // no shared key or disabled
            }
        } catch {
        }

        // ---- 4) Transport: must have sender to send ----
        if(!(deps as any)?.sender) {
            try {
                store?.commitStatus?.(String(p.id), "failed");
            } catch {
            }
            try {
                (deps as any).onAfterSend?.();
            } catch {
            }
            return {id: String(p.id), sent: false};
        }

        // ---- 5) Send & commit status; always call onAfterSend ----
        try {
            const res = await doSend(deps, p);
            const pid = String(p.id);
            const rid = String(res?.id ?? pid);
            if(res?.sent) {
                try {
                    store?.commitStatus?.(rid, 'sent');
                } catch {
                }
            } else {
                try {
                    store?.commitStatus?.(pid, 'failed');
                } catch {
                }
            }
            try {
                (deps as any).onAfterSend?.();
            } catch {
            }
            return res;
        } catch (err) {
            dbg('sendChatMessage: transport error', err);
            try {
                store?.commitStatus?.(String(p.id), 'failed');
            } catch {
            }
            try {
                (deps as any).onAfterSend?.();
            } catch {
            }
            return {id: String(p.id), sent: false};
        } finally {
            try {
                if(msgId) sentSet?.delete?.(msgId);
            } catch {
            }
        }
    } catch {
    }
    return;
}
//
// /** Manual resend (used when user taps "resend" in UI) */
// export async function resendChatMessage(
//   deps: SendMessageDeps,
//   originalOrId: string | ChatMessage
// ): Promise<{ id: string; sent: boolean; }> {
//     const store = useChatStore();
//     try {
//         // Resolve message from id or use provided ChatMessage directly
//         let msg: ChatMessage | undefined;
//         let messageId: string;
//         if(typeof originalOrId === 'string') {
//             messageId = originalOrId;
//             msg = store?.getMessageById ? store.getMessageById(messageId) : undefined;
//             if(!msg) {
//                 console.warn("[chat] resend: message not found in store", messageId);
//                 return {id: messageId, sent: false};
//             }
//         } else {
//             msg = originalOrId;
//             messageId = String(originalOrId.id);
//         }
//
//         if(msg) {
//             return await doSend(deps, msg);
//         }
//         return {id: messageId, sent: false,};
//     } catch (err) {
//         console.error("[chat] resend failed", err);
//         // messageId is always defined by this point
//         let messageId: string;
//         if(typeof originalOrId === 'string') {
//             messageId = originalOrId;
//         } else {
//             messageId = String(originalOrId.id);
//         }
//         store?.commitStatus?.(messageId, "failed");
//         return {id: messageId, sent: false};
//     }
// }

// ปลอดภัยกับ SSR
const getWin = (): Window | undefined => {
    try {
        return window;
    } catch {
        return undefined;
    }
};

/** สั่งให้ realtime layer เชื่อมต่อ WS (ถ้าเชื่อมแล้วจะเป็น no-op) */
export function emitEnsureWs(): void {
    const w = getWin();
    if(!w) return;
    w.dispatchEvent(new CustomEvent('ws:ensure-connect'));
}

/** สั่ง join room แบบ decoupled ผ่าน event bus */
export function emitJoinRoom(payload: { roomId: string }): void {
    const w = getWin();
    if(!w) return;
    w.dispatchEvent(new CustomEvent('chat:join-room', {detail: payload}));
}

/** helper สำหรับฝั่ง provider เอาไว้ subscribe */
export function onWsEnsureConnect(handler: () => void): () => void {
    const w = getWin();
    if(!w) return () => {
    };
    const fn = () => handler();
    w.addEventListener('ws:ensure-connect', fn as EventListener);
    return () => w.removeEventListener('ws:ensure-connect', fn as EventListener);
}

export function onJoinRoom(handler: (roomId: string) => void): () => void {
    const w = getWin();
    if(!w) return () => {
    };
    const fn = (ev: Event) => {
        const ce = ev as CustomEvent<{ roomId: string }>;
        const rid = ce?.detail?.roomId;
        if(rid) handler(rid);
    };
    w.addEventListener('chat:join-room', fn as EventListener);
    return () => w.removeEventListener('chat:join-room', fn as EventListener);
}