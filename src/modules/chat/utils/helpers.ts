import type {RefObject} from "react";
import {HttpService} from "@/services";
import {REQUEST_STATE} from "@/services/HttpService";
import {emitReadReceipt} from "@/modules/chat/events";
import type {ChatMessageView} from "lemmy-js-client";
import {ChatMessage} from "lemmy-js-client";
import {NormalizedEnvelope} from "@/modules/chat/utils/chatSocketUtils";

// Type guard: narrow a NormalizedEnvelope to the typing envelope (explicit interface)
export type TypingEnv = {
    event: 'chat:typing';
    roomId: string;
    typing: boolean;
    sender?: ChatMessageView['sender'];
};

function isTypingEnvelope(env: NormalizedEnvelope): env is TypingEnv {
    return !!env && (env as any).event === 'chat:typing' && typeof (env as any).roomId === 'string';
}

export function parseTypingDetail(env: NormalizedEnvelope, _fallbackRoomId: string, localUserId: number): {
    roomId: string;
    senderId: number;
    typing: boolean
} | null {
    try {
        if (!isTypingEnvelope(env)) return null;
        const roomId = env.roomId?.trim();

        if (!roomId) return null;
        const senderId = Number(env.sender?.id ?? 0);
        if (!senderId || senderId === Number(localUserId)) return null; // ignore self

        const typing = Boolean(env.typing);

        return {roomId, senderId, typing};
    } catch {
        return null;
    }
}

// ---- helpers: status-change ----
export async function maybeHandleStatusChange(env: any, roomId: string, setRefreshRoomData: (d: any) => void): Promise<boolean> {
    try {

        const evName = String(env?.event);
        if (!evName || !evName.includes("update")) return false;
        try {
            const chatRoomRes = await HttpService.client.getChatRoom(roomId);
            if (chatRoomRes.state === REQUEST_STATE.SUCCESS) {
                setRefreshRoomData(chatRoomRes.data);
            }
        } catch (err) {
            try {
                if (localStorage.getItem('chat_debug') === '1') console.error("Error fetching room:", err);
            } catch {
            }
        }
        return true;
    } catch {
        return false;
    }
}

