import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useWebSocketContext} from '@/core/chat/contexts/WebSocketContext';
import {createHandleWSMessage} from '@/core/chat/events/handleWSMessage';
import {ensureSharedKeyForRoom} from "@/utils";
import {makeEmitReadAcker} from "@/core/chat/utils";
import {
    resendChatMessage,
    sendChatMessage,
    sendReadReceipt as sendReadReceiptEvent, sendRoomUpdateEvent,
    sendTyping as sendTypingEvent
} from "@/core/chat/events/sendEvents";
import {ChatRoomId, ChatRoomData, LocalUser, LocalUserId} from "lemmy-js-client";
import {useChatStore} from "@/store/chatStore"
import {makeReadAckEmitter} from "@/core/chat/utils/socket-emitter";
import {emitWsReconnected} from "@/core/chat/events";
import {MessagePayload} from "@/core/chat/types";
import {useChatRoomsContext} from "@/core/chat/contexts/ChatRoomsContext";

// Safe DOM CustomEvent dispatcher
function dispatchDomEvent(name: string, detail: any) {
    try {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent(name, {detail}));
        }
    } catch {
    }
}

const TYPING_DECAY_MS = 200; // faster hint-off (was 2000)
const PEER_ACTIVE_DECAY_MS = 20000;
const PEER_ACTIVE_BUMP_MIN_MS = 1000; // throttle markPeerActive to avoid runaway timer churn

export interface UseChatRoomParams {
    roomId: string;
    peerPublicKeyHex: string;
    onRemoteTyping?: (detail: { roomId: string; senderId: number; typing: boolean }) => void;
    setMessages: React.Dispatch<React.SetStateAction<any[]>>;
    localUser: LocalUser,
    roomData: ChatRoomData;
}

