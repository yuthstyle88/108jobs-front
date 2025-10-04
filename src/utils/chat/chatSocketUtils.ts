import {__DEV__} from "@/utils/appConfig";
import {HttpService, UserService} from "@/services";
import {getHost, isHttps} from "@/utils/env";
import type {ChatMessage} from "@/lib/lemmy-js-client/src";
import {decrypt} from "@/lib/web-crypto";
import {importAesKey} from "@/utils";
import {REQUEST_STATE} from "@/services/HttpService";

// ---- Centralized browser/event helpers (reduce duplication across contexts) ----


/** Normalize Phoenix frames/envelopes into a flat object once */
export function normalizePhoenixEnvelope(payload: any, fallbackRoomId?: string): any {
    // Goal: accept a variety of shapes and produce a flat object with:
    // { event, topic (raw), roomId (normalized), ...payloadFields, contentParsed? }
    let env: any = payload;
    try {
        // Phoenix array frame: [join_ref, msg_ref, topic, event, payload]
        if (Array.isArray(payload) && payload.length >= 5 && typeof payload[3] === 'string') {
            const [, , topic, ev, body] = payload as [any, any, string, string, any];
            const roomId = topic.startsWith('room:') ? topic.slice(5) : String(topic);
            env = {event: ev, topic, roomId, ...(body || {})};
        }
        // Nested envelope: { data: { event, payload, topic }, ... }
        else if (payload && typeof payload === 'object' && payload.data && typeof payload.data === 'object') {
            const d: any = payload.data;
            const topic = d.topic ?? payload.topic ?? fallbackRoomId ?? null;
            const roomId = typeof topic === 'string' && topic.startsWith('room:') ? topic.slice(5) : topic;
            env = {event: d.event, topic, roomId, ...(d.payload || {})};
        }
        // Flat envelope: { event, payload, topic }
        else if (payload && typeof payload === 'object' && 'event' in payload && 'payload' in payload) {
            const p: any = payload;
            const topic = p.topic ?? fallbackRoomId ?? null;
            const roomId = typeof topic === 'string' && topic.startsWith('room:') ? topic.slice(5) : topic;
            env = {event: p.event, topic, roomId, ...(p.payload || {})};
        }
        // Already flat payload or unknown shape → try to ensure topic/roomId
        else if (payload && typeof payload === 'object') {
            const topic = (payload as any).topic ?? fallbackRoomId ?? null;
            const roomId = typeof topic === 'string' && topic.startsWith('room:') ? topic.slice(5) : topic;
            env = {...payload, topic, roomId};
        }
    } catch {
    }

    if (!env || typeof env !== 'object') env = {};

    // Ensure topic/roomId with fallbacks (do NOT add/remove the 'room:' prefix on topic)
    if (!('topic' in env) && fallbackRoomId) {
        (env as any).topic = fallbackRoomId;
    }
    if (!('roomId' in env)) {
        const t = (env as any).topic ?? fallbackRoomId ?? null;
        (env as any).roomId = typeof t === 'string' && t.startsWith('room:') ? t.slice(5) : t;
    }

    // Parse contentParsed from either env.content or env.payload?.content
    try {
        const c = (env as any).content ?? (env as any).payload?.content;
        if (typeof c === 'string' && c.trim().startsWith('{')) {
            (env as any).contentParsed = JSON.parse(c);
        } else if (c && typeof c === 'object') {
            (env as any).contentParsed = c;
        }
    } catch {
    }

    return env;
}

export function logDebug(...args: unknown[]) {
    if (__DEV__) console.debug(...args);
}

export function safeParse(val: unknown): unknown {
    try {
        const result = typeof val === "string" ? JSON.parse(val as string) : val;
        logDebug(`safeParse: Parsed value`, result);
        return result;
    } catch {
        logDebug(`safeParse: Failed to parse value`, val);
        return val;
    }
}

export function buildActixWsUrl(): string {
    // Always go through Actix first → Phoenix-compatible endpoint
    // Do not append token/roomId in the URL. Phoenix client will send auth via params.
    const proto = isHttps() ? 'wss' : 'ws';
    const host = getHost();
    // Actix will handle `/socket/websocket` (either as WS proxy to Phoenix on :4000 or native Phoenix-compatible handler)
    return `${proto}://${host}/socket`;
}

export function isBase64Like(s: string): boolean {
    return /^[A-Za-z0-9+/=]+$/.test(s);
}


