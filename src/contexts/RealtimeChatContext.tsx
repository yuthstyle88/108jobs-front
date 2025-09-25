"use client";

import {useRouter} from "next/navigation";
import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from "react";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {decrypt, encrypt} from "@/lib/web-crypto";
import {HttpService, UserService} from "@/services";
import type {ChatMessage} from "lemmy-js-client";
import {v4 as uuidv4} from "uuid";
import {
    addOnce,
    getReceiverIdFromRoom,
    isBase64Like,
    safeParse,
    unwrapPhoenixFrame,
    isValidIncomingChatPayload,
    isValidOutgoingChatPayload
} from "@/utils/chat-socket-utils";
import {REQUEST_STATE} from "@/services/HttpService";
import {ensureSharedKeyForRoom, importAesKey} from "@/utils";
import {isBrowser} from "@/utils/browser";

async function mapIncomingToChatMessage(
    m: any,
    opts: {
        token?: string | null;
        sharedKeyHex?: string;
        fallbackRoomId: string;
        localUserId: number;
        receivedSet: Set<string>;
        decryptLabel: string;
    }
): Promise<ChatMessage | null> {
    try {
        try {
            // console.log('[CHAT][MAP] mapIncomingToChatMessage', m);
            if (m.content == "{}") return null;
        } catch {
        }
        const createdAtVal = m.created_at || m.createdAt || new Date().toISOString();
        const roomIdForKey = m.room_id || m.roomId || opts.fallbackRoomId || '';
        const senderIdForKey = String(m.sender_id ?? m.senderId ?? '');
        // Prefer stable server id when present; otherwise use a composite key to avoid duplicates across sources
        const messageSignature = m.id
            ? `id:${m.id}`
            : `room:${roomIdForKey}|sender:${senderIdForKey}|ts:${createdAtVal}|content:${m.content}`;
        const sig = messageSignature;

        if (!addOnce(opts.receivedSet, messageSignature)) {
            try {
                console.debug('[CHAT][DROP] duplicate signature', sig, 'payload=', m);
            } catch {
            }
            return null;
        }
        try {
            console.debug('[CHAT][MAP] accept signature', sig);
        } catch {
        }

        let content = m.content;
        if (opts.token && opts.sharedKeyHex && isBase64Like(m.content)) {
            try {
                const aesKey = await importAesKey(opts.sharedKeyHex, 'decrypt');
                const plain = await decrypt(m.content, opts.token, aesKey);
                if (plain.length > 0) content = plain;
            } catch (e) {
                // console.warn(`onmessage: Decryption failed for ${opts.decryptLabel}`, e);
            }
        }

        const roomIdMapped = m.room_id || m.roomId || opts.fallbackRoomId;
        const senderIdMapped = Number(m.sender_id ?? m.senderId) || 0;
        const receiverIdMapped = Number(m.receiver_id ?? m.receiverId) || getReceiverIdFromRoom(roomIdMapped);
        const createdAtMapped = m.created_at || m.createdAt || createdAtVal;

        return {
            id: m.id || `msg_${uuidv4()}`,
            senderId: senderIdMapped,
            roomId: roomIdMapped,
            content,
            status: typeof m.status === 'number' ? m.status : 1,
            createdAt: createdAtMapped,
            isOwner: senderIdMapped === opts.localUserId,
        };
    } catch (e) {
        console.error('onmessage: error mapping payload', e);
        return null;
    }
}

interface MessagePayload {
    message: string;
    id?: string;
}

/**
 * Public API exposed by the Realtime chat WebSocket context.
 * Keep this minimal and stable; prefer adding helpers inside the provider.
 */
interface WebSocketContextValue {
    /** Send a chat message (handles encryption if configured). */
    sendMessage: (data: MessagePayload) => void;
    /** Notify others that the local user is typing or stopped typing. */
    sendTyping?: (isTyping: boolean) => void;
    /** Request next page of history over the socket if supported. */
    fetchHistory: () => Promise<void>;
    /** True if WebSocket is open and ready. */
    isConnected: boolean;
    /** Current room identifier. */
    roomId: string;
    /** True when server indicates there are more messages to fetch. */
    hasMoreMessages: boolean;
    /** True when a history fetch is in-flight. */
    isFetching: boolean;
}

