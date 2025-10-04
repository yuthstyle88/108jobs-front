import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useWebSocketContext} from '@/contexts/WebSocketContext';
import {createHandleWSMessage} from '@/events/chat/handleWSMessage';
import {ensureSharedKeyForRoom} from "@/utils";
import {makeEmitReadAcker, MessagePayload} from "@/utils/chat";
import {
    sendChatMessage,
    sendReadReceipt as sendReadReceiptEvent,
    sendTyping as sendTypingEvent
} from "@/events/chat/sendEvents";
import {ChatRoomId, LocalUser, LocalUserId} from "lemmy-js-client";
import {useChatStore} from "@/store/chatStore"
import {makeReadAckEmitter} from "@/utils/chat/socket-emitter";
import {emitChatTyping, emitWsReconnected} from "@/events/chat";

// Safe DOM CustomEvent dispatcher
function dispatchDomEvent(name: string, detail: any) {
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(name, { detail }));
    }
  } catch {}
}

const TYPING_DECAY_MS = 4000;
const PEER_ACTIVE_DECAY_MS = 20000;

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
        // Notify DOM listeners that peer is currently active in this room
        emitChatTyping({ roomId, senderId: 3 , typing: true });
        if(peerActiveDecayRef.current) {
         console.log('[peerActiveDecay] clearTimeout', peerActiveDecayRef.current);
            try {
                clearTimeout(peerActiveDecayRef.current);
            } catch {
            }
        }
        peerActiveDecayRef.current = setTimeout(() => {
            peerActiveRef.current = false;
            // Notify DOM listeners that peer is no longer active
            dispatchDomEvent('chat:peer-active', { roomId, active: false });
        }, PEER_ACTIVE_DECAY_MS);
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
    const [connectionError, setConnectionError] = useState(false);

    const ws = useWebSocketContext();
    useEffect(() => {
        if(ws.isReady) {
            setConnectionError(false);
            setPageCursor(null);
            try {
                // Notify in-app listeners that WS reconnected (no dynamic import)
                emitWsReconnected?.();
            } catch {}
        }
    }, [ws.isReady]);

    // ปิด: สถานะไม่พร้อม
    useEffect(() => {
        if(!ws.isReady) {
            // removed setIsConnected(false)
        }
    }, [ws.isReady]);

    const handleRemoteTyping = useCallback((detail: { roomId: ChatRoomId; senderId: LocalUserId; typing: boolean }) => {
        try {
            if(!detail) return;
            if(detail.roomId !== roomId) return;
            const me = Number(localUser?.id) || 0;
            if(detail.senderId === me) return; // ignore self
            setIsPartnerTyping(detail.typing);
            dispatchDomEvent('chat:partner-typing', { roomId, senderId: Number(detail.senderId) || 0, typing: !!detail.typing });
            if(detail.typing) {
                if(typingDecayRef.current) {
                    try {
                        clearTimeout(typingDecayRef.current);
                    } catch {
                    }
                }
                typingDecayRef.current = setTimeout(() => {
                    setIsPartnerTyping(false);
                    dispatchDomEvent('chat:partner-typing', { roomId, senderId: Number(detail.senderId) || 0, typing: false });
                }, TYPING_DECAY_MS);
            }
            onRemoteTyping?.(detail);
        } catch {
        }
    }, [roomId, localUser.id, onRemoteTyping]);

    const handleWSMessage = React.useMemo(() => createHandleWSMessage({
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
    }), [roomId, localUser?.id, setMessages, setRefreshRoomData, markPeerActive, handleRemoteTyping]);

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
        if(isE2EMock) return;
        if(!roomId || !localUser) return;
        (async () => {
            try {
                if(peerPublicKeyHex) {
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
        if(isE2EMock || !roomId) {
            readAckRef.current = null;
            return;
        }
        const emit = makeReadAckEmitter(ws as any, Number(localUser?.id) || 0);
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
            if(typingDecayRef.current) {
                try {
                    clearTimeout(typingDecayRef.current);
                } catch {
                }
            }
            if(peerActiveDecayRef.current) {
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

    const sendReadReceipt = useCallback((roomIdArg: string, lastMessageId: string) => {
        try {
            if(localStorage.getItem('debug_read_ack') === '1') {
                console.log('[read-ack] sendReadReceipt()', {roomId: roomIdArg, lastMessageId});
            }
        } catch {
        }
        try {
            if(isE2EMock) return;
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
        if(fetchTimeoutRef.current) {
            try {
                clearTimeout(fetchTimeoutRef.current);
            } catch {
            }
            fetchTimeoutRef.current = null;
        }
        if(fetchResolveRef.current) {
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