export function addOnce(set: Set<string>, key: string): boolean {
    if (set.has(key)) {
        logDebug(`addOnce: Key ${key} already exists in set`);
        return false;
    }
    set.add(key);
    logDebug(`addOnce: Added key ${key} to set`);
    return true;
}

export function unwrapPhoenixFrame(data: any): any {
    try {
        // If already an envelope-like object: { event, payload, topic }
        if (data && typeof data === 'object' && ('event' in data || 'payload' in data || 'topic' in data)) {
            const env: any = data;
            const payload = env.payload ?? env;
            if (payload && typeof payload === 'object') {
                // Preserve topic/event for downstream mapping (e.g., infer room from topic)
                return {...payload, topic: payload.topic ?? env.topic, event: payload.event ?? env.event};
            }
            return payload;
        }

        // Accept either raw string, or MessageEvent-like { data: string }
        const raw = typeof data === 'string' ? data : (typeof data?.data === 'string' ? data.data : null);
        if (!raw) return data;

        // Phoenix array frame: [join_ref, msg_ref, topic, event, payload]
        if (raw.startsWith('[')) {
            const arr = JSON.parse(raw);
            if (Array.isArray(arr) && arr.length >= 5) {
                const payload = arr[4];
                if (arr[3] === 'phx_reply' && payload && typeof payload === 'object' && 'response' in payload) {
                    return (payload as any).response;
                }
                return payload;
            }
        }

        // JSON envelope case: { event, payload, topic }
        const obj = JSON.parse(raw);
        if (obj && typeof obj === 'object' && ('event' in obj || 'payload' in obj || 'topic' in obj)) {
            const env: any = obj;
            const payload = env.payload ?? env;
            if (payload && typeof payload === 'object') {
                return {...payload, topic: payload.topic ?? env.topic, event: payload.event ?? env.event};
            }
            return payload;
        }
        return obj;
    } catch {
        return data;
    }
}

// ---- handleIncomingPayload: normalize and map incoming chat payloads ----
export async function handleIncomingPayload(
    payload: any,
    ctx: {
        roomId: string;
        localUserId: number;
        token?: string | null;
        sharedKeyHex?: string;
        receivedSet: Set<string>;
        setPageCursor?: (cursor: { prev: string | null; next: string | null } | null) => void;
        setHasMoreMessages?: (v: boolean) => void;
        setIsFetching?: (v: boolean) => void;
        fetchTimeoutRef?: { current: any } | null;
        fetchResolveRef?: { current: any } | null;
    }
): Promise<ChatMessage[]> {
    try {
        const env = normalizePhoenixEnvelope(payload, ctx.roomId) || {};
        const eventName = String((env as any).event || '').toLowerCase();

        const mapOne = async (raw: any): Promise<ChatMessage | null> => {
            // prefer explicit message node if present
            const flat = raw?.message ? {...raw.message, roomId: raw?.room?.id ?? raw?.message?.roomId} : raw;
            return mapIncomingToChatMessage(flat, {
                token: ctx.token,
                sharedKeyHex: ctx.sharedKeyHex,
                fallbackRoomId: String(env.roomId || ctx.roomId || flat?.roomId || ''),
                localUserId: ctx.localUserId,
                receivedSet: ctx.receivedSet,
                decryptLabel: 'ws frame',
            });
        };

        // HISTORY PAGE PUSHED FROM SERVER
        if (eventName === 'history_page') {
            try {
                const prev = (env as any).prevPage ?? (env as any).prev_page ?? null;
                const next = (env as any).nextPage ?? (env as any).next_page ?? null;
                ctx.setPageCursor?.({prev, next});
                ctx.setHasMoreMessages?.(!!prev); // has older pages when prev exists
            } catch {
            }
            try {
                ctx.setIsFetching?.(false);
            } catch {
            }
            try {
                if (ctx.fetchTimeoutRef?.current) {
                    clearTimeout(ctx.fetchTimeoutRef.current);
                    ctx.fetchTimeoutRef.current = null;
                }
                if (ctx.fetchResolveRef?.current) {
                    ctx.fetchResolveRef.current();
                    ctx.fetchResolveRef.current = null;
                }
            } catch {
            }

            const list = Array.isArray((env as any).results)
                ? (env as any).results
                : Array.isArray((env as any).messages)
                    ? (env as any).messages
                    : [];

            const out: ChatMessage[] = [];
            for (const item of list) {
                const mapped = await mapOne(item);
                if (mapped) out.push(mapped);
            }
            return out;
        }

        // NEW MESSAGE (canonical)
        if (eventName === 'chat:message') {
            const mapped = await mapOne(env);
            return mapped ? [mapped] : [];
        }

        // IGNORE non-message events here (typing/read handled elsewhere)
        return [];
    } catch (e) {
        logDebug('handleIncomingPayload: failed', e);
        return [];
    }
}

