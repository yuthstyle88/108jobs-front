"use client";

import {useRouter} from "next/navigation";
import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from "react";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {encrypt} from "@/lib/web-crypto";
import {HttpService, UserService} from "@/services";
import type {ChatMessage} from "lemmy-js-client";
import {v4 as uuidv4} from "uuid";
import {
    addOnce,
    getReceiverIdFromRoom,
    unwrapPhoenixFrame,
    isValidIncomingChatPayload,
    isValidOutgoingChatPayload,
    installBestMessageListener,
    // shared helpers moved to utils
    broadcastToListeners,
    handleIncomingPayload,
    addRoomListener,
    removeRoomListener,
    fetchHistoryPage,
} from "@/utils/chat-socket-utils";
import {ensureSharedKeyForRoom, importAesKey} from "@/utils";
import {isBrowser} from "@/utils/browser";
import {REQUEST_STATE} from "@/services/HttpService";


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
    /** Notify others need room update to fetch new. */
    sendRoomUpdate: (roomId: string, update: Record<string, any>) => void;
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
    refreshRoomData: any;
}

const WebSocketContext = createContext<WebSocketContextValue | undefined>(undefined);

interface WebSocketProviderProps {
    token: string;
    roomId: string;
    peerPublicKeyHex?: string;
    children: React.ReactNode;
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
    const [refreshRoomData, setRefreshRoomData] = useState<any>(null);
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
        // variable to hold the removeListener cleanup function
        let removeListener: (() => void) | undefined;

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
                    const token = UserService.Instance.auth();
                    const sharedKeyHex = UserService.Instance.authInfo?.sharedKey;
                    let payload: any = unwrapPhoenixFrame(event);

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
                    } catch {
                    }

                    try {
                        const evName = String((env as any)?.content || '');
                        if (evName && evName.includes('status-change')) {
                            try {
                                const chatRoomRes = await HttpService.client.getChatRoom(roomId);
                                if (chatRoomRes.state === REQUEST_STATE.SUCCESS) {
                                    setRefreshRoomData(chatRoomRes.data);
                                }
                            } catch (err) {
                                console.error("Error fetching room:", err);
                            }

                            return null;
                        }
                    } catch {
                    }


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
                                        window.dispatchEvent(new CustomEvent('chat:typing', {detail: info}));
                                    }
                                } catch {
                                }
                            }
                        }
                    } catch {
                    }

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
                    try { broadcastToListeners(unwrapPhoenixFrame(event)); } catch {}
                }
            };

            // Attach exactly ONE message listener
            removeListener = installBestMessageListener(newSocket, handleWSMessage);

            // Start a safety poller only if no listener could be installed
            if (!removeListener || typeof removeListener !== 'function') {
                removeListener = () => {};
            }
            if (!phoenixPollRef.current && removeListener === undefined) {
                console.log('[WS] starting fallback poller');
                let lastSig: string | null = null;
                phoenixPollRef.current = setInterval(() => {
                    try {
                        const env = (globalThis as any).__phoenixRTLast;
                        if (!env) return;
                        const sig = JSON.stringify(env);
                        if (sig === lastSig) return;
                        lastSig = sig;
                        handleWSMessage({ data: JSON.stringify(env) });
                    } catch {}
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
            try {
                // Remove installed listener if present
                // (we capture it via closure because installBestMessageListener returned it)
                if (removeListener) removeListener();
            } catch {}
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
                    (socket as any)?.emit?.('typing:stop', {
                        room_id: roomId,
                        sender_id: Number(localUser?.id) || 0,
                        typing: false
                    });
                } catch {
                }
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
            const payload = {room_id: roomId, sender_id: Number(localUser?.id) || 0, typing: isTyping} as any;
            (socket as any)?.emit?.('typing', payload);
            (socket as any)?.emit?.(isTyping ? 'typing:start' : 'typing:stop', payload);
        } catch {
        }
    }, [socket, roomId, localUser?.id, isE2EMock]);

    const sendRoomUpdate = useCallback(
        (roomId: string, update: Record<string, any>) => {
            try {
                if (isE2EMock) {
                    // In mock mode, do not broadcast over socket
                    console.debug('Mock room update:', {roomId, ...update});
                    return;
                }

                const payload = {
                    room_id: roomId,
                    sender_id: Number(localUser?.id) || 0,
                    ...update,
                };

                (socket as any)?.emit?.('room:update', payload);
            } catch (err) {
                console.error('Failed to send room update', err);
            }
        },
        [socket, localUser?.id, isE2EMock]
    );

    const fetchHistory = useCallback(async () => {
        if (isE2EMock) return;
        if (isFetching) return;
        if (!hasMoreMessages) return;
        setIsFetching(true);
        try {
            const { prev, next } = await fetchHistoryPage(
                { roomId, cursor: pageCursor, limit: pageSize },
                {
                    localUserId: Number(localUser?.id) || 0,
                    receivedSet: receivedMessagesRef.current,
                    broadcast: (m) => broadcastToListeners(m),
                }
            );
            // Mirror pagination behavior used elsewhere: prev exists => more pages; move cursor to next
            if (typeof prev === 'string' && prev.length > 0) {
                setPageCursor(next);
                setHasMoreMessages(true);
            } else {
                setPageCursor(null);
                setHasMoreMessages(false);
            }
        } catch (e) {
            // best-effort: stop loading state
            console.error('fetchHistory failed', e);
        } finally {
            setIsFetching(false);
        }
    }, [isE2EMock, isFetching, hasMoreMessages, roomId, pageCursor, pageSize, localUser?.id]);

    return (
        <WebSocketContext.Provider
            value={{
                sendMessage,
                sendTyping,
                sendRoomUpdate,
                fetchHistory,
                isConnected,
                roomId,
                hasMoreMessages,
                isFetching,
                refreshRoomData
            }}>
            {children}
        </WebSocketContext.Provider>
    );
};


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
        addRoomListener(key, context.roomId, onMessage as any);

        // also forward typing events for the active room
        const onTyping = (e: Event) => {
            const detail = (e as CustomEvent).detail as any;
            if (!detail) return;
            if (String(detail.roomId) !== String(context.roomId)) return;
            // deliver a synthetic MessageEvent so existing handlers can branch on data.type === 'typing'
            const evt = new MessageEvent('message', {data: {type: 'typing', ...detail}});
            onMessage(evt as any);
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('chat:typing', onTyping);
        }

        return () => {
            removeRoomListener(key);
            if (typeof window !== 'undefined') {
                window.removeEventListener('chat:typing', onTyping);
            }
        };
    }, [key, onMessage, context.roomId]);

    return context;
};