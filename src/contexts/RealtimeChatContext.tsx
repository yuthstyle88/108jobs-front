"use client";

import { useRouter } from "next/navigation";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useMyUser } from "@/hooks/profile-api/useMyUser";
import { encrypt, decrypt, hexToUint8Array } from "@/lib/web-crypto";
import { exchange as exchangeSharedKey } from "@/lib/api/auth";
import { UserService } from "@/services";
import { ChatMessage } from "@/types/chat";
import { v4 as uuidv4 } from "uuid";

interface MessagePayload {
    message: string;
    id?: string;
}

interface WebSocketContextValue {
    sendMessage: (data: MessagePayload) => void;
    isConnected: boolean;
    roomId: string;
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

async function ensureSharedKey(userId?: number | string | null): Promise<void> {
    const token = UserService.Instance.auth();
    if (!token || UserService.Instance.authInfo?.sharedKey) return;
    try {
        const storageKey = `sharedKey_${userId}`;
        const storedKey = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
        if (storedKey) {
            UserService.Instance.authInfo = {
                ...(UserService.Instance.authInfo || { auth: token }),
                sharedKey: storedKey,
                claims: UserService.Instance.authInfo?.claims,
            };
            return;
        }
        const derived = await exchangeSharedKey();
        UserService.Instance.authInfo = {
            ...(UserService.Instance.authInfo || { auth: token }),
            sharedKey: derived,
            claims: UserService.Instance.authInfo?.claims,
        };
        if (typeof window !== "undefined") localStorage.setItem(storageKey, derived);
    } catch (ex) {
        console.warn("Key exchange failed.", ex);
    }
}

async function importAesKey(sharedKeyHex: string, usage: KeyUsage): Promise<AESKey> {
    const keyData = hexToUint8Array(sharedKeyHex);
    return crypto.subtle.importKey("raw", keyData, { name: "AES-CBC", length: 256 }, false, [usage]);
}

function isBase64Like(s: string): boolean {
    return /^[A-Za-z0-9+/=]+$/.test(s);
}

function safeParse(val: unknown): any {
    try {
        return typeof val === "string" ? JSON.parse(val as string) : val;
    } catch {
        return val;
    }
}

function getReceiverIdFromRoom(roomId: string): number {
    return roomId.includes(":") ? Number(roomId.split(":")[1]) || 0 : 0;
}

function addOnce(set: Set<string>, key: string): boolean {
    if (set.has(key)) return false;
    set.add(key);
    return true;
}

function broadcastToListeners(payload: unknown): void {
    const event = { data: JSON.stringify(payload) } as MessageEvent;
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
    const router = useRouter();
    const { localUser } = useMyUser();
    const isE2EMock = process.env.NEXT_PUBLIC_E2E_MODE === "mock";

    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isManuallyClosingRef = useRef(false);
    const [connectionAttemptKey, setConnectionAttemptKey] = useState(0);
    const sentMessagesRef = useRef<Set<string>>(new Set());
    const receivedMessagesRef = useRef<Set<string>>(new Set());

    const defaultWsOrigin =
        typeof window !== "undefined"
            ? `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}`
            : "";
    const wsUrl = buildWsUrl(token, roomId);

    useEffect(() => {
        if (isE2EMock) {
            setIsConnected(true);
            return;
        }
        if (!token || !roomId || !localUser) return;

        let cancelled = false;
        isManuallyClosingRef.current = false;

        (async () => {
            try {
                await ensureSharedKey(localUser?.id);
            } catch (e) {
                console.warn("Pre-WS key exchange error", e);
            }
            if (cancelled) return;

            const newSocket = new WebSocket(wsUrl);
            setSocket(newSocket);

            newSocket.onopen = () => {
                setIsConnected(true);
                setConnectionError(false);
                isManuallyClosingRef.current = false;
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                    reconnectTimeoutRef.current = null;
                }
                console.log("✅ WebSocket connected to", roomId);
            };

            newSocket.onmessage = async (event) => {
                console.log("📥 Raw WebSocket message received:", event.data);
                try {
                    const token = UserService.Instance.auth();
                    const sharedKeyHex = UserService.Instance.authInfo?.sharedKey;


                    let parsed: any = safeParse(event.data);
                    if (typeof parsed === "string") parsed = safeParse(parsed);

                    console.log("📜 Parsed WebSocket message:", parsed);

                    const items: any[] = Array.isArray(parsed) ? parsed : parsed && typeof parsed === "object" ? [parsed] : [];
                    console.log("📜 Items extracted:", items);

                    const transformedItems: ChatMessage[] = [];

                    // Handle raw base64 string
                    if (typeof parsed === "string" && isBase64Like(parsed)) {
                        const messageSignature = `${parsed}:${new Date().toISOString().slice(0, 19)}`;
                        if (!addOnce(receivedMessagesRef.current, messageSignature)) {
                            console.log("🛑 Duplicate raw base64 message ignored:", parsed);
                            return;
                        }

                        if (token && sharedKeyHex) {
                            try {
                                const aesKey = await importAesKey(sharedKeyHex, "decrypt");
                                const plain = await decrypt(parsed, token, aesKey);
                                if (plain.length > 0) {
                                    transformedItems.push({
                                        id: sentMessagesRef.current.has(parsed) ? Array.from(sentMessagesRef.current).find((id) => id.includes(parsed)) || `msg_${uuidv4()}` : `msg_${uuidv4()}`, // Match sent ID if available
                                        senderId: localUser?.id,
                                        roomId,
                                        content: plain,
                                        status: 1,
                                        createdAt: new Date().toISOString(),
                                        isOwner: false,
                                    });
                                    console.log("📜 Decrypted raw base64 message:", plain);
                                }
                            } catch (e) {
                                console.warn("Failed to decrypt raw base64 message:", parsed, "Error:", e);
                            }
                        } else {
                            console.warn("Received raw base64 message but no sharedKey available:", parsed);
                        }
                    } else if (parsed?.content && parsed?.sent_at) {
                        const messageSignature = `${parsed.content}:${parsed.sent_at}`;
                        if (!addOnce(receivedMessagesRef.current, messageSignature)) {
                            console.log("🛑 Duplicate {content, sent_at} message ignored:", parsed);
                            return;
                        }

                        if (token && sharedKeyHex) {
                            try {
                                const aesKey = await importAesKey(sharedKeyHex, "decrypt");
                                const plain = await decrypt(parsed.content, token, aesKey);
                                if (plain.length > 0) {
                                    transformedItems.push({
                                        id: parsed.id || `msg_${uuidv4()}`,
                                        senderId: Number(localUser?.id) || 0,
                                        roomId,
                                        content: plain,
                                        status: 1,
                                        createdAt: parsed.sent_at || new Date().toISOString(),
                                        isOwner: true,
                                    });
                                    console.log("📜 Decrypted content from {content, sent_at} payload:", plain);
                                }
                            } catch (e) {
                                console.warn("Failed to decrypt content from {content, sent_at} payload:", parsed, "Error:", e);
                            }
                        } else {
                            console.warn("Received {content, sent_at} payload but no sharedKey available:", parsed);
                        }
                    }

                    // Handle structured SendMessage payloads
                    if (token && sharedKeyHex && items.length) {
                        try {
                            const aesKey = await importAesKey(sharedKeyHex, "decrypt");

                            for (const it of items) {
                                if (it?.op === "SendMessage" && it?.content) {
                                    const messageSignature = `${it.content}:${it.createdAt || new Date().toISOString()}`;
                                    if (!addOnce(receivedMessagesRef.current, messageSignature)) {
                                        console.log("🛑 Duplicate SendMessage payload ignored:", it);
                                        continue;
                                    }

                                    let content = it.content;
                                    try {
                                        const plain = await decrypt(it.content, token, aesKey);
                                        if (plain.length > 0) {
                                            content = plain;
                                        }
                                    } catch (e) {
                                        console.warn("Decryption failed for SendMessage:", it, "Error:", e);
                                    }

                                    transformedItems.push({
                                        id: it.id || `msg_${uuidv4()}`,
                                        senderId: it.sender_id,
                                        receiverId: it.receiver_id,
                                        roomId: it.room_id,
                                        content,
                                        status: 1,
                                        createdAt: it.createdAt || new Date().toISOString(),
                                        isOwner: it.sender_id === Number(localUser?.id),
                                    });
                                } else {
                                    console.warn("Invalid SendMessage payload:", it);
                                }
                            }
                        } catch (e) {
                            console.warn("Failed to decrypt incoming message(s). Using original payload.", e);
                        }
                    }

                    // Handle non-encrypted SendMessage payloads
                    for (const it of items) {
                        if (it?.op === "SendMessage" && it?.content) {
                            const messageSignature = `${it.content}:${it.createdAt || new Date().toISOString()}`;
                            if (!addOnce(receivedMessagesRef.current, messageSignature)) {
                                console.log("🛑 Duplicate non-encrypted SendMessage payload ignored:", it);
                                continue;
                            }

                            transformedItems.push({
                                id: it.id || `msg_${uuidv4()}`,
                                senderId: it.sender_id,
                                receiverId: it.receiver_id,
                                roomId: it.room_id,
                                content: it.content,
                                status: 1,
                                createdAt: it.createdAt || new Date().toISOString(),
                                isOwner: it.sender_id === Number(localUser?.id),
                            });
                        } else {
                            console.warn("Invalid SendMessage payload in non-encrypted branch:", it);
                        }
                    }

                    if (transformedItems.length) {
                        const transformed = Array.isArray(parsed) ? transformedItems : transformedItems[0];
                        console.log("📤 Transformed message sent to listeners:", transformed);
                        broadcastToListeners(transformed)
                    } else {
                        console.warn("No valid SendMessage items to transform");
                    }
                } catch (e) {
                    console.error("Error processing WebSocket message:", e);
                    for (const fn of listeners.values()) fn(event);
                }
            };

            newSocket.onclose = (event) => {
                setIsConnected(false);
                console.warn("❌ WebSocket closed. Code:", event.code);

                if (isManuallyClosingRef.current) {
                    console.log("🟡 WebSocket closed manually. Skipping error handling.");
                    return;
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
                    console.log("🟡 WebSocket error ignored due to manual close.");
                    return;
                }
                console.error("🚨 WebSocket encountered error", err);
            };
        })();

        return () => {
            cancelled = true;
            isManuallyClosingRef.current = true;
            try {
                socket?.close();
            } catch {
                // ignore
            }
        };
    }, [wsUrl, connectionAttemptKey]);

