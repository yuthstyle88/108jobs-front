import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useWebSocketContext} from '@/contexts/WebSocketContext';
import {v4 as uuidv4} from "uuid";
// Chat helpers (reuse your existing utilities)
import {createHandleWSMessage} from '@/events/chat/handleWSMessage';
import {ensureSharedKeyForRoom} from "@/utils";
import {broadcastToListeners, fetchHistoryPage, makeEmitReadAcker, MessagePayload} from "@/utils/chat";
import {
    sendChatMessage,
    sendReadReceipt as sendReadReceiptEvent,
    sendTyping as sendTypingEvent
} from "@/events/chat/sendEvents";
import {ChatRoomId, LocalUser, LocalUserId} from "lemmy-js-client";

export interface UseChatRoomParams {
    roomId: string;
    peerPublicKeyHex: string;
    onRemoteTyping?: (detail: { roomId: string; senderId: number; typing: boolean }) => void;
    setMessages: React.Dispatch<React.SetStateAction<any[]>>;
    localUser: LocalUser
}

export function useChatRoom({roomId, peerPublicKeyHex, onRemoteTyping, setMessages, localUser}: UseChatRoomParams) {
    const [pageCursor, setPageCursor] = useState<string | null>(null);
    const pageSize = 20;
    const fetchingRef = useRef(false);
    const hasMoreRef = useRef(true);

    const lastTypedSentRef = useRef<boolean>(false);
    const peerActiveRef = useRef<boolean>(false);
    const peerActiveDecayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const markPeerActive = useCallback(() => {
        peerActiveRef.current = true;
        if (peerActiveDecayRef.current) {
            try {
                clearTimeout(peerActiveDecayRef.current);
            } catch {
            }
        }
        peerActiveDecayRef.current = setTimeout(() => {
            peerActiveRef.current = false;
        }, 20000);
    }, []);

    const isE2EMock = process.env.NEXT_PUBLIC_E2E_MODE === 'mock';
    const [refreshRoomData, setRefreshRoomData] = useState<any>(null);

    const sentMessagesRef = useRef<Set<string>>(new Set());
    const receivedMessagesRef = useRef<Set<string>>(new Set());
    const processedMsgRef = useRef<Set<string>>(new Set());

    const fetchResolveRef = useRef<((value?: void) => void) | null>(null);
    const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const ackCooldownRef = useRef<number>(0);
    const readAckRef = useRef<((id: number | string) => void) | null>(null);
    const [isPartnerTyping, setIsPartnerTyping] = useState(false);
    const typingDecayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const ws = useWebSocketContext();

    const handleRemoteTyping = useCallback((detail: { roomId: ChatRoomId; senderId: LocalUserId; typing: boolean }) => {
        try {
            if (!detail) return;
            if (detail.roomId !== roomId) return;
            const me = Number(localUser?.id) || 0;
            if (detail.senderId === me) return; // ignore self
            setIsPartnerTyping(detail.typing);
            if (detail.typing) {
                if (typingDecayRef.current) {
                    try {
                        clearTimeout(typingDecayRef.current);
                    } catch {
                    }
                }
                typingDecayRef.current = setTimeout(() => {
                    setIsPartnerTyping(false);
                }, 4000);
            }
            onRemoteTyping?.(detail);
        } catch {
        }
    }, [roomId, localUser.id, onRemoteTyping]);

    const handleWSMessage = createHandleWSMessage({
        roomId,
        localUserId: Number(localUser?.id) || 0,
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
    });

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
        const emit = (evt: string, payload: any) => {
            try {
                if (localStorage.getItem('debug_read_ack') === '1') {
                    console.log('[read-ack] emit', {evt, payload});
                }
            } catch {
            }
            try {
                ws.emit(evt, {...payload, reader_id: Number(localUser?.id) || 0});
            } catch {
            }
        };
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
    }, [roomId, localUser?.id, isE2EMock, ws]);

    useEffect(() => {
        return () => {
            if (typingDecayRef.current) {
                try {
                    clearTimeout(typingDecayRef.current);
                } catch {
                }
            }
        };
    }, []);

    // Actions
    const sendMessage = useCallback(async (data: MessagePayload) => {
        await sendChatMessage({
            isE2EMock,
            roomId,
            peerPublicKeyHex,
            sentSet: sentMessagesRef.current,
            onAfterSend: () => {
                lastTypedSentRef.current = false;
            },
            socket: ws,
        }, data);
    }, [isE2EMock, roomId, localUser?.id, peerPublicKeyHex, ws]);

    const sendReadReceipt = useCallback((roomIdArg: string, lastMessageId: string) => {
        try {
            if (localStorage.getItem('debug_read_ack') === '1') {
                console.log('[read-ack] sendReadReceipt()', {roomId: roomIdArg, lastMessageId});
            }
        } catch {
        }
        try {
            if (isE2EMock) return;
            sendReadReceiptEvent({roomId: roomIdArg, socket: ws, senderId: Number(localUser?.id) ?? 0}, lastMessageId);
            readAckRef.current?.(lastMessageId);
        } catch (err) {
            console.error('Failed to send read receipt', err);
        }
    }, [isE2EMock, ws, localUser?.id]);

    const sendTyping = useCallback((isTyping: boolean) => {
        try {
            lastTypedSentRef.current = isTyping;
            sendTypingEvent({roomId, socket: ws, senderId: Number(localUser?.id) ?? 0}, isTyping);
        } catch {
        }
    }, [roomId, localUser?.id, ws]);

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
        state: {pageCursor, refreshRoomData, isPartnerTyping},
        actions: {sendMessage, sendReadReceipt, sendTyping},
        utils: {onWsErrorDuringFetch, markPeerActive},
    } as const;
}