const WebSocketContext = createContext<WebSocketContextValue | undefined>(undefined);

interface WebSocketProviderProps {
    token: string;
    roomId: string;
    peerPublicKeyHex?: string;
    children: React.ReactNode;
}

function broadcastToListeners(payload: unknown): void {
    const event = {data: JSON.stringify(payload)} as MessageEvent;
    try {
        (globalThis as any).__rtLast = payload;
    } catch {
    }

    const pickRoom = (p: any): string | null => {
        if (!p) return null;
        const norm = (v: any) => {
            if (!v) return null;
            let s = String(v);
            if (s.startsWith('room:')) s = s.slice(5);
            return s || null;
        };
        if (Array.isArray(p) && p.length > 0) {
            const h = p[0];
            return norm(h?.roomId ?? h?.room_id ?? h?.topic);
        }
        return norm(p?.roomId ?? p?.room_id ?? p?.topic);
    };

    let pid: string | null;
    try {
        pid = pickRoom(typeof payload === 'string' ? JSON.parse(payload as any) : payload);
    } catch {
        pid = null;
    }

    if (pid) {
        for (const {roomId, fn} of listeners.values()) {
            if (String(roomId) === String(pid)) fn(event);
        }
        return;
    }
    // Fallback: no identifiable room, broadcast to all
    for (const {fn} of listeners.values()) fn(event);
}


function timeoutMs(ms: number) {
    return ms;
}

/**
 * Handle a single incoming Phoenix-unwrapped payload.
 * Returns an array of mapped ChatMessage to broadcast (usually length 1),
 * and mutates pagination-related state via the provided setters when it is a history/pagination payload.
 */
