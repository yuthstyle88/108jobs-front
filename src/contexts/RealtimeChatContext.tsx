"use client";
import {useRouter} from "next/navigation";
import React, {useEffect, useRef, useState} from "react";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {makeEmitReadAcker} from "@/utils/chat/chatSocketUtils";
import {ensureSharedKeyForRoom} from "@/utils";
import {createHandleWSMessage} from "@/events/chat/handleWSMessage";
import {useWebSocketContext} from "@/contexts/WebSocketContext";
import { emitWsReconnected } from "@/events/chat";
import {ChatMessage} from "@/lib/lemmy-js-client/src";

interface WebSocketProviderProps {
    token: string;
    roomId: string;
    peerPublicKeyHex?: string;
    children: React.ReactNode;
}

export const PhoenixSocketProvider: React.FC<WebSocketProviderProps> = ({
    roomId,
    peerPublicKeyHex,
    children,
}) => {
    const [connectionError, setConnectionError] = useState(false);
    const [pageCursor, setPageCursor] = useState<string | null>(null);
    const peerActiveRef = useRef<boolean>(false);
    const peerActiveDecayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const markPeerActive = () => {
        try { console.info('[typing] peer active bump'); } catch {}
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
    };
    const router = useRouter();
    const {localUser} = useMyUser();
    const isE2EMock = process.env.NEXT_PUBLIC_E2E_MODE === "mock";
    const [refreshRoomData, setRefreshRoomData] = useState<any>(null);
    const processedMsgRef = useRef<Set<string>>(new Set());

    const fetchResolveRef = useRef<((value?: void) => void) | null>(null);
    const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const ackCooldownRef = useRef<number>(0);
    const readAckRef = useRef<((id: number | string) => void) | null>(null);

    // เตรียม handler รับข้อความ (reuse ของเดิม)
    const handleWSMessage = createHandleWSMessage({
        setMessages(value: ((prevState: ChatMessage[]) => ChatMessage[]) | ChatMessage[]): void {
        },
        roomId,
        localUserId: Number(localUser?.id) || 0,
        setRefreshRoomData,
        markPeerActive,
        processedMsgRef,
        peerActiveRef,
        setPageCursor,
        setHasMoreMessages: () => {
        }, // removed setHasMoreMessages, pass noop to satisfy signature
        setIsFetching: () => {
        }, // removed setIsFetching, pass noop to satisfy signature
        fetchTimeoutRef,
        fetchResolveRef,
        readAckRef,
        ackCooldownRef
    });

    // ใช้ WebSocketContext (global) ที่ห่อ useWebSocket ไว้แล้ว
    const ws = useWebSocketContext();

    // wire side-effects ตามสถานะ ws (แทน onOpen/onClose/onError/onMessage ในเวอร์ชันก่อน)
    // เปิด: เชื่อมสำเร็จ → reset state ที่เกี่ยวข้อง
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

    // ข้อผิดพลาดจาก message handler ระหว่าง fetch → เคลียร์ pending ให้เรียบร้อย
    const onWsErrorDuringFetch = () => {
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
            // removed setIsFetching(false)
        }
    };

    // message handler: ฟังผ่าน event bus ที่ useWebSocket ยิงให้อยู่แล้ว (emitChatNewMessage/emitChatTyping)
    // สำหรับ payload ที่ต้องผ่าน parser เดิม ให้ subscribe ผ่าน window หรือใช้ handleWSMessage กับ broadcast layer
    useEffect(() => {
        if(!ws || typeof ws.addMessageListener !== 'function') return;
        const off = ws.addMessageListener((data: unknown) => {
            try {
                handleWSMessage({data} as MessageEvent<any>);
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

    // เดิมมี ensure key ก่อนเชื่อม (ยังคงไว้)
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

    // Wire read-receipt acker ให้ใช้ ws.emit
    useEffect(() => {
        if(isE2EMock) {
            readAckRef.current = null;
            return;
        }
        if(!roomId) {
            readAckRef.current = null;
            return;
        }

        const emit = (evt: string, payload: any) => {
            try {
                ws.emit(evt, {...payload, reader_id: Number(localUser?.id) || 0});
            } catch {
            }
        };

        const baseAcker = makeEmitReadAcker(emit, roomId, 0);
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
    }, [roomId, localUser?.id, isE2EMock, ws]);

    // error → redirect
    useEffect(() => {
        if(connectionError) {
            router.replace("/not-found");
        }
    }, [connectionError, router]);

    return (
      <>
          {children}
      </>
    );
};