export function useChatRoom({
                                roomId,
                                peerPublicKeyHex,
                                onRemoteTyping,
                                setMessages,
                                localUser,
                                roomData
                            }: UseChatRoomParams) {
    const [pageCursor, setPageCursor] = useState<string | null>(null);
    const fetchingRef = useRef(false);
    const hasMoreRef = useRef(true);

    const lastTypedSentRef = useRef<boolean>(false);
    const peerActiveRef = useRef<boolean>(false);
    const peerActiveDecayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastPeerActiveBumpAtRef = useRef<number>(0);
    const peerActiveExpiresAtRef = useRef<number>(0);
    const { updatePeerPresence } = useChatRoomsContext();

    const markPeerActive = useCallback(() => {
        const now = Date.now();

        // Throttle to avoid churn from extremely frequent packets
        if (now - lastPeerActiveBumpAtRef.current < PEER_ACTIVE_BUMP_MIN_MS) {
            return;
        }
        lastPeerActiveBumpAtRef.current = now;

        // Mark active and push out the expiry
        peerActiveRef.current = true;
        updatePeerPresence(roomId, true);
        peerActiveExpiresAtRef.current = now + PEER_ACTIVE_DECAY_MS;

        // If there's already a decay timer running, do not create a new one.
        // Let the single timer extend its expiry by reading peerActiveExpiresAtRef when it wakes.
        if (!peerActiveDecayRef.current) {
            const tick = () => {
                const remaining = peerActiveExpiresAtRef.current - Date.now();
                if (remaining <= 0) {
                    // Expired: flip the flag and clear the timer handle
                    peerActiveRef.current = false;
                    updatePeerPresence(roomId, false);
                    peerActiveDecayRef.current = null;
                    return;
                }
                // Still active; schedule the next wake-up only once
                peerActiveDecayRef.current = setTimeout(tick, Math.min(remaining, PEER_ACTIVE_DECAY_MS));
            };
            // Start the one-and-only timer
            peerActiveDecayRef.current = setTimeout(tick, PEER_ACTIVE_DECAY_MS);
        }
    }, []);

    const isE2EMock = process.env.NEXT_PUBLIC_E2E_MODE === 'mock';
    const [refreshRoomData, setRefreshRoomData] = useState<ChatRoomData>(roomData);

    const sentMessagesRef = useRef<Set<string>>(new Set());
    const processedMsgRef = useRef<Set<string>>(new Set());

    const fetchResolveRef = useRef<((value?: void) => void) | null>(null);
    const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const ackCooldownRef = useRef<number>(0);
    const readAckRef = useRef<((id: number | string) => void) | null>(null);
    const [isPartnerTyping, setIsPartnerTyping] = useState(false);
    const typingDecayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [connectionError, setConnectionError] = useState(false);
    const ws = useWebSocketContext();
    useEffect(() => {
        if (ws.isReady) {
            setConnectionError(false);
            setPageCursor(null);
            try {
                // Notify in-app listeners that WS reconnected (no dynamic import)
                emitWsReconnected?.();
            } catch {
            }
        }
    }, [ws.isReady]);

    // ปิด: สถานะไม่พร้อม
    useEffect(() => {
        if (!ws.isReady) {
            // removed setIsConnected(false)
        }
    }, [ws.isReady]);

    const handleRemoteTyping = useCallback((detail: { roomId: ChatRoomId; senderId: LocalUserId; typing: boolean }) => {
        try {
            if (!detail) return;
            if (detail.roomId !== roomId) return;
            const me = Number(localUser.id) || 0;
            if (detail.senderId === me) return; // ignore self
            setIsPartnerTyping(detail.typing);
            if (!detail.typing) {
                if (typingDecayRef.current) {
                    try {
                        clearTimeout(typingDecayRef.current);
                    } catch {
                    }
                    typingDecayRef.current = null;
                }
                // already set to false above; ensure DOM event mirrors instant off
                dispatchDomEvent('chat:partner-typing', {
                    roomId,
                    senderId: Number(detail.senderId) || 0,
                    typing: false
                });
                onRemoteTyping?.(detail);
                return;
            }
            dispatchDomEvent('chat:partner-typing', {
                roomId,
                senderId: Number(detail.senderId) || 0,
                typing: detail.typing
            });
            if (detail.typing) {
                if (typingDecayRef.current) {
                    try {
                        clearTimeout(typingDecayRef.current);
                    } catch {
                    }
                }
                typingDecayRef.current = setTimeout(() => {
                    setIsPartnerTyping(false);
                    dispatchDomEvent('chat:partner-typing', {
                        roomId,
                        senderId: Number(detail.senderId) || 0,
                        typing: false
                    });
                }, TYPING_DECAY_MS);
            }
            onRemoteTyping?.(detail);
        } catch {
        }
    }, [roomId, localUser.id, onRemoteTyping]);

    const handleWSMessage = React.useMemo(() => createHandleWSMessage({
        roomId,
        localUserId: Number(localUser.id) || 0,
        setRefreshRoomData,
        markPeerActive,
        onRemoteTyping: handleRemoteTyping,
        setMessages,
        processedMsgRef,
        peerActiveRef,
        setPageCursor,
        setHasMoreMessages: (val: boolean) => {
            hasMoreRef.current = val;
        },
        setIsFetching: (val: boolean) => {
            fetchingRef.current = val;
        },
        fetchTimeoutRef,
        fetchResolveRef,
        readAckRef,
        ackCooldownRef,
    }), [roomId, localUser.id, setMessages, setRefreshRoomData, markPeerActive, handleRemoteTyping]);

    useEffect(() => {
        if (!ws || typeof ws.addMessageListener !== 'function') return;
        const off = ws.addMessageListener((data: unknown) => {
            try {
                handleWSMessage({data} as any);
            } catch {
            }
        });
        return () => {
            try {
                off?.();
            } catch {
            }
        };
    }, [ws, handleWSMessage]);

    // E2E shared key warmup
    useEffect(() => {
        if (isE2EMock) return;
        if (!roomId || !localUser) return;
        (async () => {
            try {
                if (peerPublicKeyHex) {
                    await ensureSharedKeyForRoom(roomId, peerPublicKeyHex);
                } else {
                    console.warn(`[crypto] skipped key derivation: no peerPublicKey for room ${roomId}`);
                }
            } catch {
            }
        })();
    }, [roomId, localUser, peerPublicKeyHex, isE2EMock]);

    // Read-ack acker wiring
    useEffect(() => {
        if (isE2EMock || !roomId) {
            readAckRef.current = null;
            return;
        }
        const emit = makeReadAckEmitter(ws as any, Number(localUser.id) || 0);
        const baseAcker = makeEmitReadAcker(emit, roomId, 0);
        readAckRef.current = (id: number | string) => {
            try {
                baseAcker(id);
            } catch (e) {
                try {
                    console.warn('[read-ack] baseAcker failed', e);
                } catch {
                }
            }
        };
        return () => {
            readAckRef.current = null;
        };
    }, [roomId, localUser.id, isE2EMock, ws]);

    useEffect(() => {
        return () => {
            if (typingDecayRef.current) {
                try {
                    clearTimeout(typingDecayRef.current);
                } catch {
                }
            }
            if (peerActiveDecayRef.current) {
                try {
                    clearTimeout(peerActiveDecayRef.current);
                } catch {
                }
            }
        };
    }, []);

    // Actions
    const sendMessage = useCallback(async (data: MessagePayload) => {
        const deps = {
            isE2EMock,
            roomId,
            peerPublicKeyHex,
            sentSet: sentMessagesRef.current,
            onAfterSend: () => {
                lastTypedSentRef.current = false;
            },
            store: {
                addPending: (roomId: string, msg: { senderId: number; content: string }) =>
                    useChatStore.getState().addMessage(roomId, msg.senderId, msg.content),
                commitStatus: (roomId: string, id: string, status: any, patch?: any) =>
                    useChatStore.getState().commitStatus(roomId, id, status, patch),
            },
            socket: ws,
        } as const;

        await sendChatMessage(deps, data);
    }, [isE2EMock, roomId, peerPublicKeyHex, ws]);

    const resendMessage = useCallback(async (id: string) => {
        const st = useChatStore.getState();
        try {
            // Try targeted resend via sendEvents (preferred: resend only this message)
            // Resolve the latest message object from the store
            const lookup = (rid: string, mid: string) => {
                const fromMsgs = (st as any).messages?.find?.((m: any) => String(m.id) === String(mid) && String(m.roomId) === String(rid));
                if (fromMsgs) return fromMsgs;
                return (st as any).pendingMessages?.find?.((m: any) => String(m.id) === String(mid) && String(m.roomId) === String(rid));
            };

            const msg = lookup(roomId, id);
            if (msg) {
                await resendChatMessage(
                    {
                        roomId,
                        socket: ws,
                        store: {
                            // expose only what resendChatMessage needs
                            commitStatus: st.commitStatus,
                            getMessageById: (rid: string, mid: string) => lookup(rid, mid),
                        },
                        isE2EMock,
                        sentSet: sentMessagesRef.current,
                    },
                    msg
                );
                return;
            }

            // Fallback: if we can't resolve the message object, trigger store retry + flush
            st.retryMessage?.(id);
            await st.flushPending?.();
        } catch (err) {
            try {
                console.warn('[chat] resendMessage failed, fallback to flush', err);
            } catch {
            }
            // Final fallback
            try {
                st.retryMessage?.(id);
                await st.flushPending?.();
            } catch {
            }
        }
    }, [roomId, ws, isE2EMock]);

    const sendRoomUpdate = useCallback(
        (roomIdArg: string, update: Record<string, any>) => {
            try {
                sendRoomUpdateEvent(
                    {
                        socket: ws,
                        senderId: Number(localUser.id) ?? 0,
                        roomId: roomIdArg,
                    } as any,
                    update
                );
            } catch (err) {
                console.error("[chat] sendRoomUpdateEvent failed:", err);
            }
        },
        [ws, localUser.id]
    );


    const flushPending = useCallback(async () => {
        try {
            await useChatStore.getState().flushPending?.();
        } catch {
        }
    }, []);

    const removePending = useCallback((id: string) => {
        try {
            useChatStore.getState().removeMessage?.(id);
        } catch {
        }
    }, []);

    const sendReadReceipt = useCallback((roomIdArg: string, lastMessageId: string) => {
        try {
            if (localStorage.getItem('debug_read_ack') === '1') {
                console.log('[read-ack] sendReadReceipt()', {roomId: roomIdArg, lastMessageId});
            }
        } catch {
        }
        try {
            if (isE2EMock) return;
            sendReadReceiptEvent({roomId: roomIdArg, socket: ws, senderId: localUser.id}, lastMessageId);
            readAckRef.current?.(lastMessageId);
        } catch (err) {
            console.error('Failed to send read receipt', err);
        }
    }, [isE2EMock, ws, localUser.id]);

    const sendTyping = useCallback((isTyping: boolean) => {
        try {
            lastTypedSentRef.current = isTyping;
            sendTypingEvent({roomId, socket: ws, senderId: localUser.id}, isTyping);
        } catch {
        }
    }, [roomId, localUser.id, ws]);

    const onWsErrorDuringFetch = useCallback(() => {
        if (fetchTimeoutRef.current) {
            try {
                clearTimeout(fetchTimeoutRef.current);
            } catch {
            }
            fetchTimeoutRef.current = null;
        }
        if (fetchResolveRef.current) {
            try {
                fetchResolveRef.current();
            } catch {
            }
            fetchResolveRef.current = null;
        }
        fetchingRef.current = false;
    }, []);

    return {
        state: {pageCursor, refreshRoomData, isPartnerTyping, isPeerActive: peerActiveRef},
        actions: {sendMessage, resendMessage, flushPending, removePending, sendReadReceipt, sendTyping, sendRoomUpdate},
        utils: {onWsErrorDuringFetch, markPeerActive},
    } as const;
}
