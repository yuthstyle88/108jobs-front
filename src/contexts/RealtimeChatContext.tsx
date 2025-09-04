"use client";

import { useRouter } from "next/navigation";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useMyUser } from "@/hooks/profile-api/useMyUser";
import { encrypt, decrypt } from "@/lib/web-crypto";
import { UserService } from "@/services";
import { ChatMessage } from "@/types/chat";
import { v4 as uuidv4 } from "uuid";

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

import { buildWsUrl, isBase64Like, __DEV__, logDebug, logWarn, safeParse, getReceiverIdFromRoom, addOnce } from "@/utils/realtime";
import { ensureSharedKeyForRoom, importAesKey } from "@/utils/crypto";

function broadcastToListeners(payload: unknown): void {
    const event = { data: JSON.stringify(payload) } as MessageEvent;
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
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const pageSize = 10;
    const [afterId, setAfterId] = useState<number | null>(null);
    const router = useRouter();
    const { localUser } = useMyUser();
    const isE2EMock = process.env.NEXT_PUBLIC_E2E_MODE === "mock";

    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isManuallyClosingRef = useRef(false);
    const [connectionAttemptKey, setConnectionAttemptKey] = useState(0);
    const sentMessagesRef = useRef<Set<string>>(new Set());
    const receivedMessagesRef = useRef<Set<string>>(new Set());
    const fetchResolveRef = useRef<((value?: void) => void) | null>(null);

    // TODO: remove temporary receiver fallback when backend provides proper mapping
    const tempReceiverId = 3;
    const wsUrl = buildWsUrl(token, roomId);

    const fetchHistory = useCallback(() => {
        return new Promise<void>((resolve, reject) => {
            if (isE2EMock) {
                resolve();
                return;
            }

            if (!hasMoreMessages || isFetching || !isConnected) {
                resolve();
                return;
            }

            setIsFetching(true);
            fetchResolveRef.current = resolve;

            const cursorPayload: any = {
                op: "FetchHistory",
                sender_id: Number(localUser?.id) || 0,
                receiver_id: tempReceiverId,
                room_id: roomId,
                content: "",
                after_id: afterId ?? undefined,
                limit: pageSize,
            };
            const payload = {
                ...cursorPayload,
                page: currentPage,
                page_size: pageSize,
            };

            const timeout = setTimeout(() => {
                setIsFetching(false);
                fetchResolveRef.current = null;
                reject(new Error('Fetch history timeout after 5s'));
            }, 5000);

            try {
                if (socket?.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify(payload));
                    setCurrentPage((prev) => prev + 1);
                } else {
                    setIsFetching(false);
                    clearTimeout(timeout);
                    reject(new Error('WebSocket not open'));
                }
            } catch (e) {
                setIsFetching(false);
                clearTimeout(timeout);
                reject(e);
            }
        });
    }, [socket, isE2EMock, roomId, localUser?.id, currentPage, hasMoreMessages, isFetching, afterId, isConnected]);

    useEffect(() => {
        if (isE2EMock) {
            console.debug(`WebSocketProvider: Mock mode enabled, setting isConnected to true`);
            setIsConnected(true);
            return;
        }
        if (!token || !roomId || !localUser) {
            console.debug(`WebSocketProvider: Missing prerequisites - token: ${!!token}, roomId: ${!!roomId}, localUser: ${!!localUser}`);
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
            if (cancelled) {
                return;
            }

            const newSocket = new WebSocket(wsUrl);
            setSocket(newSocket);

            newSocket.onopen = () => {
                setIsConnected(true);
                setConnectionError(false);
                isManuallyClosingRef.current = false;
                setAfterId(null);
                setHasMoreMessages(true);
                setIsFetching(false);
                setCurrentPage(1);
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                    reconnectTimeoutRef.current = null;
                }
                console.log(`[WS] WebSocket connected for room ${roomId}`);
            };

            newSocket.onmessage = async (event) => {
                try {
                    const token = UserService.Instance.auth();
                    const sharedKeyHex = UserService.Instance.authInfo?.sharedKey;

                    let parsed: any = safeParse(event.data);
                    if (parsed === 'pong' || parsed === 'ping' || parsed?.op === 'Ping') {
                        return;
                    }
                    if (typeof parsed === "string") parsed = safeParse(parsed);

                    const items: any[] = Array.isArray(parsed) ? parsed : parsed && typeof parsed === "object" ? [parsed] : [];
                    logDebug(`[WS][MSG] Parsed ${items.length} items from event data`, { parsed });

                    const transformedItems: ChatMessage[] = [];

                    if (parsed?.op === "FetchHistory" && Array.isArray(parsed.messages)) {
                        if (parsed.room_id !== roomId) {
                            return;
                        }

                        setIsFetching(false);
                        if (parsed.messages.length < pageSize) {
                            setHasMoreMessages(false);
                        }

                        for (const msg of parsed.messages) {
                            const createdAtVal = msg.created_at || msg.createdAt || new Date().toISOString();
                            const messageSignature = `${msg.content}:${createdAtVal}`;
                            if (!addOnce(receivedMessagesRef.current, messageSignature)) {
                                continue;
                            }

                            let content = msg.content;
                            if (token && sharedKeyHex && isBase64Like(msg.content)) {
                                try {
                                    const aesKey = await importAesKey(sharedKeyHex, "decrypt");
                                    const plain = await decrypt(msg.content, token, aesKey);
                                    if (plain.length > 0) {
                                        content = plain;
                                    }
                                } catch (e) {
                                    console.warn(`[WS][MSG] Decryption failed for FetchHistory message`, e);
                                }
                            }

                            transformedItems.push({
                                id: msg.id || `msg_${uuidv4()}`,
                                senderId: Number(msg.sender_id) || 0,
                                receiverId: Number(msg.receiver_id) || getReceiverIdFromRoom(roomId),
                                roomId: msg.room_id || roomId,
                                content,
                                status: typeof msg.status === "number" ? msg.status : 1,
                                createdAt: createdAtVal,
                                isOwner: Number(msg.sender_id) === Number(localUser?.id),
                            });
                        }
                        if (fetchResolveRef.current) {
                            fetchResolveRef.current();
                            fetchResolveRef.current = null;
                            console.log('[WS][MSG] Resolved fetchHistory Promise');
                        }
                    } else {
                        console.warn('[WS][MSG] Unhandled message format', { parsed });
                    }

                    if (transformedItems.length) {
                        let toBroadcast: any = transformedItems[0];
                        if (parsed?.op === "FetchHistory") {
                            toBroadcast = transformedItems;
                            const ids = parsed.messages
                                .map((m: any) => (typeof m.id === 'number' ? m.id : Number(m.id)))
                                .filter((n: any) => typeof n === 'number' && !isNaN(n));
                            if (ids.length) {
                                setAfterId(Math.min(...ids));
                                console.log('[WS][MSG] Updated afterId', { afterId: Math.min(...ids) });
                            }
                        } else if (Array.isArray(parsed)) {
                            toBroadcast = transformedItems;
                        }
                        logDebug(`[WS][MSG] Broadcasting ${transformedItems.length} transformed items`);
                        broadcastToListeners(toBroadcast);
                    } else {
                        console.warn(`[WS][MSG] No valid items to transform`, { parsed });
                        if (fetchResolveRef.current) {
                            setIsFetching(false);
                            fetchResolveRef.current();
                            fetchResolveRef.current = null;
                        }
                    }
                } catch (e) {
                    console.error(`[WS][MSG] Error processing WebSocket message`, e, { rawData: event.data });
                    setIsFetching(false); // Reset isFetching on error
                    if (fetchResolveRef.current) {
                        fetchResolveRef.current();
                        fetchResolveRef.current = null;
                    }
                    for (const fn of listeners.values()) fn(event);
                }
            };

            newSocket.onclose = (event) => {
                setIsConnected(false);
                setIsFetching(false);
            };

            newSocket.onerror = (err) => {
                if (isManuallyClosingRef.current) {
                    return;
                }
                console.error(`[WS] WebSocket error for room ${roomId}`, err);
                setIsFetching(false); // Reset isFetching on error
                if (fetchResolveRef.current) {
                    fetchResolveRef.current();
                    fetchResolveRef.current = null;
                }
            };
        })();

        return () => {
            cancelled = true;
            isManuallyClosingRef.current = true;
            try {
                socket?.close();
            } catch {
                console.warn(`WebSocketProvider cleanup: Error closing WebSocket for room ${roomId}`);
            }
            if (fetchResolveRef.current) {
                fetchResolveRef.current();
                fetchResolveRef.current = null;
                setIsFetching(false);
            }
        };
    }, [wsUrl, connectionAttemptKey, localUser, roomId, token]);

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
            if (cancelled) {
                return;
            }

            const newSocket = new WebSocket(wsUrl);
            setSocket(newSocket);

            newSocket.onopen = () => {
                setIsConnected(true);
                setConnectionError(false);
                isManuallyClosingRef.current = false;
                setAfterId(null);
                setHasMoreMessages(true);
                setIsFetching(false);
                setCurrentPage(1);
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                    reconnectTimeoutRef.current = null;
                }
                console.log(`WebSocket connected for room ${roomId}`);
            };

            newSocket.onmessage = async (event) => {
                if (process.env.NODE_ENV !== "production") {
                    try {
                        const preview = typeof event.data === 'string' ? event.data.slice(0, 200) : String(event.data);
                        logDebug(`onmessage: raw event`, { type: typeof event.data, preview });
                    } catch {}
                }
                try {
                    const token = UserService.Instance.auth();
                    const sharedKeyHex = UserService.Instance.authInfo?.sharedKey;

                    let parsed: any = safeParse(event.data);
                    if (parsed === 'pong' || parsed === 'ping' || parsed?.op === 'Ping') {
                        console.debug('onmessage: heartbeat received');
                        return;
                    }
                    if (typeof parsed === "string") parsed = safeParse(parsed);

                    const items: any[] = Array.isArray(parsed) ? parsed : parsed && typeof parsed === "object" ? [parsed] : [];
                    console.debug(`onmessage: Parsed ${items.length} items from event data`);

                    const transformedItems: ChatMessage[] = [];

                    if (parsed?.op === "FetchHistory" && Array.isArray(parsed.messages)) {
                        if (parsed.room_id !== roomId) {
                            console.log('[WS][MSG] Ignored FetchHistory for other room', { got: parsed.room_id, expected: roomId });
                            return;
                        }

                        console.log('[WS][MSG] FetchHistory response', { count: parsed.messages.length, limit: pageSize });
                        setIsFetching(false);
                        if (parsed.messages.length < pageSize) {
                            setHasMoreMessages(false);
                            console.log('[WS][MSG] No more messages to fetch');
                        }

                        for (const msg of parsed.messages) {
                            const createdAtVal = msg.created_at || msg.createdAt || new Date().toISOString();
                            const messageSignature = `${msg.content}:${createdAtVal}`;
                            if (!addOnce(receivedMessagesRef.current, messageSignature)) {
                                console.debug(`onmessage: Ignored duplicate FetchHistory message`);
                                continue;
                            }

                            let content = msg.content;
                            if (token && sharedKeyHex && isBase64Like(msg.content)) {
                                try {
                                    const aesKey = await importAesKey(sharedKeyHex, "decrypt");
                                    const plain = await decrypt(msg.content, token, aesKey);
                                    if (plain.length > 0) {
                                        content = plain;
                                        console.log(`onmessage: Decrypted FetchHistory message content`);
                                    }
                                } catch (e) {
                                    console.warn(`onmessage: Decryption failed for FetchHistory message`, e);
                                }
                            }

                            transformedItems.push({
                                id: msg.id || `msg_${uuidv4()}`,
                                senderId: Number(msg.sender_id) || 0,
                                receiverId: Number(msg.receiver_id) || getReceiverIdFromRoom(roomId),
                                roomId: msg.room_id || roomId,
                                content,
                                status: typeof msg.status === "number" ? msg.status : 1,
                                createdAt: createdAtVal,
                                isOwner: Number(msg.sender_id) === Number(localUser?.id),
                            });
                        }
                        if (fetchResolveRef.current) {
                            fetchResolveRef.current();
                            fetchResolveRef.current = null;
                        }
                    } else if (Array.isArray(parsed) && parsed.length && typeof parsed[0] === 'object') {
                        for (const msg of parsed) {
                            if (!msg?.content) continue;
                            const createdAtVal = msg.created_at || msg.createdAt || new Date().toISOString();
                            const messageSignature = `${msg.content}:${createdAtVal}`;
                            if (!addOnce(receivedMessagesRef.current, messageSignature)) {
                                continue;
                            }
                            let content = msg.content;
                            if (token && sharedKeyHex && isBase64Like(msg.content)) {
                                try {
                                    const aesKey = await importAesKey(sharedKeyHex, "decrypt");
                                    const plain = await decrypt(msg.content, token, aesKey);
                                    if (plain.length > 0) {
                                        content = plain;
                                    }
                                } catch {}
                            }
                            transformedItems.push({
                                id: msg.id || `msg_${uuidv4()}`,
                                senderId: Number(msg.sender_id) || 0,
                                receiverId: Number(msg.receiver_id) || getReceiverIdFromRoom(roomId),
                                roomId: msg.room_id || roomId,
                                content,
                                status: typeof msg.status === "number" ? msg.status : 1,
                                createdAt: createdAtVal,
                                isOwner: Number(msg.sender_id) === Number(localUser?.id),
                            });
                        }
                    } else if (typeof parsed === "string" && isBase64Like(parsed)) {
                        const messageSignature = `${parsed}:${new Date().toISOString().slice(0, 19)}`;
                        if (!addOnce(receivedMessagesRef.current, messageSignature)) {
                            return;
                        }

                        if (token && sharedKeyHex) {
                            try {
                                const aesKey = await importAesKey(sharedKeyHex, "decrypt");
                                const plain = await decrypt(parsed, token, aesKey);
                                if (plain.length > 0) {
                                    transformedItems.push({
                                        id: sentMessagesRef.current.has(parsed) ? Array.from(sentMessagesRef.current).find((id) => id.includes(parsed)) || `msg_${uuidv4()}` : `msg_${uuidv4()}`,
                                        senderId: localUser?.id,
                                        roomId,
                                        content: plain,
                                        status: 1,
                                        createdAt: new Date().toISOString(),
                                        isOwner: false,
                                    });
                                }
                            } catch (e) {
                                console.warn(`onmessage: Failed to decrypt raw base64 message: ${parsed}`, e);
                            }
                        } else {
                            console.warn(`onmessage: No sharedKey for raw base64 message: ${parsed}`);
                        }
                    } else if (parsed?.room_id && parsed?.sender_id && parsed?.content) {
                        if (parsed.room_id !== roomId) {
                            console.debug(`onmessage: Ignored message for other room ${parsed.room_id}`);
                        } else {
                            const createdAtVal = parsed.created_at || parsed.createdAt || new Date().toISOString();
                            const messageSignature = `${parsed.content}:${createdAtVal}`;
                            if (!addOnce(receivedMessagesRef.current, messageSignature)) {
                                console.debug(`onmessage: Ignored duplicate new-format message`);
                            } else {
                                let contentOut: string = parsed.content;

                                if (token && sharedKeyHex) {
                                    try {
                                        const aesKey = await importAesKey(sharedKeyHex, "decrypt");
                                        const plain = await decrypt(contentOut, token, aesKey);
                                        if (plain && plain.length > 0) {
                                            contentOut = plain;
                                        }
                                    } catch (e) {
                                        console.warn(`onmessage: Decryption failed for new-format payload, using original content`, e);
                                    }
                                }

                                transformedItems.push({
                                    id: parsed.id || `msg_${uuidv4()}`,
                                    senderId: Number(parsed.sender_id) || 0,
                                    roomId: parsed.room_id,
                                    content: contentOut,
                                    status: typeof parsed.status === "number" ? parsed.status : 1,
                                    createdAt: createdAtVal,
                                    isOwner: Number(parsed.sender_id) === Number(localUser?.id),
                                });
                            }
                        }
                    } else if (parsed?.op === "SendMessage" && parsed?.content) {
                        const messageSignature = `${parsed.content}:${parsed.createdAt || new Date().toISOString()}`;
                        if (!addOnce(receivedMessagesRef.current, messageSignature)) {
                            return;
                        }

                        let content = parsed.content;
                        if (token && sharedKeyHex) {
                            try {
                                const aesKey = await importAesKey(sharedKeyHex, "decrypt");
                                const plain = await decrypt(parsed.content, token, aesKey);
                                if (plain.length > 0) {
                                    content = plain;
                                }
                            } catch (e) {
                                console.warn(`onmessage: Decryption failed for SendMessage`, e);
                            }
                        }

                        transformedItems.push({
                            id: parsed.id || `msg_${uuidv4()}`,
                            senderId: parsed.sender_id,
                            receiverId: parsed.receiver_id,
                            roomId: parsed.room_id,
                            content,
                            status: 1,
                            createdAt: parsed.createdAt || new Date().toISOString(),
                            isOwner: parsed.sender_id === Number(localUser?.id),
                        });
                    }

                    if (transformedItems.length) {
                        let toBroadcast: any = transformedItems[0];
                        if (parsed?.op === "FetchHistory") {
                            toBroadcast = transformedItems;
                            const ids = Array.isArray(parsed.messages)
                                ? parsed.messages
                                    .map((m: any) => (typeof m.id === 'number' ? m.id : Number(m.id)))
                                    .filter((n: any) => typeof n === 'number' && !isNaN(n))
                                : [];
                            if (ids.length) {
                                const minId = Math.min(...ids);
                                setAfterId(minId);
                            }
                        } else if (Array.isArray(parsed)) {
                            toBroadcast = transformedItems;
                        }
                        console.debug(`onmessage: Broadcasting ${transformedItems.length} transformed items`);
                        broadcastToListeners(toBroadcast);
                    } else {
                        console.warn(`onmessage: No valid items to transform`);
                    }
                } catch (e) {
                    console.error(`onmessage: Error processing WebSocket message`, e);
                    for (const fn of listeners.values()) fn(event);
                }
            };

            newSocket.onclose = (event) => {
                setIsConnected(false);
                console.log(`WebSocket closed for room ${roomId}. Code: ${event.code}, Reason: ${event.reason || "unknown"}`);

                if (isManuallyClosingRef.current) {
                    console.debug(`onclose: WebSocket closed manually`);
                    return;
                }

                if ([1008, 4000, 4400].includes(event.code)) {
                    setConnectionError(true);
                    console.warn(`onclose: Connection error with code ${event.code}, setting connectionError`);
                    return;
                }

                reconnectTimeoutRef.current = setTimeout(() => {
                    setSocket(null);
                    setConnectionAttemptKey((prev) => prev + 1);
                    console.debug(`onclose: Scheduled reconnect attempt ${connectionAttemptKey + 1}`);
                }, 3000);
            };

            newSocket.onerror = (err) => {
                if (isManuallyClosingRef.current) {
                    console.debug(`onerror: WebSocket error ignored due to manual close`);
                    return;
                }
                console.error(`WebSocket error for room ${roomId}`, err);
                if (fetchResolveRef.current) {
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
                console.debug(`WebSocketProvider cleanup: Closed WebSocket for room ${roomId}`);
            } catch {
                console.debug(`WebSocketProvider cleanup: Error closing WebSocket for room ${roomId}`);
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

            const messageId = data.id || uuidv4();
            if (!addOnce(sentMessagesRef.current, messageId)) {
                console.debug(`sendMessage: Ignored duplicate message ID ${messageId}`);
                return;
            }

            const apiPayload = {
                op: "SendMessage",
                sender_id: Number(localUser?.id) || 0,
                receiver_id: tempReceiverId,
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
                    payload = { ...apiPayload, content: encrypted };
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
        <WebSocketContext.Provider value={{ sendMessage, fetchHistory, isConnected, roomId, hasMoreMessages, isFetching }}>
            {children}
        </WebSocketContext.Provider>
    );
};

const listeners = new Map<string, (event: MessageEvent) => void>();

export const useWebSocket = (
    key: string,
    onMessage: (event: MessageEvent<ChatMessage | ChatMessage[]>) => void
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