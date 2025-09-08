"use client";

import {useRouter} from "next/navigation";
import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from "react";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {decrypt, encrypt} from "@/lib/web-crypto";
import {UserService} from "@/services";
import type {ChatMessage} from "lemmy-js-client";
import {v4 as uuidv4} from "uuid";
import {__DEV__, addOnce, buildWsUrl, getReceiverIdFromRoom, isBase64Like, logDebug, safeParse} from "@/utils/realtime";
import {ensureSharedKeyForRoom, importAesKey} from "@/utils/crypto";

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
        const createdAtVal = m.created_at || m.createdAt || new Date().toISOString();
        const messageSignature = `${m.content}:${createdAtVal}`;
        if (!addOnce(opts.receivedSet, messageSignature)) {
            return null;
        }

        let content = m.content;
        if (opts.token && opts.sharedKeyHex && isBase64Like(m.content)) {
            try {
                const aesKey = await importAesKey(opts.sharedKeyHex, 'decrypt');
                const plain = await decrypt(m.content, opts.token, aesKey);
                if (plain.length > 0) content = plain;
            } catch (e) {
                console.warn(`onmessage: Decryption failed for ${opts.decryptLabel}`, e);
            }
        }

        const roomIdMapped = m.room_id || m.roomId || opts.fallbackRoomId;
        const senderIdMapped = Number(m.sender_id ?? m.senderId) || 0;
        const receiverIdMapped = Number(m.receiver_id ?? m.receiverId) || getReceiverIdFromRoom(roomIdMapped);
        const createdAtMapped = m.created_at || m.createdAt || createdAtVal;

        return {
            id: m.id || `msg_${uuidv4()}`,
            senderId: senderIdMapped,
            receiverId: receiverIdMapped,
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
    children: React.ReactNode;
}