// ---- Lightweight runtime validators for chat payloads ----
export function isValidOutgoingChatPayload(p: any): boolean {
    return !!(
        p && typeof p === 'object' &&
        (p.op === 'SendMessage' || typeof p.op === 'undefined') &&
        typeof p.senderId === 'number' && p.senderId >= 0 &&
        typeof p.roomId === 'string' && p.roomId.length > 0 &&
        typeof p.content === 'string' && p.content.length > 0 &&
        typeof p.id === 'string' && p.id.length > 0 &&
        typeof p.createdAt === 'string'
    );
}

export function isValidIncomingChatPayload(p: any): boolean {
    if (!p) return false;
    // Allow arrays of messages
    if (Array.isArray(p)) {
        return p.some((it) => isValidIncomingChatPayload(it));
    }
    if (typeof p !== 'object') return false;
    // View style { message: { content, roomId? }, room?: { id } }
    if ((p as any).message && typeof (p as any).message === 'object') {
        const m = (p as any).message;
        const hasContent = typeof m.content === 'string' && m.content.length > 0;
        const hasRoom = typeof m.roomId === 'string' || typeof m.roomId === 'number' || typeof (p as any)?.room?.id === 'string' || typeof (p as any)?.room?.id === 'number';
        return hasContent && hasRoom;
    }
    // Flat style
    const hasRoom = typeof (p as any).roomId === 'string' || typeof (p as any).roomId === 'number' || typeof (p as any).roomId === 'string' || typeof (p as any).roomId === 'number';
    const hasContent = typeof (p as any).content === 'string' && (p as any).content.length > 0;
    return hasRoom && hasContent;
}

// === Helpers extracted from RealtimeChatContext / shared across contexts ===
/**
 * Install exactly ONE message listener depending on adapter capability and return a cleanup function.
 * Supports Phoenix EventEmitter-style `.on("message")`, DOM `addEventListener`, or `onmessage` property.
 */
export function installBestMessageListener(sock: any, handler: (evt: any) => void): () => void {
    // Prefer EventEmitter-style `.on("message")` for Phoenix adapters
    if (sock && typeof sock.on === 'function') {
        try {
            const wrapped = (payload: any) => handler({data: JSON.stringify(payload)});
            sock.on('message', wrapped);
            return () => {
                try {
                    sock.off?.('message', wrapped);
                } catch {
                }
            };
        } catch {
        }
    }
    // Next, try DOM-style addEventListener
    if (sock && typeof sock.addEventListener === 'function') {
        try {
            sock.addEventListener('message', handler);
            return () => {
                try {
                    sock.removeEventListener?.('message', handler);
                } catch {
                }
            };
        } catch {
        }
    }
    // Fallback: property assignment
    if (sock) {
        try {
            (sock as any).onmessage = handler as any;
            return () => {
                try {
                    if ((sock as any).onmessage === handler) (sock as any).onmessage = null;
                } catch {
                }
            };
        } catch {
        }
    }
    // Last resort: no-op cleanup
    return () => {
    };
}

/**
 * Map various incoming shapes to a ChatMessage, with optional decryption.
 * Uses `addOnce` to de-duplicate by a stable signature (id or composite key).
 */
