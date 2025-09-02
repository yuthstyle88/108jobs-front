"use client";

import { useRouter } from "next/navigation";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useMyUser } from "@/hooks/profile-api/useMyUser";
import { encrypt, decrypt, hexToUint8Array } from "@/lib/web-crypto";
import { exchange } from "@/lib/api/auth";
import { UserService } from "@/services";
import { ChatMessage } from "@/types/chat";
import { v4 as uuidv4 } from "uuid";

interface MessagePayload {
    message: string;
    id?: string;
}

interface WebSocketContextValue {
    sendMessage: (data: MessagePayload) => void;
    fetchHistory: () => void; // New function to fetch history
    isConnected: boolean;
    roomId: string;
    hasMoreMessages: boolean; // Indicate if more history is available
    isFetching: boolean; // Whether history fetch is in progress
}

const WebSocketContext = createContext<WebSocketContextValue | undefined>(undefined);

interface WebSocketProviderProps {
    token: string;
    roomId: string;
    children: React.ReactNode;
}

type AESKey = CryptoKey;

function buildWsUrl(token: string, roomId: string): string {
    return `ws://localhost:8532/ws?token=${token}&room_id=${roomId}`;
}

async function ensureSharedKeyForRoom(roomId: string): Promise<void> {
    const token = UserService.Instance.auth();
    if (!token) {
        if (process.env.NODE_ENV !== "production") {
            console.debug(`ensureSharedKeyForRoom: Skipped - no token`);
        }
        return;
    }

    try {
        const storageKey = `sharedKey_room_${roomId}`;
        const storedKey = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
        if (storedKey) {
            UserService.Instance.authInfo = {
                ...(UserService.Instance.authInfo || { auth: token }),
                sharedKey: storedKey,
                claims: UserService.Instance.authInfo?.claims,
            };
            if (process.env.NODE_ENV !== "production") {
                console.debug(`ensureSharedKeyForRoom: Loaded shared key from localStorage for room ${roomId}`);
            }
            return;
        }

        // Use server-assisted ECDH to derive shared key
        const derived = await exchange();

        UserService.Instance.authInfo = {
            ...(UserService.Instance.authInfo || { auth: token }),
            sharedKey: derived,
            claims: UserService.Instance.authInfo?.claims,
        };
        if (typeof window !== "undefined") localStorage.setItem(storageKey, derived);
        if (process.env.NODE_ENV !== "production") {
            console.debug(`ensureSharedKeyForRoom: Exchanged and stored new shared key for room ${roomId}`);
        }
    } catch (ex) {
        console.warn(`ensureSharedKeyForRoom: Key exchange failed for room ${roomId}`, ex);
    }
}

async function importAesKey(sharedKeyHex: string, usage: KeyUsage): Promise<AESKey> {
    const keyData = hexToUint8Array(sharedKeyHex);
    if (process.env.NODE_ENV !== "production") {
        console.debug(`importAesKey: Importing AES key for ${usage}`);
    }
    return crypto.subtle.importKey("raw", keyData, { name: "AES-CBC", length: 256 }, false, [usage]);
}

function isBase64Like(s: string): boolean {
    return /^[A-Za-z0-9+/=]+$/.test(s);
}

function safeParse(val: unknown): any {
    try {
        const result = typeof val === "string" ? JSON.parse(val as string) : val;
        if (process.env.NODE_ENV !== "production") {
            console.debug(`safeParse: Parsed value`, result);
        }
        return result;
    } catch {
        if (process.env.NODE_ENV !== "production") {
            console.debug(`safeParse: Failed to parse value`, val);
        }
        return val;
    }
}

function getReceiverIdFromRoom(roomId: string): number {
    const receiverId = roomId.includes(":") ? Number(roomId.split(":")[1]) || 0 : 0;
    if (process.env.NODE_ENV !== "production") {
        console.debug(`getReceiverIdFromRoom: Extracted receiverId ${receiverId} from roomId ${roomId}`);
    }
    return receiverId;
}

function addOnce(set: Set<string>, key: string): boolean {
    if (set.has(key)) {
        if (process.env.NODE_ENV !== "production") {
            console.debug(`addOnce: Key ${key} already exists in set`);
        }
        return false;
    }
    set.add(key);
    if (process.env.NODE_ENV !== "production") {
        console.debug(`addOnce: Added key ${key} to set`);
    }
    return true;
}

