import { useState, useRef, useEffect, useCallback } from 'react';
// IMPORTANT: Adjust the import path if your service lives elsewhere
import { getChannelAdapter } from '@/services/PhoenixSocketService';
import {getReceiverIdFromRoom} from "@/utils/chat";

export type WebSocketStatus = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';

export interface SendMessageInput {
  roomId: string;
  content: string;
}

export interface UseWebSocketOptions {
    // การยืนยันตัวตน/สโคป
    token?: string | null;
    roomId?: string;
    // การเชื่อมต่อ
    autoConnect?: boolean;               // default: true
    autoJoin?: boolean;                  // default: true
    topicBuilder?: (roomId: string) => string;

    // callbacks ระดับ socket (ดิบ)
    onOpen?: () => void;
    onClose?: () => void;
    onError?: (error: unknown) => void;
    onMessage?: (data: unknown) => void;
    onNewMessage?: (data: any) => void;
    onTyping?: (data: any) => void;
    // แผนที่ event → handler (ยืดหยุ่นกว่า onNewMessage/onTyping แบบ fix ชื่อ)
    eventHandlers?: Record<string, (payload: any) => void>; // e.g. {'new_message': fn, 'chat:typing': fn}

    debug?: boolean;
}

export interface WebSocketAPI {
    status: 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';
    isReady: boolean;
    topic?: string;

    // ควบคุมการเชื่อมต่อ/เข้าช่อง
    connect: () => void;
    disconnect: () => void;
    join: (params?: { roomId?: string;}) => Promise<void> | void;
    leave: () => Promise<void> | void;

    // สั่งงานดิบ
    emit: (event: string, payload: any) => Promise<void> | void;

    addMessageListener: (cb: (data: unknown) => void) => () => void;
}
/**
 * React Hook that bridges to your PhoenixSocketService adapter.
 * It assumes the adapter behaves like a WebSocket/Channel bridge with
 * optional methods: connect(), disconnect()/close(), join(), leave(), emit().
 */
export function useWebSocket(options: UseWebSocketOptions = {}): WebSocketAPI {
  const {
    token,
    roomId,
    autoConnect = true,
    autoJoin = true,
    topicBuilder = (roomId: string) => `room:${roomId}`,
    onOpen,
    onClose,
    onError,
    onMessage,
    eventHandlers,
    debug,
  } = options;

  const adapterRef = useRef<any | null>(null);
  const listenersRef = useRef<Set<(data: unknown) => void>>(new Set());
  const [status, setStatus] = useState<WebSocketStatus>('idle');
  const [topic, setTopic] = useState<string | undefined>(undefined);

  const log = (...args: unknown[]) => { if (debug) console.log('[useWebSocket]', ...args); };

  const bindAdapterHandlers = useCallback((adapter: any) => {
    if (!adapter) return;

    // Wire base-level handlers
    if ('onopen' in adapter) {
      adapter.onopen = () => { setStatus('connected'); onOpen?.(); log('onopen'); };
    }
    if ('onclose' in adapter) {
      adapter.onclose = () => { setStatus('disconnected'); onClose?.(); log('onclose'); };
    }
    if ('onerror' in adapter) {
      adapter.onerror = (e: unknown) => { setStatus('error'); onError?.(e); log('onerror', e); };
    }
    if ('onmessage' in adapter) {
      adapter.onmessage = (evt: any) => {
        const data = evt?.data ?? evt; // handle both {data} or raw
        let parsed: any = data;
        try { parsed = typeof data === 'string' ? JSON.parse(data) : data; } catch {}
        try { onMessage?.(parsed); } catch {}
        // fan-out to local subscribers
        try { listenersRef.current.forEach(fn => { try { fn(parsed); } catch {} }); } catch {}
        try {
          const evName = (parsed && (parsed.event || parsed.type)) as string | undefined;
          const payload = (parsed && (parsed.payload ?? parsed.data)) as any;
          if (evName && eventHandlers && typeof eventHandlers[evName] === 'function') {
            eventHandlers[evName](payload);
          }
        } catch {}
      };
    }
  }, [onOpen, onClose, onError, onMessage, eventHandlers, debug]);

  // Connect when token is available
  const connect = useCallback(() => {
    if (!autoConnect) { setStatus('idle'); return; }
    if (!token || !roomId) { setStatus('idle'); return; }
    setStatus('connecting');
    const nextTopic = topicBuilder(roomId);
    setTopic(nextTopic);
    const adapter = getChannelAdapter(token, nextTopic);
    adapterRef.current = adapter;
    bindAdapterHandlers(adapter);
  }, [token, roomId, autoConnect, topicBuilder, bindAdapterHandlers]);

  const disconnect = useCallback(() => {
    const a = adapterRef.current;
    try { a?.close?.(); } catch {}
    try { a?.disconnect?.(); } catch {}
    adapterRef.current = null;
    setStatus('disconnected');
    onClose?.();
    log('disconnect');
  }, [onClose]);

  const join = useCallback(async (params?: { roomId?: string;}) => {
    const a = adapterRef.current; if (!a) return;
    const rid = params?.roomId ?? roomId; if (!rid) return;
    const t = topicBuilder(rid);
    if (typeof a.join === 'function') { return await a.join(t); }
    if (typeof a.emit === 'function') { return await a.emit('phx_join', { topic: t }); }
  }, [roomId, topicBuilder]);

  const leave = useCallback(async () => {
    const a = adapterRef.current; if (!a) return;
    const rid = roomId; if (!rid) return;
    const t = topicBuilder(rid);
    if (typeof a.leave === 'function') { return await a.leave(t); }
    if (typeof a.emit === 'function') { return await a.emit('phx_leave', { topic: t }); }
  }, [roomId, topicBuilder]);

  const emit = useCallback(async (event: string, payload: any) => {
    const a = adapterRef.current; if (!a) return;
    try { return await a.emit?.(event, payload); } catch (e) { log('emit error', { event, e }); }
  }, []);

  const addMessageListener = useCallback((cb: (data: unknown) => void) => {
    listenersRef.current.add(cb);
    return () => listenersRef.current.delete(cb);
  }, []);

  // Auto-connect on mount / token change; auto-join when roomId changes
  useEffect(() => {
    if (!autoConnect || !token || !roomId ) { setStatus('idle'); return; }
    connect();
    return () => { disconnect(); };
  }, [autoConnect, token, roomId]);

  useEffect(() => {
    if (!autoJoin || status !== 'connected') return;
    if (!roomId) return;
    void join({ roomId });
  }, [autoJoin, status, roomId, join]);

  return {
    status,
    isReady: status === 'connected',
    topic,
    connect,
    disconnect,
    join,
    leave,
    emit,
    addMessageListener,
  };
}