    useEffect(() => {
        if (connectionError) {
            router.replace("/not-found");
        }
    }, [connectionError, router]);

    useEffect(() => {
        if (!socket) return;
        console.log("📡 Socket state:", socket.readyState);
    }, [socket]);

    const sendMessage = useCallback(
        async (data: MessagePayload) => {
            if (isE2EMock) {
                const messageId = data.id || `msg_${uuidv4()}`;
                const mockMessage = {
                    id: messageId,
                    senderId: Number(localUser?.id) || 0,
                    receiverId: roomId.includes(":") ? Number(roomId.split(":")[1]) || 0 : 0,
                    roomId,
                    content: data.message,
                    createdAt: new Date().toISOString(),
                    status: 1,
                    isOwner: true,
                };
                console.log("📤 Mock message sent to listeners:", mockMessage);
                broadcastToListeners(mockMessage)
                return;
            }

            if (!data.message?.trim()) {
                console.warn("Cannot send empty message");
                return;
            }

            const messageId = data.id || uuidv4();
            if (!addOnce(sentMessagesRef.current, messageId)) {
                console.log("🛑 Duplicate sendMessage call ignored:", data.message);
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
                        await ensureSharedKey(localUser?.id);
                    } catch (ex) {
                        console.warn("Could not derive shared key, sending plaintext.", ex);
                    }
                }

                const sharedKeyHex = UserService.Instance.authInfo?.sharedKey;
                const shouldEncrypt = !!(token && sharedKeyHex && data.message && data.message.trim());
                if (shouldEncrypt) {
                    const aesKey = await importAesKey(sharedKeyHex!, "encrypt");
                    const encrypted = await encrypt(data.message, aesKey, token!);
                    payload = { ...apiPayload, content: encrypted };
                }
            } catch (e) {
                console.warn("E2EE encryption failed, sending plaintext.", e);
            }

            if (socket?.readyState === WebSocket.OPEN) {
                console.log("📤 Sending WebSocket message:", payload);
                socket.send(JSON.stringify(payload));
            } else {
                console.warn("❗ WebSocket not ready to send, state:", socket?.readyState);
            }
        },
        [socket, isE2EMock, roomId, localUser?.id]
    );

    return (
        <WebSocketContext.Provider value={{ sendMessage, isConnected, roomId }}>
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
        listeners.set(key, onMessage);
        return () => {
            listeners.delete(key);
        };
    }, [key, onMessage]);

    return context;
};