async function handleIncomingPayload(
    payload: any,
    ctx: {
        roomId: string;
        localUserId: number;
        token: string | null | undefined;
        sharedKeyHex?: string;
        receivedSet: Set<string>;
        setPageCursor: (cursor: string | null) => void;
        setHasMoreMessages: (v: boolean) => void;
        setIsFetching: (v: boolean) => void;
        fetchTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
        fetchResolveRef: React.MutableRefObject<((value?: void) => void) | null>;
    }
): Promise<ChatMessage[] | null> {
    try {
        console.debug('[RT] handleIncomingPayload →', payload);
    } catch {
    }
    // Drop heartbeats / pings and null-ish frames early
    if (
        payload == null ||
        payload === 'pong' ||
        payload === 'ping' ||
        payload?.op === 'Ping' ||
        payload?.event === 'phx_leave' ||
        (typeof payload === 'object' && !Array.isArray(payload) && Object.keys(payload).length === 0)
    ) {
        return null;
    }
    const transformedItems: ChatMessage[] = [];

    // Normalize Phoenix shapes to a flat message-like object
    try {
        // Case 1: raw Phoenix array frame: [joinRef, msgRef, topic, event, payload]
        if (Array.isArray(payload) && payload.length >= 5 && typeof payload[3] === 'string' && payload[4] && typeof payload[4] === 'object') {
            const [, , topic, ev, body] = payload as [any, any, string, string, any];
            payload = {event: ev, topic: topic.replace(/^room:/, ''), ...body};
            try {
                console.debug('[RT] normalized from array frame →', payload);
            } catch {
            }
        }
        // Case 2: envelope shape from adapter: { event, topic, payload }
        else if (payload && typeof payload === 'object' && 'event' in payload && 'payload' in payload && typeof (payload as any).payload === 'object') {
            const env = payload as any;
            const topic = typeof env.topic === 'string' ? env.topic.replace(/^room:/, '') : env.topic;
            payload = {event: env.event, topic, ...(env.payload || {})};
            try {
                console.debug('[RT] normalized from envelope →', payload);
            } catch {
            }
        }
    } catch {
    }

    // ChatMessageView line: { message, sender, room }
    if (payload && typeof payload === 'object' && (payload as any).message) {
        const msgView = payload as any;
        const m = {...msgView.message, room_id: msgView.room?.id || msgView.message?.room_id};
        const mapped = await mapIncomingToChatMessage(m, {
            token: ctx.token,
            sharedKeyHex: ctx.sharedKeyHex,
            fallbackRoomId: ctx.roomId,
            localUserId: ctx.localUserId,
            receivedSet: ctx.receivedSet,
            decryptLabel: 'message line',
        });
        if (mapped) transformedItems.push(mapped);
        return transformedItems;
    }

    // Flat ChatMessage line: { id?, room_id/roomId/topic, sender_id/senderId, content, created_at?/createdAt? }
    if (payload && typeof payload === 'object' && Object.prototype.hasOwnProperty.call(payload, 'content')) {
        const m = (() => {
            const p: any = payload;
            const topic = typeof p.topic === 'string' ? p.topic.replace(/^room:/, '') : undefined;
            return { ...p, room_id: p.room_id ?? p.roomId ?? topic };
        })();

        // Guard: some backends send typing as JSON string in content
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
                    // never show typing to the typist
                    if (senderIdNum !== Number(ctx.localUserId)) {
                        if (typeof window !== 'undefined') {
                            window.dispatchEvent(new CustomEvent('chat:typing', { detail: info }));
                        }
                    }
                    return [];
                }
            }
        } catch {}

        const mapped = await mapIncomingToChatMessage(m, {
            token: ctx.token,
            sharedKeyHex: ctx.sharedKeyHex,
            fallbackRoomId: ctx.roomId,
            localUserId: ctx.localUserId,
            receivedSet: ctx.receivedSet,
            decryptLabel: 'flat message line',
        });
        if (mapped) {
            try { console.log('[RT] mapped flat message', mapped); } catch {}
            transformedItems.push(mapped);
        } else {
            // try { console.warn('[RT] flat message dropped (duplicate/invalid)', m); } catch {}
        }
        return transformedItems;
    }

    // Pagination message: prev/next page cursors
    if (payload && typeof payload === 'object' && ((payload as any).prevPage || (payload as any).prev_page || (payload as any).nextPage || (payload as any).next_page)) {
        const prev = (payload as any).prev_page ?? (payload as any).prevPage ?? null;
        const next = (payload as any).next_page ?? (payload as any).nextPage ?? null;
        if (typeof prev === 'string' && prev.length > 0) {
            ctx.setPageCursor(next);
            ctx.setHasMoreMessages(true);
        } else {
            ctx.setPageCursor(null);
            ctx.setHasMoreMessages(false);
        }
        if (ctx.fetchTimeoutRef.current) {
            clearTimeout(ctx.fetchTimeoutRef.current);
            ctx.fetchTimeoutRef.current = null;
        }
        ctx.setIsFetching(false);
        if (ctx.fetchResolveRef.current) {
            ctx.fetchResolveRef.current();
            ctx.fetchResolveRef.current = null;
        }
        return [];
    }

    // Unknown payload shape
    console.debug('onmessage: dropped unknown payload shape', payload);
    return null;
}