export async function mapIncomingToChatMessage(
    m: any,
    opts: {
        token?: string | null;
        sharedKeyHex?: string;
        fallbackRoomId: string;
        localUserId: number;
        receivedSet: Set<string>;
        decryptLabel?: string;
    }
): Promise<ChatMessage | null> {
    try {
        // Skip empty content frames
        try {
            if (m?.content === "{}") return null;
        } catch {
        }

        const createdAtVal = m.created_at || m.createdAt || new Date().toISOString();
        const roomIdForKey = m.roomId || opts.fallbackRoomId || '';
        const senderIdForKey = String(m.senderId ?? '');

        // Stable signature to dedupe messages
        const messageSignature = m.id
            ? `id:${m.id}`
            : `room:${roomIdForKey}|sender:${senderIdForKey}|ts:${createdAtVal}|content:${m.content}`;

        if (!addOnce(opts.receivedSet, messageSignature)) {
            return null; // duplicate
        }

        // Optional decrypt (only when looks like base64 and we have key+token)
        let content = m.content;

        if (opts.token && opts.sharedKeyHex && typeof m.content === 'string' && isBase64Like(m.content)) {
            try {
                const aesKey = await importAesKey(opts.sharedKeyHex, 'decrypt');
                const plain = await decrypt(m.content, aesKey);
                if (plain && plain.length > 0) content = plain;
                console.log("content: ", plain)

            } catch {
                console.warn('mapIncomingToChatMessage: failed to decrypt message', m);
            }
        }

        const roomIdMapped = m.roomId || opts.fallbackRoomId;
        const senderIdMapped = Number(m.senderId) || 0;
        const createdAtMapped = m.created_at || m.createdAt || createdAtVal;

        return {
            id: m.id,
            senderId: senderIdMapped,
            roomId: roomIdMapped,
            content,
            status: m.status,
            createdAt: createdAtMapped,
            isOwner: senderIdMapped === opts.localUserId,
        } as ChatMessage;
    } catch {
        return null;
    }
}

// ===== Room listeners (shared across contexts) =====
export type RoomListener = { roomId: string; fn: (event: MessageEvent) => void };
const __roomListeners = new Map<string, RoomListener>();

/** Register a listener for a specific room id under a unique key. */
export function addRoomListener(key: string, roomId: string, fn: (event: MessageEvent) => void) {
    __roomListeners.set(key, {roomId: String(roomId), fn});
}

/** Remove a previously registered listener by key. */
export function removeRoomListener(key: string) {
    __roomListeners.delete(key);
}

function __pickRoomId(payload: any): string | null {
    if (!payload) return null;
    const norm = (v: any) => {
        if (!v) return null;
        let s = String(v);
        if (s.startsWith('room:')) s = s.slice(5);
        return s || null;
    };
    try {
        if (Array.isArray(payload) && payload.length > 0) {
            const h = payload[0];
            return norm(h?.roomId ?? h?.roomId ?? h?.topic);
        }
        return norm(payload?.roomId ?? payload?.roomId ?? payload?.topic);
    } catch {
        return null;
    }
}

/** Broadcast payload to listeners of its room (or to all if the room cannot be determined). */
export function broadcastToListeners(payload: unknown): void {
    const event = {data: JSON.stringify(payload)} as MessageEvent;
    try {
        (globalThis as any).__rtLast = payload;
    } catch {
    }

    let pid: string | null;
    try {
        const parsed = typeof payload === 'string' ? JSON.parse(payload as any) : payload;
        pid = __pickRoomId(parsed);
    } catch {
        pid = null;
    }

    if (pid) {
        for (const {roomId, fn} of __roomListeners.values()) {
            if (String(roomId) === String(pid)) fn(event);
        }
        return;
    }
    // Fallback: broadcast to all
    for (const {fn} of __roomListeners.values()) fn(event);
}

// Utility to wait for sharedKey with a timeout
const waitForSharedKey = (timeoutMs: number = 5000): Promise<string | undefined> => {
    return new Promise((resolve) => {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const sharedKey = UserService.Instance.authInfo?.sharedKey;
            if (sharedKey) {
                clearInterval(interval);
                resolve(sharedKey);
            } else if (Date.now() - startTime >= timeoutMs) {
                clearInterval(interval);
            }
        }, 500);
    });
};

/**
 * Fetch one page of chat history via HTTP and map each item to ChatMessage.
 * The caller can decide how to broadcast the mapped messages.
 */
export async function fetchHistoryPage(
    params: { roomId: string; cursor: string | null; limit: number },
    deps: {
        localUserId: number;
        receivedSet: Set<string>;
        broadcast?: (m: import("lemmy-js-client").ChatMessage) => void;
    }
) {
    const res = await HttpService.client.getChatHistory({
        roomId: params.roomId,
        cursor: params.cursor ?? undefined,
        limit: params.limit,
        back: true,
    } as any);
    if (res.state !== REQUEST_STATE.SUCCESS) return {prev: null, next: null} as any;

    const resp = res.data as any;
    const items = Array.isArray(resp?.results) ? resp.results : [];

    const realToken = UserService.Instance.auth();
    let sharedKey = UserService.Instance.authInfo?.sharedKey;
    if (!sharedKey) {
        sharedKey = await waitForSharedKey(5000);
        if (!sharedKey) {
            console.warn(`fetchHistory: No sharedKey available after timeout for room ${params.roomId}`);
            return;
        }
    }

    const mappedItems: any[] = [];

    for (const view of items) {
        const m = {
            ...view.message,
            roomId: view.room?.id || view.message?.roomId,
        };

        const mapped = await mapIncomingToChatMessage(m, {
            token: realToken,
            sharedKeyHex: sharedKey,
            fallbackRoomId: params.roomId + "hello",
            localUserId: deps.localUserId,
            receivedSet: deps.receivedSet,
            decryptLabel: "history line",
        });

        if (mapped) {
            mappedItems.push(mapped);
            if (deps.broadcast) deps.broadcast(mapped);
        }
    }

    return {
        prev: resp.prevPage,
        next: resp.nextPage,
        items: mappedItems,
    };
}

