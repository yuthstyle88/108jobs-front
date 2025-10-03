import {useCallback, useEffect, useRef, useState} from 'react';
import {useWebSocketContext} from '@/contexts/WebSocketContext';

// Chat helpers (reuse your existing utilities)
import {createHandleWSMessage} from '@/events/chat/handleWSMessage';
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {ensureSharedKeyForRoom} from "@/utils";
import {broadcastToListeners, fetchHistoryPage, makeEmitReadAcker, MessagePayload} from "@/utils/chat";
import {
    sendChatMessage,
    sendReadReceipt as sendReadReceiptEvent,
    sendTyping as sendTypingEvent
} from "@/events/chat/sendEvents";

export interface UseChatRoomParams {
    roomId: string;
    peerPublicKeyHex?: string;
    onRemoteTyping?: (detail: { roomId: string; senderId: number; typing: boolean }) => void;
}

export function useChatRoom({roomId, peerPublicKeyHex, onRemoteTyping}: UseChatRoomParams) {
    const [pageCursor, setPageCursor] = useState<string | null>(null);
    const pageSize = 20;
    const fetchingRef = useRef(false);
    const hasMoreRef = useRef(true);

    const lastTypedSentRef = useRef<boolean>(false);
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
        peerActiveDecayRef.current = setTimeout(() => {
            peerActiveRef.current = false;
        }, 20000);
    }, []);

    const {localUser} = useMyUser();
    const isE2EMock = process.env.NEXT_PUBLIC_E2E_MODE === 'mock';
    const [refreshRoomData, setRefreshRoomData] = useState<any>(null);

    const sentMessagesRef = useRef<Set<string>>(new Set());
    const receivedMessagesRef = useRef<Set<string>>(new Set());
    const processedMsgRef = useRef<Set<string>>(new Set());

    const fetchResolveRef = useRef<((value?: void) => void) | null>(null);
    const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const ackCooldownRef = useRef<number>(0);
    const readAckRef = useRef<((id: number | string) => void) | null>(null);

    const handleWSMessage = createHandleWSMessage({
        roomId,
        localUserId: Number(localUser?.id) || 0,
        setRefreshRoomData,
        markPeerActive,
        onRemoteTyping,
        processedMsgRef,
        peerActiveRef,
        setPageCursor,
        setHasMoreMessages: (val: boolean) => { hasMoreRef.current = val; },
        setIsFetching: (val: boolean) => { fetchingRef.current = val; },
        fetchTimeoutRef,
        fetchResolveRef,
        readAckRef,
        ackCooldownRef,
    });

    const ws = useWebSocketContext();

    useEffect(() => {
      if (!ws || typeof ws.addMessageListener !== 'function') return;
      const off = ws.addMessageListener((data: unknown) => {
        try { handleWSMessage({ data } as any); } catch {}
      });
      return () => { try { off?.(); } catch {} };
    }, [ws, handleWSMessage]);

    // E2E shared key warmup
    useEffect(() => {
        if(isE2EMock) return;
        if(!roomId || !localUser) return;
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
        if(isE2EMock || !roomId) {
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
      if (fetchTimeoutRef.current) {
        try { clearTimeout(fetchTimeoutRef.current); } catch {}
        fetchTimeoutRef.current = null;
      }
      if (fetchResolveRef.current) {
        try { fetchResolveRef.current(); } catch {}
        fetchResolveRef.current = null;
      }
      fetchingRef.current = false;
    }, []);

    const fetchHistory = useCallback(async () => {
      if (isE2EMock || fetchingRef.current || !hasMoreRef.current) return;
      fetchingRef.current = true;
      try {
        const { prev, next } = await fetchHistoryPage(
          { roomId, cursor: pageCursor, limit: pageSize },
          {
            localUserId: Number(localUser?.id) || 0,
            receivedSet: receivedMessagesRef.current,
            broadcast: (m) => broadcastToListeners(m),
          },
        );
        if (typeof prev === 'string' && prev.length > 0) {
          setPageCursor(next);
          hasMoreRef.current = true;
        } else {
          setPageCursor(null);
          hasMoreRef.current = false;
        }
      } catch (e) {
        console.error('fetchHistory failed', e);
      } finally {
        fetchingRef.current = false;
      }
    }, [isE2EMock, roomId, pageCursor, pageSize, localUser?.id]);

    return {
        state: { pageCursor, refreshRoomData },
        actions: { sendMessage, sendReadReceipt, sendTyping, fetchHistory },
        utils: { onWsErrorDuringFetch, markPeerActive },
    } as const;
}
