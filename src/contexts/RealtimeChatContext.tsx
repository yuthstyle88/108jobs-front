"use client";

import {useRouter} from "next/navigation";
import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from "react";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {decrypt, encrypt} from "@/lib/web-crypto";
import {HttpService, UserService} from "@/services";
import type {ChatMessage} from "lemmy-js-client";
import {v4 as uuidv4} from "uuid";
import {addOnce, buildWsUrl, getReceiverIdFromRoom, isBase64Like, safeParse} from "@/utils/realtime";
import {REQUEST_STATE} from "@/services/HttpService";
import {ensureSharedKeyForRoom, importAesKey} from "@/utils";

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
    peerPublicKeyHex?: string;
    children: React.ReactNode;
}

function broadcastToListeners(payload: unknown): void {
    const event = { data: JSON.stringify(payload) } as MessageEvent;
    try {
        const p: any = typeof payload === 'string' ? JSON.parse(payload as any) : payload;
        const pid = p?.roomId ?? p?.room_id ?? p?.room?.id ?? p?.message?.room_id ?? null;
        if (pid) {
            for (const { roomId, fn } of listeners.values()) {
                if (roomId === String(pid)) fn(event);
            }
            return;
        }
    } catch {}
    // Fallback: no identifiable room, broadcast to all
    for (const { fn } of listeners.values()) fn(event);
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
                                                                        token,
                                                                        roomId,
                                                                        peerPublicKeyHex,
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

                // Build query for API
                const query = {
                    roomId: roomId as any,
                    cursor: pageCursor ?? undefined,
                    limit: pageSize,
                    back: true,
                } as any;

                // Call HTTP API through wrapped client
                const res = await HttpService.client.getChatHistory(query as any);
                if (res.state !== REQUEST_STATE.SUCCESS) {
                    setIsFetching(false);
                    fetchResolveRef.current?.();
                    fetchResolveRef.current = null;
                    resolve();
                    return;
                }

                const resp = res.data as any;
                const items = Array.isArray(resp?.results) ? resp.results : [];

                // Decrypt/map each message and broadcast to listeners one by one (preserves existing consumer logic)
                const token = import("@/services").then(m => m.UserService.Instance.auth());
                const sharedKeyHex = import("@/services").then(m => m.UserService.Instance.authInfo?.sharedKey);
                const realToken = (await token) as any;
                const realShared = (await sharedKeyHex) as any;

                for (const view of items) {
                    const m = { ...view.message, room_id: view.room?.id || view.message?.room_id };
                    const mapped = await mapIncomingToChatMessage(m, {
                        token: realToken,
                        sharedKeyHex: realShared,
                        fallbackRoomId: roomId,
                        localUserId: Number(localUser?.id),
                        receivedSet: receivedMessagesRef.current,
                        decryptLabel: 'history line',
                    });
                    if (mapped) broadcastToListeners(mapped);
                }

                const prev = resp.prevPage ?? resp.prev_page ?? null;
                const next = resp.nextPage ?? resp.next_page ?? null;
                if (typeof prev === 'string' && prev.length > 0) {
                    setPageCursor(next);
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
                try { import("@/chat").then(m => m.emitWsReconnected()).catch(() => { try { window.dispatchEvent(new Event('ws:reconnected')); } catch {} }); } catch { try { window.dispatchEvent(new Event('ws:reconnected')); } catch {} }
            };

            newSocket.onmessage = async (event) => {
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
                    }

                    if (transformedItems.length) {
                        // Broadcast every incoming message so consumers (ChatSection) can react to structured types
                        for (const item of transformedItems) {
                            broadcastToListeners(item);
                        }
                        // For previews, dispatch based on the latest item in this batch
                        try {
                            const last = transformedItems[transformedItems.length - 1];
                            const detail = {
                                roomId: (last as any).roomId,
                                content: (last as any).content,
                                senderId: Number((last as any).senderId) || 0,
                                timestamp: (last as any).createdAt || new Date().toISOString(),
                                unread: Number((last as any).senderId) !== Number(localUser?.id),
                            };
                            if (typeof window !== 'undefined') {
                                try { import("@/chat").then(m => m.emitChatNewMessage(detail as any)).catch(() => window.dispatchEvent(new CustomEvent('chat:new-message', { detail })) ); } catch { window.dispatchEvent(new CustomEvent('chat:new-message', { detail })); }
                            }
                        } catch {}
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
                    for (const { fn } of listeners.values()) fn(event);
                }
            };

            newSocket.onclose = (event) => {
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
                    if (typeof window !== 'undefined') {
                        try { import("@/chat").then(m => m.emitChatNewMessage(detail as any)).catch(() => { try { window.dispatchEvent(new CustomEvent('chat:new-message', { detail })); } catch {} }); }
                        catch { try { window.dispatchEvent(new CustomEvent('chat:new-message', { detail })); } catch {}
                        }
                    }
                } catch {}
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

            if (socket?.readyState === WebSocket.OPEN) {
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
        listeners.set(key, { roomId: context.roomId, fn: onMessage as any });
        return () => {
            listeners.delete(key);
        };
    }, [key, onMessage, context.roomId]);

    return context;
};