function broadcastToListeners(payload: unknown): void {
    const event = {data: JSON.stringify(payload)} as MessageEvent;
    logDebug(`broadcastToListeners: Broadcasting payload`, payload);
    for (const fn of listeners.values()) fn(event);
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
                                                                        token,
                                                                        roomId,
                                                                        children,
                                                                    }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [connectionError, setConnectionError] = useState(false);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const pageSize = 20;
    const [pageCursor, setPageCursor] = useState<string | null>(null);
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

    // TODO: remove temporary receiver fallback when backend provides proper mapping
    const wsUrl = buildWsUrl(token, roomId);

    const fetchHistory = useCallback(() => {
        return new Promise<void>((resolve, reject) => {
            if (isE2EMock) {
                resolve();
                return;
            }

            if (!hasMoreMessages || isFetching || !isConnected) {
                if (!isConnected) console.log('[WS][FETCH] Early return: not connected');
                else if (isFetching) console.log('[WS][FETCH] Early return: already fetching');
                else if (!hasMoreMessages) console.log('[WS][FETCH] Early return: no more messages');
                resolve();
                return;
            }

            setIsFetching(true);
            fetchResolveRef.current = resolve;

            const payload: any = {
                op: "FetchHistory",
                sender_id: Number(localUser?.id) || 0,
                room_id: roomId,
                content: "",
                page_cursor: pageCursor ?? undefined,
                page_back: true,
                limit: pageSize,
            };

            if (fetchTimeoutRef.current) {
                clearTimeout(fetchTimeoutRef.current);
                fetchTimeoutRef.current = null;
            }
            fetchTimeoutRef.current = setTimeout(() => {
                setIsFetching(false);
                fetchResolveRef.current = null;
                fetchTimeoutRef.current = null;
                console.warn('[WS][FETCH] Fetch history timeout after 5s');
                reject(new Error('Fetch history timeout after 5s'));
            }, 5000);

            try {
                if (socket?.readyState === WebSocket.OPEN) {
                    console.log('[WS][FETCH] Sending FetchHistory', {
                        page_cursor: payload.page_cursor,
                        page_back: payload.page_back,
                        limit: payload.limit
                    });
                    socket.send(JSON.stringify(payload));
                } else {
                    console.warn('[WS][FETCH] WebSocket not open');
                    setIsFetching(false);
                    if (fetchTimeoutRef.current) {
                        clearTimeout(fetchTimeoutRef.current);
                        fetchTimeoutRef.current = null;
                    }
                    reject(new Error('WebSocket not open'));
                }
            } catch (e) {
                console.error('[WS][FETCH] Error sending FetchHistory', e);
                setIsFetching(false);
                if (fetchTimeoutRef.current) {
                    clearTimeout(fetchTimeoutRef.current);
                    fetchTimeoutRef.current = null;
                }
                reject(e);
            }
        });
    }, [socket, isE2EMock, roomId, localUser?.id, hasMoreMessages, isFetching, isConnected, pageCursor, pageSize]);

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
                await ensureSharedKeyForRoom(roomId);
            } catch (e) {
                console.warn(`WebSocketProvider: Pre-WS key derivation error for room ${roomId}`, e);
            }
            if (cancelled) return;

            const newSocket = new WebSocket(wsUrl);
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
                if (__DEV__) console.debug(`WebSocket connected for room ${roomId}`);
            };

            newSocket.onmessage = async (event) => {
                if (__DEV__) {
                    try {
                        const preview = typeof event.data === 'string' ? event.data.slice(0, 200) : String(event.data);
                        console.log(`onmessage: raw event`, { type: typeof event.data, preview });
                    } catch {}
                }
                try {
                    const token = UserService.Instance.auth();
                    const sharedKeyHex = UserService.Instance.authInfo?.sharedKey;

                    let payload: any = safeParse(event.data);
                    if (payload === 'pong' || payload === 'ping' || payload?.op === 'Ping') {
                        return;
                    }
                    if (typeof payload === 'string') payload = safeParse(payload);

                    const transformedItems: ChatMessage[] = [];

                    // Plain ChatMessageView line: { message, sender, room }
                    if (payload && typeof payload === 'object' && payload.message) {
                        const msgView = payload;
                        const m = { ...msgView.message, room_id: msgView.room?.id || msgView.message?.room_id };
                        const mapped = await mapIncomingToChatMessage(m, {
                            token,
                            sharedKeyHex,
                            fallbackRoomId: roomId,
                            localUserId: Number(localUser?.id),
                            receivedSet: receivedMessagesRef.current,
                            decryptLabel: 'message line',
                        });
                        if (mapped) transformedItems.push(mapped);
                    }
                    // Flat ChatMessage line: { id?, room_id, sender_id, content, created_at?, status? }
                    else if (payload && typeof payload === 'object' && (payload.content && (payload.room_id || payload.roomId))) {
                        const m = payload as any;
                        const mapped = await mapIncomingToChatMessage(m, {
                            token,
                            sharedKeyHex,
                            fallbackRoomId: roomId,
                            localUserId: Number(localUser?.id),
                            receivedSet: receivedMessagesRef.current,
                            decryptLabel: 'flat message line',
                        });
                        if (mapped) transformedItems.push(mapped);
                    }
                    // Plain pagination line: { prevPage/prev_page, nextPage/next_page }
                    else if (payload && typeof payload === 'object' && (payload.prevPage || payload.prev_page || payload.nextPage || payload.next_page)) {
                        const prev = payload.prev_page ?? payload.prevPage ?? null;
                        const next = payload.next_page ?? payload.nextPage ?? null;
                        if (typeof prev === 'string' && prev.length > 0) {
                            setPageCursor(next);
                            setHasMoreMessages(true);
                        } else {
                            setPageCursor(null);
                            setHasMoreMessages(false);
                        }
                        if (fetchTimeoutRef.current) {
                            clearTimeout(fetchTimeoutRef.current);
                            fetchTimeoutRef.current = null;
                        }
                        setIsFetching(false);
                        if (fetchResolveRef.current) {
                            fetchResolveRef.current();
                            fetchResolveRef.current = null;
                        }
                        console.log('[WS][FETCH] Applied cursors after pagination line', { prev, next });
                    }

                    if (transformedItems.length) {
                        broadcastToListeners(transformedItems[0]);
                    } else {
                        if (__DEV__) console.warn('onmessage: Ignored unsupported payload format');
                    }
                } catch (e) {
                    console.error('onmessage: Error processing WebSocket message', e);
                    setIsFetching(false);
                    if (fetchTimeoutRef.current) {
                        clearTimeout(fetchTimeoutRef.current);
                        fetchTimeoutRef.current = null;
                    }
                    if (fetchResolveRef.current) {
                        fetchResolveRef.current();
                        fetchResolveRef.current = null;
                    }
                    for (const fn of listeners.values()) fn(event);
                }
            };

            newSocket.onclose = (event) => {
                setIsConnected(false);
                if (__DEV__) console.log(`WebSocket closed for room ${roomId}. Code: ${event.code}, Reason: ${event.reason || "unknown"}`);

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
                    setSocket(null);
                    setConnectionAttemptKey((prev) => prev + 1);
                }, 3000);
            };

            newSocket.onerror = (err) => {
                if (isManuallyClosingRef.current) {
                    return;
                }
                console.error(`WebSocket error for room ${roomId}`, err);
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
            try {
                socket?.close();
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
    }, [wsUrl, connectionAttemptKey, localUser, roomId, token]);


    useEffect(() => {
        if (connectionError) {
            logDebug(`WebSocketProvider: Connection error detected, redirecting to /not-found`);
            router.replace("/not-found");
        }
    }, [connectionError, router]);

    useEffect(() => {
        if (!socket) {
            logDebug(`WebSocketProvider: Socket is null`);
            return;
        }
        logDebug(`WebSocketProvider: Socket state changed, readyState: ${socket.readyState}`);
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
                console.debug(`sendMessage: Emitting mock message`, mockMessage);
                broadcastToListeners(mockMessage);
                return;
            }

            if (!data.message?.trim()) {
                console.warn(`sendMessage: Cannot send empty message`);
                return;
            }

            console.log("sendMessage: Sending message", data.message, "to room", roomId, "from user", localUser?.id,)

            const messageId = data.id || uuidv4();
            if (!addOnce(sentMessagesRef.current, messageId)) {
                console.debug(`sendMessage: Ignored duplicate message ID ${messageId}`);
                return;
            }

            const apiPayload = {
                op: "SendMessage",
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
                        await ensureSharedKeyForRoom(roomId);
                        console.debug(`sendMessage: Ensured shared key for room ${roomId}`);
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
                    console.debug(`sendMessage: Encrypted message for sending`);
                }
            } catch (e) {
                console.warn(`sendMessage: E2EE encryption failed, sending plaintext`, e);
            }

            if (socket?.readyState === WebSocket.OPEN) {
                console.debug(`sendMessage: Sending WebSocket message`, payload);
                socket.send(JSON.stringify(payload));
            } else {
                console.warn(`sendMessage: WebSocket not ready, state: ${socket?.readyState}`);
            }
        },
        [socket, isE2EMock, roomId, localUser?.id]
    );

    return (
        <WebSocketContext.Provider
            value={{sendMessage, fetchHistory, isConnected, roomId, hasMoreMessages, isFetching}}>
            {children}
        </WebSocketContext.Provider>
    );
};

const listeners = new Map<string, (event: MessageEvent) => void>();

export const useWebSocket = (
    key: string,
    onMessage: (event: MessageEvent<string | ChatMessage | ChatMessage[]>) => void
): WebSocketContextValue => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error("useWebSocket must be used within WebSocketProvider");
    }

    useEffect(() => {
        logDebug(`useWebSocket: Registered listener for key ${key}`);
        listeners.set(key, onMessage);
        return () => {
            logDebug(`useWebSocket: Unregistered listener for key ${key}`);
            listeners.delete(key);
        };
    }, [key, onMessage]);

    return context;
};