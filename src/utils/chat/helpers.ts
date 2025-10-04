import {TYPING_EVENT_NAMES} from "@/utils/chat/types";
import type { RefObject } from "react";
import {HttpService} from "@/services";
import {REQUEST_STATE} from "@/services/HttpService";
import {emitReadReceipt} from "@/events/chat";
import {ChatMessage} from "lemmy-js-client";

export function parseTypingDetail(env: any, fallbackRoomId: string, localUserId: number): { roomId: string; senderId: number; typing: boolean } | null {
    try {
        const evName = String(env?.event ?? env?.data?.event ?? env?.content ?? '');
        if (!evName || !TYPING_EVENT_NAMES.some(n => evName === n || evName.includes('typing'))) return null;

        // Topic / room id
        const rawTopic = String(env?.topic ?? env?.data?.topic ?? fallbackRoomId ?? '');
        const bare = rawTopic.startsWith('room:') ? rawTopic.slice(5) : rawTopic;
        const pureRoomId = String(env?.roomId ?? bare.split(':')[0] ?? bare);

        // Prefer normalized payload
        const p: any = env?.payload ?? env;

        // sender id (payload → contentParsed → topic fallback)
        let senderIdNum = Number(p?.sender_id ?? p?.senderId ?? 0);
        if (!senderIdNum) {
            const cp: any = env?.contentParsed;
            if (cp) senderIdNum = Number(cp?.senderId ?? cp?.sender_id ?? 0);
        }
        if (!senderIdNum || senderIdNum === Number(localUserId)) return null;

        // typing flag
        let typingFlag: boolean | undefined = typeof p?.typing === 'boolean' ? p.typing : undefined;
        if (typeof typingFlag !== 'boolean') {
            const cp: any = env?.contentParsed;
            if (cp && typeof cp.typing === 'boolean') typingFlag = cp.typing;
        }
        if (typeof typingFlag !== 'boolean') {
            try {
                const c: any = p?.content;
                if (typeof c === 'string' && c.trim().startsWith('{')) {
                    const j = JSON.parse(c);
                    if (typeof j?.typing === 'boolean') typingFlag = j.typing;
                } else if (c && typeof c === 'object' && typeof c.typing === 'boolean') {
                    typingFlag = c.typing;
                }
            } catch {}
        }
        if (typeof typingFlag !== 'boolean') {
            typingFlag = evName.includes('start') ? true : evName.includes('stop') ? false : false;
        }

        return { roomId: pureRoomId, senderId: senderIdNum, typing: !!typingFlag };
    } catch {
        return null;
    }
}

// ---- helpers: status-change ----
export async function maybeHandleStatusChange(env: any, roomId: string, setRefreshRoomData: (d:any)=>void, markPeerActive: ()=>void): Promise<boolean> {
    try {
        const evName = String(env?.content || "");
        if (!evName || !evName.includes("status-change")) return false;
        try {
            const chatRoomRes = await HttpService.client.getChatRoom(roomId);
            if (chatRoomRes.state === REQUEST_STATE.SUCCESS) {
                setRefreshRoomData(chatRoomRes.data);
                try { markPeerActive(); } catch {}
            }
        } catch (err) {
            try { if (localStorage.getItem('chat_debug') === '1') console.error("Error fetching room:", err); } catch {}
        }
        return true;
    } catch { return false; }
}

// ---- helpers: read-receipt ----
export function maybeHandleReadReceipt(env: any, fallbackRoomId: string): boolean {
    try {
        const evName = String(env?.event || env?.content || "");
        if (evName !== "chat:read-receipt" && evName !== "chat:read") return false;
        const room_id = env?.room_id || env?.roomId || env?.topic || fallbackRoomId;
        const last_read_message_id = env?.last_read_message_id || env?.lastReadMessageId;
        const reader_id = Number(env?.reader_id ?? env?.readerId ?? 0);
        emitReadReceipt(String(room_id), String(last_read_message_id || ""), reader_id);
        return true;
    } catch { return false; }
}

// ---- helpers: new messages merge ----
export function mergeNewMessages(
  prev: ChatMessage[],
  incoming: ChatMessage[],
) {
    const map = new Map<string, ChatMessage>();
    for (const m of prev) map.set(String(m.id), m);
    for (const m of incoming) map.set(String(m.id), m);
    const arr = Array.from(map.values());
    return arr.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// ---- helpers: auto-ack ----
export function tryFlushAutoAck(handleWSMessageFn: any, roomId: string, readAckRef: RefObject<((lastId: string)=>void) | null>, ackCooldownRef: RefObject<number | undefined>) {
    try {
        const batchId = (handleWSMessageFn as any)._batchAckLastId as string | undefined;
        (handleWSMessageFn as any)._batchAckLastId = null;
        if (!batchId) return;

        const now = Date.now();
        const lastAcked = (handleWSMessageFn as any)._lastAckedId as string | undefined;

        const requireFocus = (() => {
            try { return localStorage.getItem("read_ack_require_focus") !== "0"; } catch { return true; }
        })();
        const isActiveTab = typeof document !== "undefined"
          ? (document.visibilityState === "visible" && (typeof (document as any).hasFocus === 'function' ? (document as any).hasFocus() : true))
          : true;
        if (requireFocus && !isActiveTab) {
            try { if (localStorage.getItem("debug_read_ack") === "1") console.log("[read-ack] skip: tab not active (visibility/focus required)"); } catch {}
            return;
        }
        if (lastAcked === batchId) return;
        if (now < (ackCooldownRef.current ?? 0)) return;

        readAckRef.current?.(batchId);
        (handleWSMessageFn as any)._lastAckedId = batchId;
        ackCooldownRef.current = now + 900;
    } catch {}
}

// ---- helpers: failure cleanup ----
export function cleanupFetch(setIsFetching?: (b:boolean)=>void, fetchTimeoutRef?: RefObject<any>, fetchResolveRef?: RefObject<(()=>void)|null>) {
    try { setIsFetching?.(false); } catch {}
    try {
        if (fetchTimeoutRef?.current) { clearTimeout(fetchTimeoutRef.current); fetchTimeoutRef.current = null as any; }
    } catch {}
    try {
        if (fetchResolveRef?.current) { fetchResolveRef.current(); fetchResolveRef.current = null; }
    } catch {}
}

export function buildMessageSignature(msg: any): string {
    // Fast path: prefer stable ids first
    const id = msg?.id ?? msg?.msg_ref_id ?? msg?.messageId;
    if (id != null) return String(id);

    // Fallback: composite signature (room|sender|ts|content)
    const room = msg?.roomId ?? msg?.room_id ?? "";
    const sender = msg?.senderId ?? msg?.sender_id ?? "";
    const ts = msg?.createdAt ?? msg?.created_at ?? "";
    const c = msg?.content;
    const content = typeof c === "string" ? c : (c == null ? "" : JSON.stringify(c));

    return `${room}|${sender}|${ts}|${content}`;
}
