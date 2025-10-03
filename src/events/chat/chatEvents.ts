// Centralized chat event helpers for consistent usage across the app
// This provides typed helpers to emit and subscribe to chat CustomEvents
// keeping window and event-name details in one place.
import {isBrowser} from "@/utils/browser";
import {ChatStatus, LocalUserId} from "lemmy-js-client";
// ===== Payload handler (shared) =====
import type {RefObject} from 'react';
import {logDebug, mapIncomingToChatMessage, safeParse} from "@/utils/chat";


function stripUndef<T extends Record<string, any>>(obj: T): T {
    Object.keys(obj).forEach((k) => {
        if ((obj as any)[k] === undefined) delete (obj as any)[k];
    });
    return obj;
}

export const CHAT_EVENT = Object.freeze({
    NEW_MESSAGE: 'chat:new-message',
    TYPING: 'chat:typing',
    READ_RECEIPT: 'chat:read-receipt',
    WS_RECONNECTED: 'ws:reconnected',
} as const);

export type ChatNewMessageDetail = {
    roomId: string;          // required: UI context
    id: string;              // required: for de-dup & updates
    senderId: LocalUserId;   // required: for checking ownership
    content: string;         // required: message text (already decrypted for UI)
    createdAt: string;       // ISO string; defaults to now if omitted
    status: ChatStatus;      // pending | sent | failed
};

// Normalize detail for consistent UI handling (no socket dependency)
export function normalizeChatNewMessageDetail(detail: ChatNewMessageDetail): ChatNewMessageDetail {
    const now = new Date().toISOString();
    return stripUndef({
        ...detail,
        createdAt: detail.createdAt ?? now,
    });
}

export function isChatNewMessageDetail(v: any): v is ChatNewMessageDetail {
    return !!v && typeof v === 'object'
        && typeof v.roomId === 'string'
        && typeof v.id === 'string'
        && typeof v.content === 'string';
}

export type ChatNewMessageHandler = (detail: ChatNewMessageDetail) => void;

// ---- Typing (unified) ----
export type ChatTypingDetail = { roomId: string; senderId: number; typing: boolean };
export function emitChatNewMessage(detail: ChatNewMessageDetail): void {
    if (!isBrowser()) return;
    try {
        const normalized = normalizeChatNewMessageDetail(detail);
        window.dispatchEvent(new CustomEvent(CHAT_EVENT.NEW_MESSAGE, {detail: normalized}));
    } catch {
        // swallow errors to keep callers simple
    }
}

// Emit multiple new-message events in order (UI may render progressively)
export function emitChatNewMessages(details: ChatNewMessageDetail[]): void {
    if (!isBrowser()) return;
    for (const d of details) emitChatNewMessage(d);
}

export function onChatNewMessage(handler: ChatNewMessageHandler): () => void {
    if (!isBrowser()) return () => {
    };
    const wrapped = (e: CustomEvent<ChatNewMessageDetail>) => {
        try {
            const d = e.detail;
            if (!isChatNewMessageDetail(d)) return;
            handler(normalizeChatNewMessageDetail(d));
        } catch {
        }
    };
    window.addEventListener(CHAT_EVENT.NEW_MESSAGE, wrapped as EventListener);
    return () => window.removeEventListener(CHAT_EVENT.NEW_MESSAGE, wrapped as EventListener);
}

export function emitWsReconnected(): void {
    if (!isBrowser()) return;
    try {
        window.dispatchEvent(new Event(CHAT_EVENT.WS_RECONNECTED as any));
    } catch {
    }
}

export function onWsReconnected(handler: () => void): () => void {
    if (!isBrowser()) return () => {
    };
    window.addEventListener(CHAT_EVENT.WS_RECONNECTED as any, handler as any);
    return () => window.removeEventListener(CHAT_EVENT.WS_RECONNECTED as any, handler as any);
}

/** Emit a unified typing event */
export function emitChatTyping(detail: { roomId: string; senderId: number; typing: boolean }) {
    try {
        if (!isBrowser()) return;

        // Basic validation to avoid silent no-ops
        const roomId = String((detail as any)?.roomId || "");
        const senderId = Number((detail as any)?.senderId || 0);
        const typing = Boolean((detail as any)?.typing);
        if (!roomId || !Number.isFinite(senderId)) return;

        // Build event with better DOM propagation
        const evt = new CustomEvent(CHAT_EVENT.TYPING as string, {
            detail: {roomId, senderId, typing},
            bubbles: true,
            composed: true,
            cancelable: false,
        } as any);
        console.info('[typing] emit', evt);
        // Dispatch to both window and document to cover different listeners
        try {
            window.dispatchEvent(evt);
        } catch {
        }
        try {
            document && document.dispatchEvent && document.dispatchEvent(evt);
        } catch {
        }
    } catch (e) {
        // swallow errors to keep callers simple
    }
}

/** Emit a unified read-receipt event */
export function emitReadReceipt(roomId: string, lastMessageId: string, readerId: number) {
    try {
        if (isBrowser()) window.dispatchEvent(new CustomEvent(CHAT_EVENT.READ_RECEIPT, {
            detail: {
                roomId,
                lastMessageId,
                readerId
            }
        }));
    } catch {
    }
}

