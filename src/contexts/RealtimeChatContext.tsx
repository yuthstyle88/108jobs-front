"use client";
import {useRouter} from "next/navigation";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {
    broadcastToListeners,
    fetchHistoryPage,
    installBestMessageListener,
    MessagePayload,
} from "@/utils/chat";
import {
    sendChatMessage,
    sendReadReceipt as sendReadReceiptEvent,
    sendRoomUpdateEvent,
    sendTyping as sendTypingEvent
} from "@/events/chat/sendEvents";
import {makeEmitReadAcker} from "@/utils/chat/chat-socket-utils";
import {ensureSharedKeyForRoom} from "@/utils";
import {createHandleWSMessage} from "@/utils/chat/handleWSMessage";
import {WebSocketContext} from "@/utils/chat/useRoomWebSocket";

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
    // Track whether the peer (counterpart) is active in THIS room recently
    const peerActiveRef = useRef<boolean>(false);
    const peerActiveDecayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const markPeerActive = useCallback(() => {
        peerActiveRef.current = true;
        if(peerActiveDecayRef.current) {
            try {
                clearTimeout(peerActiveDecayRef.current);
            } catch {
            }
        }
        // Consider peer "active" for a short window after signals (typing, presence)
        peerActiveDecayRef.current = setTimeout(() => {
            peerActiveRef.current = false;
        }, 20000); // 20s window; adjust as needed
    }, []);

    const router = useRouter();
    const {localUser} = useMyUser();
    const isE2EMock = process.env.NEXT_PUBLIC_E2E_MODE === "mock";
    const [refreshRoomData, setRefreshRoomData] = useState<any>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isManuallyClosingRef = useRef(false);
    const [connectionAttemptKey, setConnectionAttemptKey] = useState(0);
    const sentMessagesRef = useRef<Set<string>>(new Set());
    const receivedMessagesRef = useRef<Set<string>>(new Set());
    // Unified dedupe for logical messages (prefers id; falls back to composite signature)
    const processedMsgRef = useRef<Set<string>>(new Set());

    const fetchResolveRef = useRef<((value?: void) => void) | null>(null);
    const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const phoenixPollRef = useRef<NodeJS.Timeout | null>(null);
    // Cooldown guard to prevent auto-ack feedback loops
    const ackCooldownRef = useRef<number>(0);
    // Read-receipt acker (debounced, monotonic)
    const readAckRef = useRef<((id: number | string) => void) | null>(null);

    // Unified WebSocket connection effect (duplicates removed)
    useEffect(() => {
        if(isE2EMock) {
            setIsConnected(true);
            return;
        }
        if(!token || !roomId || !localUser) {
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
            if(cancelled) return;

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
                if(reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                    reconnectTimeoutRef.current = null;
                }
                try {
                    import("@/events/chat").then(m => m.emitWsReconnected()).catch(() => {
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

            const handleWSMessage = createHandleWSMessage({
                roomId,
                localUserId: Number(localUser?.id) || 0,
                setRefreshRoomData,
                markPeerActive,
                processedMsgRef,
                peerActiveRef,
                setPageCursor,
                setHasMoreMessages,
                setIsFetching,
                fetchTimeoutRef,
                fetchResolveRef,
                readAckRef,
                ackCooldownRef,
            });

            // Attach exactly ONE message listener
            removeListener = installBestMessageListener(newSocket, handleWSMessage);

            // Start a safety poller only if no listener could be installed
            if(!phoenixPollRef.current && (!removeListener || typeof removeListener !== 'function')) {
                console.log('[WS] starting fallback poller');
                let lastSig: string | null = null;
                phoenixPollRef.current = setInterval(() => {
                    try {
                        const env = (globalThis as any).__phoenixRTLast;
                        if(!env) return;
                        const sig = JSON.stringify(env);
                        if(sig === lastSig) return;
                        lastSig = sig;
                        handleWSMessage({data: JSON.stringify(env)});
                    } catch {
                    }
                }, 700);
            }

            newSocket.onclose = (event: any) => {
                if(phoenixPollRef.current) {
                    try {
                        clearInterval(phoenixPollRef.current);
                    } catch {
                    }
                    phoenixPollRef.current = null;
                }
                setIsConnected(false);

                if(isManuallyClosingRef.current) {
                    return;
                }

                if(fetchTimeoutRef.current) {
                    clearTimeout(fetchTimeoutRef.current);
                    fetchTimeoutRef.current = null;
                }

                if([1008, 4000, 4400].includes(event.code)) {
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
                if(isManuallyClosingRef.current) {
                    return;
                }
                if(fetchTimeoutRef.current) {
                    clearTimeout(fetchTimeoutRef.current);
                    fetchTimeoutRef.current = null;
                }
                if(fetchResolveRef.current) {
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
                if(removeListener) removeListener();
            } catch {
            }
            isManuallyClosingRef.current = true;
            if(phoenixPollRef.current) {
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
            if(fetchTimeoutRef.current) {
                clearTimeout(fetchTimeoutRef.current);
                fetchTimeoutRef.current = null;
            }
            if(fetchResolveRef.current) {
                fetchResolveRef.current();
                fetchResolveRef.current = null;
                setIsFetching(false);
            }
            if(peerActiveDecayRef.current) {
                try {
                    clearTimeout(peerActiveDecayRef.current);
                } catch {
                }
                peerActiveDecayRef.current = null;
            }
            try {
                processedMsgRef.current.clear();
            } catch {
            }
        };
    }, [connectionAttemptKey, localUser, roomId, token, peerPublicKeyHex]);

    // Wire read-receipt acker to current socket/room
    useEffect(() => {
        if(isE2EMock) {
            readAckRef.current = null;
            return;
        }
        if(!socket || !roomId) {
            readAckRef.current = null;
            return;
        }
        const emit = (evt: string, payload: any) => {
            try {
                if(localStorage.getItem('debug_read_ack') === '1') {
                    console.log('[read-ack] emit', {evt, payload});
                }
            } catch {
            }
            try {
                (socket as any)?.emit?.(evt, {
                    ...payload,
                    reader_id: Number(localUser?.id) || 0,
                });
            } catch {
            }
        };
        // Base acker from utils
        const baseAcker = makeEmitReadAcker(emit, roomId, 0);
        // Wrap it for extra diagnostics so we know when our provider requests an ack
        readAckRef.current = (id: number | string) => {
            try {
                if(localStorage.getItem('debug_read_ack') === '1') {
                    console.log('[read-ack] call', {roomId, id});
                }
            } catch {
            }
            try {
                baseAcker(id);
            } catch (e) {
                try {
                    console.warn('[read-ack] baseAcker failed', e);
                } catch {
                }
            }
        };
        try {
            if(localStorage.getItem('debug_read_ack') === '1') {
                console.log('[read-ack] wired', {roomId, reader: Number(localUser?.id) || 0});
            }
        } catch {
        }
        return () => {
            readAckRef.current = null;
        };
    }, [socket, roomId, localUser?.id, isE2EMock]);

    useEffect(() => {
        if(connectionError) {
            router.replace("/not-found");
        }
    }, [connectionError, router]);

    useEffect(() => {
        if(!socket) {
            return;
        }
    }, [socket]);

    const sendMessage = useCallback(
        async (data: MessagePayload) => {
            await sendChatMessage(
                {
                    isE2EMock,
                    roomId,
                    localUserId: Number(localUser?.id) || 0,
                    peerPublicKeyHex,
                    sentSet: sentMessagesRef.current,
                    onAfterSend: () => {
                        lastTypedSentRef.current = false;
                    },
                    socket
                },
                data
            );
        },
        [isE2EMock, socket, roomId, localUser?.id, peerPublicKeyHex]
    );

    const sendReadReceipt = useCallback((roomId: string, lastMessageId: string) => {
        try {
            if(localStorage.getItem('debug_read_ack') === '1') {
                console.log('[read-ack] sendReadReceipt()', {roomId, lastMessageId});
            }
        } catch {
        }
        try {
            if(isE2EMock) return;
            // Send a read-receipt event over the socket via centralized helper
            sendReadReceiptEvent({roomId, localUserId: Number(localUser?.id) || 0, socket}, lastMessageId);
            // Also trigger the monotonic acker for de-dupe/debounce book-keeping
            readAckRef.current?.(lastMessageId);
        } catch (err) {
            console.error("Failed to send read receipt", err);
        }
    }, [isE2EMock, socket, localUser?.id]);

    const sendTyping = useCallback((isTyping: boolean) => {
        try {
            if(isE2EMock) {
                // In mock mode, do not broadcast typing back to self
                lastTypedSentRef.current = isTyping;
                return;
            }
            lastTypedSentRef.current = isTyping;
            sendTypingEvent({roomId, localUserId: Number(localUser?.id) || 0, socket}, isTyping);
        } catch {
        }
    }, [socket, roomId, localUser?.id, isE2EMock]);

    const sendRoomUpdate = useCallback(
        (roomId: string, update: Record<string, any>) => {
            try {
                if(isE2EMock) {
                    // In mock mode, do not broadcast over socket
                    console.debug('Mock room update:', {roomId, ...update});
                    return;
                }
                sendRoomUpdateEvent({roomId, localUserId: Number(localUser?.id) || 0, socket}, update);
            } catch (err) {
                console.error('Failed to send room update', err);
            }
        },
        [socket, localUser?.id, isE2EMock]
    );

    const fetchHistory = useCallback(async () => {
        if(isE2EMock) return;
        if(isFetching) return;
        if(!hasMoreMessages) return;
        setIsFetching(true);
        try {
            const {prev, next} = await fetchHistoryPage(
                {roomId, cursor: pageCursor, limit: pageSize},
                {
                    localUserId: Number(localUser?.id) || 0,
                    receivedSet: receivedMessagesRef.current,
                    broadcast: (m) => broadcastToListeners(m),
                }
            );
            // Mirror pagination behavior used elsewhere: prev exists => more pages; move cursor to next
            if(typeof prev === 'string' && prev.length > 0) {
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
                refreshRoomData,
                sendReadReceipt
            }}>
            {children}
        </WebSocketContext.Provider>
    );
};