// Type guard: ensure we only treat real chat messages (not typing frames) as messages
export function isChatMessageLike(m: any): m is {
    id: string;
    roomId: string;
    senderId: number;
    content: string;
    createdAt: string
} {
    return !!(
        m && typeof m === 'object' &&
        typeof m.id === 'string' &&
        (typeof m.roomId === 'string') &&
        (typeof m.senderId === 'number') &&
        typeof m.content === 'string' && m.content.trim() !== '' &&
        typeof (m.createdAt) === 'string'
    );
}

/**
 * Emit-based read acker for sockets that expose `.emit(event, payload)` instead of Phoenix Channel `.push(...)`.
 * - Debounced (50ms) to avoid flooding
 * - Monotonic for numeric ids, de-dupe for string/UUID ids
 */
/**
 * Emit-based read acker for sockets that expose `.emit(event, payload)`.
 * เปิดดีบักด้วย: localStorage.setItem('debug_read_ack','1')
 */
export function makeEmitReadAcker(
    emit: (event: string, payload: any) => void,
    roomId: string,
    initialPointer: number | string = 0
) {
    const DBG =
        typeof window !== 'undefined' &&
        typeof window.localStorage !== 'undefined' &&
        window.localStorage.getItem('debug_read_ack') === '1';

    let maxPointerNum = Number.isFinite(Number(initialPointer)) ? Number(initialPointer) : -Infinity;
    let lastIdStr: string | null = typeof initialPointer === 'string' ? String(initialPointer) : null;

    let scheduled = false;
    let pendingIdStr: string | null = null;

    if (DBG) {
        try {
            console.log('[read-ack][emit] init', {roomId, initialPointer, maxPointerNum, lastIdStr});
        } catch {
        }
    }

    const schedulePush = () => {
        if (scheduled || !pendingIdStr) return;
        scheduled = true;
        if (DBG) {
            try {
                console.log('[read-ack][emit] schedule', {roomId, pendingIdStr});
            } catch {
            }
        }
        setTimeout(() => {
            scheduled = false;
            if (!pendingIdStr) return;
            const payload = {
                roomId: roomId,
                lastReadMessageId: pendingIdStr,
            };
            if (DBG) {
                try {
                    console.log('[read-ack][emit] push', payload);
                } catch {
                }
            }
            try {
                emit('chat:read', payload);
            } catch (e) {
                try {
                    console.warn('[read-ack][emit] push failed', e);
                } catch {
                }
            } finally {
                pendingIdStr = null;
            }
        }, 50);
    };

    return function ack(messageId: number | string | null | undefined) {
        if (messageId == null) {
            if (DBG) {
                try {
                    console.log('[read-ack][emit] skip:null');
                } catch {
                }
            }
            return;
        }

        const idStr = String(messageId);
        const idNum = Number(messageId);

        if (Number.isFinite(idNum)) {
            if (idNum <= maxPointerNum) {
                if (DBG) {
                    try {
                        console.log('[read-ack][emit] skip:not-advancing', {roomId, idNum, maxPointerNum});
                    } catch {
                    }
                }
                return;
            }
            maxPointerNum = idNum;
            lastIdStr = idStr;
            if (DBG) {
                try {
                    console.log('[read-ack][emit] accept:numeric', {roomId, idNum, maxPointerNum});
                } catch {
                }
            }
        } else {
            if (lastIdStr === idStr) {
                if (DBG) {
                    try {
                        console.log('[read-ack][emit] skip:dup-uuid', {roomId, idStr});
                    } catch {
                    }
                }
                return;
            }
            lastIdStr = idStr;
            if (DBG) {
                try {
                    console.log('[read-ack][emit] accept:uuid', {roomId, idStr});
                } catch {
                }
            }
        }

        pendingIdStr = idStr;
        schedulePush();
    };
}