export async function handleIncomingPayload(
    payload: any,
    ctx: {
        roomId: string;
        localUserId: number;
        token: string | null | undefined;
        sharedKeyHex?: string;
        receivedSet: Set<string>;
        setPageCursor?: (cursor: string | null) => void;
        setHasMoreMessages?: (v: boolean) => void;
        setIsFetching?: (v: boolean) => void;
        fetchTimeoutRef?: RefObject<ReturnType<typeof setTimeout> | null>;
        fetchResolveRef?: RefObject<((value?: void) => void) | null>;
    }
): Promise<import("lemmy-js-client").ChatMessage[] | null> {
    try {
        logDebug('[RT] handleIncomingPayload →', payload);
    } catch {
    }
    // Ignore trivial frames
    if (
        payload == null ||
        payload === 'pong' ||
        payload === 'ping' ||
        (payload?.op === 'Ping') ||
        (payload?.event === 'phx_leave') ||
        (typeof payload === 'object' && !Array.isArray(payload) && Object.keys(payload).length === 0)
    ) {
        return null;
    }

    // Normalize Phoenix shapes to a flat message-like object
    try {
        if (Array.isArray(payload) && payload.length >= 5 && typeof payload[3] === 'string' && payload[4] && typeof payload[4] === 'object') {
            const [, , topic, ev, body] = payload as [any, any, string, string, any];
            payload = {event: ev, topic: topic.replace(/^room:/, ''), ...body};
        } else if (payload && typeof payload === 'object' && 'event' in payload && 'payload' in payload && typeof (payload as any).payload === 'object') {
            const env = payload as any;
            const topic = typeof env.topic === 'string' ? env.topic.replace(/^room:/, '') : env.topic;
            payload = {event: env.event, topic, ...(env.payload || {})};
        }
    } catch {
    }

    const out: import("lemmy-js-client").ChatMessage[] = [];

    // ChatMessageView line: { message: {...}, room?: { id } }
    if (payload && typeof payload === 'object' && (payload as any).message) {
        const msgView = payload as any;
        const m = {...msgView.message, room_id: msgView.room?.id || msgView.message?.room_id};

        const mapped = await mapIncomingToChatMessage(m, {
            token: ctx.token,
            sharedKeyHex: ctx.sharedKeyHex,
            fallbackRoomId: ctx.roomId,
            localUserId: ctx.localUserId,
            receivedSet: ctx.receivedSet,
            decryptLabel: 'message view',
        });
        if (mapped) out.push(mapped);
        return out;
    }

    // Flat ChatMessage line (and also detect inline typing JSON)
    if (payload && typeof payload === 'object' && Object.prototype.hasOwnProperty.call(payload, 'content')) {
        const m = (() => {
            const p: any = payload;
            const topic = typeof p.topic === 'string' ? p.topic.replace(/^room:/, '') : undefined;
            return {...p, room_id: p.room_id ?? p.roomId ?? topic};
        })();

        // Typing embedded in content
        try {
            if (typeof m.content === 'string' && m.content.trim().startsWith('{')) {
                const parsed = safeParse(m.content);
                if (parsed && typeof parsed === 'object' && ('typing' in parsed)) {
                    const senderIdNum = Number(m.sender_id ?? m.senderId ?? 0);
                    const info = {
                        type: 'typing',
                        roomId: String(m.room_id || m.roomId || m.topic || ctx.roomId),
                        senderId: senderIdNum,
                        typing: Boolean((parsed as any).typing),
                    } as any;
                    if (senderIdNum !== Number(ctx.localUserId)) {
                        emitChatTyping(info);
                    }
                    return [];
                }
            }
        } catch {
        }

        const mapped = await mapIncomingToChatMessage(m, {
            token: ctx.token,
            sharedKeyHex: ctx.sharedKeyHex,
            fallbackRoomId: ctx.roomId,
            localUserId: ctx.localUserId,
            receivedSet: ctx.receivedSet,
            decryptLabel: 'flat message',
        });
        if (mapped) out.push(mapped);
        return out;
    }

    // Pagination payloads (prev/next page)
    if (payload && typeof payload === 'object' && ((payload as any).prevPage || (payload as any).prev_page || (payload as any).nextPage || (payload as any).next_page)) {
        const prev = (payload as any).prev_page ?? (payload as any).prevPage ?? null;
        const next = (payload as any).next_page ?? (payload as any).nextPage ?? null;
        if (typeof prev === 'string' && prev.length > 0) {
            ctx.setPageCursor?.(next);
            ctx.setHasMoreMessages?.(true);
        } else {
            ctx.setPageCursor?.(null);
            ctx.setHasMoreMessages?.(false);
        }
        if (ctx.fetchTimeoutRef?.current) {
            clearTimeout(ctx.fetchTimeoutRef.current);
            ctx.fetchTimeoutRef.current = null;
        }
        ctx.setIsFetching?.(false);
        if (ctx.fetchResolveRef?.current) {
            ctx.fetchResolveRef.current();
            ctx.fetchResolveRef.current = null;
        }
        return [];
    }

    try {
        logDebug('onmessage: dropped unknown payload shape', payload);
    } catch {
    }
    return null;
}