/** Fetch one page of history via HTTP and broadcast each mapped message. */
async function fetchHistoryPage(
    params: { roomId: string; cursor: string | null; limit: number },
    deps: {
        localUserId: number;
        receivedSet: Set<string>;
        broadcast: (m: ChatMessage) => void;
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
    const realShared = UserService.Instance.authInfo?.sharedKey;

    for (const view of items) {
        const m = {...view.message, room_id: view.room?.id || view.message?.room_id};
        const mapped = await mapIncomingToChatMessage(m, {
            token: realToken,
            sharedKeyHex: realShared,
            fallbackRoomId: params.roomId,
            localUserId: deps.localUserId,
            receivedSet: deps.receivedSet,
            decryptLabel: 'history line',
        });
        if (mapped) deps.broadcast(mapped);
    }

    return {prev: resp.prevPage ?? resp.prev_page ?? null, next: resp.nextPage ?? resp.next_page ?? null} as any;
}

export const PhoenixSocketProvider: React.FC<WebSocketProviderProps> = ({
                                                                            token,
                                                                            roomId,
                                                                            peerPublicKeyHex,
                                                                            children,
                                                                        }) => {
    const [isConnected, setIsConnected] = useState(false);
    // Generic socket holder: can be native WebSocket or Phoenix adapter
    const [socket, setSocket] = useState<any>(null);
    const currentSocketRef = useRef<any>(null);
    const [connectionError, setConnectionError] = useState(false);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const pageSize = 20;
    const [pageCursor, setPageCursor] = useState<string | null>(null);
    const lastTypedSentRef = useRef<boolean>(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const router = useRouter();
    const {localUser} = useMyUser();
    const isE2EMock = process.env.NEXT_PUBLIC_E2E_MODE === "mock";

    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isManuallyClosingRef = useRef(false);
    const [connectionAttemptKey, setConnectionAttemptKey] = useState(0);
    const sentMessagesRef = useRef<Set<string>>(new Set());
    const receivedMessagesRef = useRef<Set<string>>(new Set());
    const fetchResolveRef = useRef<((value?: void) => void) | null>(null);
    const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const phoenixPollRef = useRef<NodeJS.Timeout | null>(null);

    // Always use Phoenix transport for chat realtime
    // TODO: remove temporary receiver fallback when backend provides proper mapping

    const fetchHistory = useCallback(() => {
        return new Promise<void>(async (resolve, reject) => {
            if (isE2EMock) {
                resolve();
                return;
            }

            if (!hasMoreMessages || isFetching) {
                resolve();
                return;
            }

            try {
                setIsFetching(true);
                fetchResolveRef.current = resolve;
                const {prev, next} = await fetchHistoryPage({roomId, cursor: pageCursor, limit: pageSize}, {
                    localUserId: Number(localUser?.id),
                    receivedSet: receivedMessagesRef.current,
                    broadcast: (m) => broadcastToListeners(m),
                });

                if (typeof (prev as any) === 'string' && (prev as any).length > 0) {
                    setPageCursor(next as any);
                    setHasMoreMessages(true);
                } else {
                    setPageCursor(null);
                    setHasMoreMessages(false);
                }

                setIsFetching(false);
                fetchResolveRef.current?.();
                fetchResolveRef.current = null;
            } catch (e) {
                setIsFetching(false);
                fetchResolveRef.current?.();
                fetchResolveRef.current = null;
                reject(e);
            }
        });
    }, [isE2EMock, roomId, localUser?.id, hasMoreMessages, isFetching, pageCursor, pageSize]);

    // Unified WebSocket connection effect (duplicates removed)
    useEffect(() => {
        if (isE2EMock) {
            setIsConnected(true);
            return;
        }
        if (!token || !roomId || !localUser) {
            return;
        }

        let cancelled = false;
        isManuallyClosingRef.current = false;

        (async () => {
            try {
                await ensureSharedKeyForRoom(roomId, peerPublicKeyHex);
            } catch (e) {
                console.warn(`WebSocketProvider: Pre-WS key derivation error for room ${roomId}`, e);
            }
            if (cancelled) return;

            const {getChannelAdapter} = await import("@/services/PhoenixSocketService");
            const newSocket = getChannelAdapter(token, roomId) as any;
            currentSocketRef.current = newSocket;
            setSocket(newSocket);

            newSocket.onopen = () => {
                setIsConnected(true);
                setConnectionError(false);
                isManuallyClosingRef.current = false;
                setPageCursor(null);
                setHasMoreMessages(true);
                setIsFetching(false);
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                    reconnectTimeoutRef.current = null;
                }
                try {
                    import("@/chat").then(m => m.emitWsReconnected()).catch(() => {
                        try {
                            window.dispatchEvent(new Event('ws:reconnected'));
                        } catch {
                        }
                    });
                } catch {
                    try {
                        window.dispatchEvent(new Event('ws:reconnected'));
                    } catch {
                    }
                }
            };

            const handleWSMessage = async (event: any) => {
                try {
                    console.debug('[WS RAW]', event.data);
                    const token = UserService.Instance.auth();
                    const sharedKeyHex = UserService.Instance.authInfo?.sharedKey;
                    let payload: any = unwrapPhoenixFrame(event);
                    console.debug('[WS UNWRAP]', payload);

                    if (!isValidIncomingChatPayload(payload)) {
                        console.debug('onmessage: payload not passing strict validator, attempting permissive mapping...', payload);
                    }

                    // Normalize to detect typing events from Phoenix envelopes
                    let env: any = payload;
                    try {
                        if (Array.isArray(payload) && payload.length >= 5 && typeof payload[3] === 'string' && payload[4] && typeof payload[4] === 'object') {
                            const [, , topic, ev, body] = payload as [any, any, string, string, any];
                            env = {event: ev, topic: String(topic).replace(/^room:/, ''), ...(body || {})};
                        } else if (payload && typeof payload === 'object' && 'event' in payload && 'payload' in payload) {
                            const p: any = payload;
                            const topic = typeof p.topic === 'string' ? p.topic.replace(/^room:/, '') : p.topic;
                            env = {event: p.event, topic, ...(p.payload || {})};
                        }
                    } catch {}

                    // Broadcast typing notifications to listeners (but never to the typist themselves)
                    try {
                        const evName = String((env as any)?.event || '');
                        if (evName && evName.includes('typing')) {
                            const senderIdNum = Number((env as any)?.sender_id ?? (env as any)?.senderId ?? 0);
                            const info = {
                                type: 'typing',
                                roomId: (env as any)?.topic || roomId,
                                senderId: senderIdNum,
                                typing:
                                    (env as any)?.typing ??
                                    (evName.includes('start') ? true : evName.includes('stop') ? false : !!(env as any)?.isTyping),
                            } as any;
                            // Do not show typing indicator to the person who is typing
                            if (senderIdNum !== Number(localUser?.id)) {
                                // Route typing via a dedicated DOM event so it doesn't render as a message bubble
                                try {
                                    if (typeof window !== 'undefined') {
                                        window.dispatchEvent(new CustomEvent('chat:typing', { detail: info }));
                                    }
                                } catch {}
                            }
                        }
                    } catch {}

                    const msgs = await handleIncomingPayload(payload, {
                        roomId,
                        localUserId: Number(localUser?.id),
                        token,
                        sharedKeyHex,
                        receivedSet: receivedMessagesRef.current,
                        setPageCursor,
                        setHasMoreMessages,
                        setIsFetching,
                        fetchTimeoutRef,
                        fetchResolveRef,
                    });

                    if (Array.isArray(msgs) && msgs.length) {
                        for (const item of msgs) broadcastToListeners(item);
                        try {
                            const last = msgs[msgs.length - 1] as any;
                            const detail = {
                                roomId: last.roomId,
                                content: last.content,
                                senderId: Number(last.senderId) || 0,
                                timestamp: last.createdAt || new Date().toISOString(),
                                unread: Number(last.senderId) !== Number(localUser?.id),
                            };
                            if (isBrowser()) {
                                try {
                                    import("@/chat").then(m => m.emitChatNewMessage(detail as any)).catch(() => window.dispatchEvent(new CustomEvent('chat:new-message', {detail})));
                                } catch {
                                    window.dispatchEvent(new CustomEvent('chat:new-message', {detail}));
                                }
                            }
                        } catch {
                        }
                    }
                } catch (e) {
                    setIsFetching(false);
                    if (fetchTimeoutRef.current) {
                        clearTimeout(fetchTimeoutRef.current);
                        fetchTimeoutRef.current = null;
                    }
                    if (fetchResolveRef.current) {
                        fetchResolveRef.current();
                        fetchResolveRef.current = null;
                    }
                    for (const {fn} of listeners.values()) fn(event);
                }
            };

            try {
                newSocket.onmessage = handleWSMessage;
                console.log('[WS] onmessage property installed');
            } catch (e) {
                try {
                    console.log('[WS] failed to set onmessage', e);
                } catch {
                }
            }

            if (typeof newSocket?.addEventListener === 'function') {
                try {
                    newSocket.addEventListener('message', handleWSMessage);
                    console.log('[WS] addEventListener("message") installed');
                } catch (e) {
                    try {
                        console.log('[WS] addEventListener install failed', e);
                    } catch {
                    }
                }
            }

            if (typeof newSocket?.on === 'function') {
                try {
                    newSocket.on('message', (payload: any) => handleWSMessage({data: JSON.stringify(payload)}));
                    console.log('[WS] emitter .on("message") installed');
                } catch (e) {
                    try {
                        console.log('[WS] emitter .on install failed', e);
                    } catch {
                    }
                }
            }

            // Start a safety poller that forwards the last Phoenix envelope if adapters don't fire events
            if (!phoenixPollRef.current) {
                console.log('[WS] starting fallback poller');
                let lastSig: string | null = null;
                phoenixPollRef.current = setInterval(() => {
                    try {
                        const env = (globalThis as any).__phoenixRTLast;
                        if (!env) return;
                        const sig = JSON.stringify(env);
                        if (sig === lastSig) return;
                        lastSig = sig;
                        handleWSMessage({data: JSON.stringify(env)});
                    } catch {
                    }
                }, 700);
            }

            newSocket.onclose = (event: any) => {
                if (phoenixPollRef.current) {
                    try {
                        clearInterval(phoenixPollRef.current);
                    } catch {
                    }
                    phoenixPollRef.current = null;
                }
                setIsConnected(false);

                if (isManuallyClosingRef.current) {
                    return;
                }

                if (fetchTimeoutRef.current) {
                    clearTimeout(fetchTimeoutRef.current);
                    fetchTimeoutRef.current = null;
                }

                if ([1008, 4000, 4400].includes(event.code)) {
                    setConnectionError(true);
                    return;
                }

                reconnectTimeoutRef.current = setTimeout(() => {
                    try {
                        currentSocketRef.current?.close?.();
                    } catch {
                    }
                    currentSocketRef.current = null;
                    setSocket(null);
                    setConnectionAttemptKey((prev) => prev + 1);
                }, 3000);
            };

            newSocket.onerror = () => {
                if (isManuallyClosingRef.current) {
                    return;
                }
                if (fetchTimeoutRef.current) {
                    clearTimeout(fetchTimeoutRef.current);
                    fetchTimeoutRef.current = null;
                }
                if (fetchResolveRef.current) {
                    fetchResolveRef.current();
                    fetchResolveRef.current = null;
                    setIsFetching(false);
                }
            };
        })();

        return () => {
            cancelled = true;
            isManuallyClosingRef.current = true;
            if (phoenixPollRef.current) {
                try {
                    clearInterval(phoenixPollRef.current);
                } catch {
                }
                phoenixPollRef.current = null;
            }
            try {
                currentSocketRef.current?.close?.();
            } catch {
            }
            if (fetchTimeoutRef.current) {
                clearTimeout(fetchTimeoutRef.current);
                fetchTimeoutRef.current = null;
            }
            if (fetchResolveRef.current) {
                fetchResolveRef.current();
                fetchResolveRef.current = null;
                setIsFetching(false);
            }
        };
    }, [connectionAttemptKey, localUser, roomId, token]);


    useEffect(() => {
        if (connectionError) {
            router.replace("/not-found");
        }
    }, [connectionError, router]);

    useEffect(() => {
        if (!socket) {
            return;
        }
    }, [socket]);

    const sendMessage = useCallback(
        async (data: MessagePayload) => {
            if (isE2EMock) {
                const messageId = data.id || `msg_${uuidv4()}`;
                const mockMessage = {
                    id: messageId,
                    senderId: Number(localUser?.id) || 0,
                    receiverId: getReceiverIdFromRoom(roomId),
                    roomId,
                    content: data.message,
                    createdAt: new Date().toISOString(),
                    status: 1,
                    isOwner: true,
                };
                broadcastToListeners(mockMessage);
                try {
                    const detail = {
                        roomId: roomId,
                        content: data.message,
                        senderId: Number(localUser?.id) || 0,
                        timestamp: (mockMessage as any).createdAt,
                        unread: false,
                    };
                    if (isBrowser()) {
                        try {
                            import("@/chat").then(m => m.emitChatNewMessage(detail as any)).catch(() => {
                                try {
                                    window.dispatchEvent(new CustomEvent('chat:new-message', {detail}));
                                } catch {
                                }
                            });
                        } catch {
                            try {
                                window.dispatchEvent(new CustomEvent('chat:new-message', {detail}));
                            } catch {
                            }
                        }
                    }
                } catch {
                }
                return;
            }

            if (!data.message?.trim()) {
                return;
            }

            const messageId = data.id || uuidv4();
            if (!addOnce(sentMessagesRef.current, messageId)) {
                return;
            }

            const apiPayload = {
                sender_id: Number(localUser?.id) || 0,
                room_id: roomId,
                content: data.message,
                id: messageId,
                createdAt: new Date().toISOString(),
            };

            let payload = apiPayload;
            try {
                const token = UserService.Instance.auth();
                if (token && !UserService.Instance.authInfo?.sharedKey) {
                    try {
                        await ensureSharedKeyForRoom(roomId, peerPublicKeyHex);
                    } catch (ex) {
                        console.warn(`sendMessage: Could not derive shared key for room, sending plaintext`, ex);
                    }
                }

                const sharedKeyHex = UserService.Instance.authInfo?.sharedKey;
                const shouldEncrypt = !!(token && sharedKeyHex && data.message && data.message.trim());
                if (shouldEncrypt) {
                    const aesKey = await importAesKey(sharedKeyHex!, "encrypt");
                    const encrypted = await encrypt(data.message, aesKey, token);
                    payload = {...apiPayload, content: encrypted};
                }
            } catch (e) {
                // console.warn(`sendMessage: E2EE encryption failed, sending plaintext`, e);
            }

            if (!isValidOutgoingChatPayload(payload)) {
                console.warn('sendMessage: Invalid outgoing payload. Message not sent.', payload);
                return;
            }

            if (socket?.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify(payload));
                // best-effort: stop typing after sending a message
                try {
                    (socket as any)?.emit?.('typing:stop', { room_id: roomId, sender_id: Number(localUser?.id) || 0, typing: false });
                } catch {}
                lastTypedSentRef.current = false;
            } else {
                console.warn(`sendMessage: WebSocket not ready, state: ${socket?.readyState}`);
            }
        },
        [socket, isE2EMock, roomId, localUser?.id]
    );

    const sendTyping = useCallback((isTyping: boolean) => {
        try {
            if (isE2EMock) {
                // In mock mode, do not broadcast typing back to self
                lastTypedSentRef.current = isTyping;
                return;
            }
            lastTypedSentRef.current = isTyping;
            const payload = { room_id: roomId, sender_id: Number(localUser?.id) || 0, typing: isTyping } as any;
            (socket as any)?.emit?.('typing', payload);
            (socket as any)?.emit?.(isTyping ? 'typing:start' : 'typing:stop', payload);
        } catch {}
    }, [socket, roomId, localUser?.id, isE2EMock]);

    return (
        <WebSocketContext.Provider
            value={{sendMessage, sendTyping, fetchHistory, isConnected, roomId, hasMoreMessages, isFetching}}>
            {children}
        </WebSocketContext.Provider>
    );
};

type Listener = { roomId: string; fn: (event: MessageEvent) => void };
const listeners = new Map<string, Listener>();

export const useWebSocket = (
    key: string,
    onMessage: (event: MessageEvent<string | ChatMessage | ChatMessage[]>) => void
): WebSocketContextValue => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error("useWebSocket must be used within WebSocketProvider");
    }

    useEffect(() => {
        // normal chat message binding
        listeners.set(key, { roomId: context.roomId, fn: onMessage as any });

        // also forward typing events for the active room
        const onTyping = (e: Event) => {
          const detail = (e as CustomEvent).detail as any;
          if (!detail) return;
          if (String(detail.roomId) !== String(context.roomId)) return;
          // deliver a synthetic MessageEvent so existing handlers can branch on data.type === 'typing'
          const evt = new MessageEvent('message', { data: { type: 'typing', ...detail } });
          onMessage(evt as any);
        };

        if (typeof window !== 'undefined') {
          window.addEventListener('chat:typing', onTyping);
        }

        return () => {
          listeners.delete(key);
          if (typeof window !== 'undefined') {
            window.removeEventListener('chat:typing', onTyping);
          }
        };
    }, [key, onMessage, context.roomId]);

    return context;
};