// ---- helpers: status-change ----
export function maybeHandleReadReceipt(env: any, fallbackRoomId: string): boolean {
    try {
        const evName = String(env?.event || env?.content || "");
        if (evName !== "chat:read_up_to") return false;

        const roomId = String(env?.roomId || env?.topic || fallbackRoomId);
        const lastReadMessageId = String(env?.lastReadMessageId || "");
        const readerId = Number(env?.readerId ?? 0);
        const updatedAt = env?.updatedAt || env?.createdAt || null; // <- depending on backend payload

        // Emit event for internal WS listeners
        emitReadReceipt(roomId, lastReadMessageId, readerId);
        const api = require('@/modules/chat/store/readLastIdStore');
        const { setPeerLastReadAt, getPeerLastReadAt } = api.useReadLastIdStore.getState?.() || {};
        if (typeof setPeerLastReadAt === 'function' && updatedAt) {
            setPeerLastReadAt(roomId, readerId, updatedAt);
        }
        return true;
    } catch {
        return false;
    }
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
    return arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// ---- helpers: auto-ack ----
export function tryFlushAutoAck(handleWSMessageFn: any, roomIdStr: string, readAckRef: RefObject<((lastId: string) => void) | null>, ackCooldownRef: RefObject<number | undefined>) {
    try {
        const batchId = (handleWSMessageFn as any)._batchAckLastId as string | undefined;
        (handleWSMessageFn as any)._batchAckLastId = null;
        if (!batchId) return;

        const now = Date.now();
        const lastAcked = (handleWSMessageFn as any)._lastAckedId as string | undefined;

        const requireFocus = (() => {
            try {
                return localStorage.getItem("read_ack_require_focus") !== "0";
            } catch {
                return true;
            }
        })();
        const isActiveTab = typeof document !== "undefined"
            ? (document.visibilityState === "visible" && (typeof (document as any).hasFocus === 'function' ? (document as any).hasFocus() : true))
            : true;
        if (requireFocus && !isActiveTab) {
            try {
                if (localStorage.getItem("debug_read_ack") === "1") console.log("[read-ack] skip: tab not active (visibility/focus required)");
            } catch {
            }
            return;
        }
        if (lastAcked === batchId) return;
        if (now < (ackCooldownRef.current ?? 0)) return;

        readAckRef.current?.(batchId);
        (handleWSMessageFn as any)._lastAckedId = batchId;
        ackCooldownRef.current = now + 900;
    } catch {
    }
}

// ---- helpers: failure cleanup ----
export function cleanupFetch(setIsFetching?: (b: boolean) => void, fetchTimeoutRef?: RefObject<any>, fetchResolveRef?: RefObject<(() => void) | null>) {
    try {
        setIsFetching?.(false);
    } catch {
    }
    try {
        if (fetchTimeoutRef?.current) {
            clearTimeout(fetchTimeoutRef.current);
            fetchTimeoutRef.current = null as any;
        }
    } catch {
    }
    try {
        if (fetchResolveRef?.current) {
            fetchResolveRef.current();
            fetchResolveRef.current = null;
        }
    } catch {
    }
}

export function buildMessageSignature(msg: any): string {
    // Fast path: prefer stable ids first
    const id = msg?.id ?? "";
    if (id != null) return String(id);

    // Fallback: composite signature (room|sender|ts|content)
    const room = msg?.roomId ?? "";
    const sender = msg?.senderId ?? "";
    const ts = msg?.createdAt ?? "";
    const c = msg?.content;
    const content = typeof c === "string" ? c : (c == null ? "" : JSON.stringify(c));

    return `${room}|${sender}|${ts}|${content}`;
}


/**
 * Lightweight, safe debug logger for websocket flows.
 * Enable with localStorage.setItem('debugWs','1') or NEXT_PUBLIC_DEBUG_WS=1
 *
 * NOTE: keep the same name/signature so all existing call sites work.
 */
export function dbg(label: string, data?: unknown) {
    try {
        // Gate – support both browser/local flag and env flag.
        const enabled =
            (typeof localStorage !== 'undefined' && localStorage.getItem('debugWs') === '1') ||
            (typeof process !== 'undefined' && (process as any)?.env?.NEXT_PUBLIC_DEBUG_WS === '1');
        if (!enabled) return;

        // Timestamped, namespaced header
        const ts = new Date().toISOString();
        const header = `[debug ${ts}] ${label}`;

        // Redact potentially sensitive blobs (tokens, long ciphertexts)
        const redact = (v: any): any => {
            if (v == null) return v;
            if (typeof v === 'string') {
                // redact obvious JWT/ciphertext-looking strings
                if (v.length > 120) return `${v.slice(0, 32)}…[${v.length} chars]`;
                return v;
            }
            if (Array.isArray(v)) return v.map(redact);
            if (typeof v === 'object') {
                const out: Record<string, any> = {};
                for (const [k, val] of Object.entries(v)) {
                    if (/token|authorization|auth|secret/i.test(k)) {
                        out[k] = '[redacted]';
                    } else if (k === 'content' && typeof val === 'string' && val.length > 120) {
                        out[k] = `${val.slice(0, 32)}…[${val.length} chars]`;
                    } else {
                        out[k] = redact(val as any);
                    }
                }
                return out;
            }
            return v;
        };

        const payload = redact(data);

        // Compact output by default; expand in console to inspect
        if (typeof console.groupCollapsed === 'function') {
            console.groupCollapsed(header);
            // eslint-disable-next-line no-console
            console.log(payload ?? '');
            console.groupEnd();
        } else {
            // eslint-disable-next-line no-console
            console.info(header, payload ?? '');
        }
    } catch {
        // never throw from a debug helper
    }
}

/**
 * Return true if `a` is older than `b` by createdAt.
 * Accepts objects with `createdAt` or raw date strings/Date.
 */
export function isOlder(
    lastReadAt: string | Date,
    createdAt: string | Date,
): boolean {
    const normalize = (v: any) => {
        if (typeof v === "string") {
            // Normalize to full ISO 8601 format
            let s = v.trim();

            // Replace space between date and time with 'T'
            s = s.replace(" ", "T");

            // Handle fractional seconds: trim to 3 digits if too long
            s = s.replace(/(\.\d{3})\d+/, "$1");

            // Ensure timezone format ends with 'Z' if +00:00
            s = s.replace(/\s*\+00:00$/, "Z");

            // If timezone missing entirely, assume UTC
            if (!/[zZ]|[+-]\d{2}:?\d{2}$/.test(s)) s += "Z";

            return s;
        }
        return v;
    };

    const toTime = (v: any) => new Date(normalize(v) ?? 0).getTime();

    const t1 = toTime(lastReadAt);
    const t2 = toTime(createdAt);

    if (Number.isNaN(t1) || Number.isNaN(t2)) return false;

    const result = t1 < t2;
    // console.debug("[isOlder]", { lastReadAt, createdAt, t1, t2, result });
    return result;
}