function broadcastToListeners(payload: unknown): void {
    const event = { data: JSON.stringify(payload) } as MessageEvent;
    if (process.env.NODE_ENV !== "production") {
        console.debug(`broadcastToListeners: Broadcasting payload`, payload);
    }
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
    const [currentPage, setCurrentPage] = useState(1); // Track current page (legacy)
    const [hasMoreMessages, setHasMoreMessages] = useState(true); // Track if more messages are available
    const [isFetching, setIsFetching] = useState(false); // Prevent multiple fetch requests
    const pageSize = 10; // Default page size / limit for history
    const [afterId, setAfterId] = useState<number | null>(null); // Cursor-based pagination: fetch messages after this id
    const router = useRouter();
    const { localUser } = useMyUser();
    const isE2EMock = process.env.NEXT_PUBLIC_E2E_MODE === "mock";

    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isManuallyClosingRef = useRef(false);
    const [connectionAttemptKey, setConnectionAttemptKey] = useState(0);
    const sentMessagesRef = useRef<Set<string>>(new Set());
    const receivedMessagesRef = useRef<Set<string>>(new Set());

    const wsUrl = buildWsUrl(token, roomId);

    // Function to send FetchHistory payload
    const fetchHistory = useCallback(async () => {
        console.log('[CHAT][FETCH] fetchHistory called', { currentPage, pageSize, hasMoreMessages, isFetching, afterId });
        if (isE2EMock) {
            console.log('[CHAT][FETCH] Skipping (E2E mock mode)');
            return;
        }

        if (!hasMoreMessages || isFetching) {
            console.log('[CHAT][FETCH] Skip fetch', { reason: !hasMoreMessages ? 'no-more' : 'already-fetching' });
            return;
        }

        setIsFetching(true);
        // Use new cursor-based pagination if possible
        const cursorPayload: any = {
            op: "FetchHistory",
            sender_id: Number(localUser?.id) || 0,
            receiver_id: getReceiverIdFromRoom(roomId),
            room_id: roomId,
            content: "",
            after_id: afterId ?? undefined,
            limit: pageSize,
        };
        // Include legacy fields for backward compatibility
        const payload = {
            ...cursorPayload,
            page: currentPage, // legacy
            page_size: pageSize, // legacy
        };
        console.log('[CHAT][FETCH] Prepared payload', payload);

        try {
            if (socket?.readyState === WebSocket.OPEN) {
                console.log('[CHAT][FETCH] Sending payload over WS', { readyState: socket.readyState });
                socket.send(JSON.stringify(payload));
            } else {
                console.log('[CHAT][FETCH] WS not open', { readyState: socket?.readyState });
            }
        } catch (e) {
            console.log('[CHAT][FETCH] Error sending payload', e);
        }
    }, [socket, isE2EMock, roomId, localUser?.id, currentPage, hasMoreMessages, isFetching]);

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
                console.debug(`WebSocketProvider: Shared key ensured for room ${roomId}`);
            } catch (e) {
                console.warn(`WebSocketProvider: Pre-WS key derivation error for room ${roomId}`, e);
            }
            if (cancelled) {
                console.debug(`WebSocketProvider: Operation cancelled before WebSocket creation`);
                return;
            }

            const newSocket = new WebSocket(wsUrl);
            setSocket(newSocket);
            console.debug(`WebSocketProvider: Created new WebSocket for room ${roomId}`);

            newSocket.onopen = () => {
                setIsConnected(true);
                setConnectionError(false);
                isManuallyClosingRef.current = false;
                // Reset pagination cursors on (re)connect
                setAfterId(null);
                setHasMoreMessages(true);
                setIsFetching(false);
                setCurrentPage(1);
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                    reconnectTimeoutRef.current = null;
                    console.debug(`WebSocketProvider: Cleared reconnect timeout`);
                }
                console.log(`WebSocket connected for room ${roomId}`);
            };

            newSocket.onmessage = async (event) => {
                if (process.env.NODE_ENV !== "production") {
                    try {
                        const preview = typeof event.data === 'string' ? event.data.slice(0, 200) : String(event.data);
                        console.debug(`onmessage: raw event`, { type: typeof event.data, preview });
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

                    // Handle FetchHistory response
                    if (parsed?.op === "FetchHistory" && Array.isArray(parsed.messages)) {
                        if (parsed.room_id !== roomId) {
                            console.log('[WS][MSG] Ignored FetchHistory for other room', { got: parsed.room_id, expected: roomId });
                            return;
                        }

                        console.log('[WS][MSG] FetchHistory response', { count: parsed.messages.length, limit: pageSize });
                        setIsFetching(false);
                        if (parsed.messages.length < pageSize) {
                            setHasMoreMessages(false); // No more messages to fetch
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
                    }
                    // Array of message objects without op (server may send plain list)
                    else if (Array.isArray(parsed) && parsed.length && typeof parsed[0] === 'object') {
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
                    }
                    // Existing SendMessage and raw base64 handling (unchanged)
                    else if (typeof parsed === "string" && isBase64Like(parsed)) {
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
                            // For history loads, broadcast the full array so the UI can prepend older messages
                            toBroadcast = transformedItems;
                            // Update cursor after_id using the earliest (smallest) numeric id in the returned batch
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
        };
    }, [wsUrl, connectionAttemptKey, localUser, roomId, token]);

    useEffect(() => {
        if (connectionError) {
            console.debug(`WebSocketProvider: Connection error detected, redirecting to /not-found`);
            router.replace("/not-found");
        }
    }, [connectionError, router]);

    useEffect(() => {
        if (!socket) {
            console.debug(`WebSocketProvider: Socket is null`);
            return;
        }
        console.debug(`WebSocketProvider: Socket state changed, readyState: ${socket.readyState}`);
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

            const receiverId = getReceiverIdFromRoom(roomId);
            const apiPayload = {
                op: "SendMessage",
                sender_id: Number(localUser?.id) || 0,
                receiver_id: receiverId,
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
        console.debug(`useWebSocket: Registered listener for key ${key}`);
        listeners.set(key, onMessage);
        return () => {
            console.debug(`useWebSocket: Unregistered listener for key ${key}`);
            listeners.delete(key);
        };
    }, [key, onMessage]);

    return context;
};