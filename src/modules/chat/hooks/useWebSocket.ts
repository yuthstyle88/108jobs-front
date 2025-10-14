import {useCallback, useEffect, useRef, useState} from 'react';
// IMPORTANT: Adjust the import path if your service lives elsewhere
import {getChannelAdapter} from '@/modules/chat/services/PhoenixSocketService';
import {WebSocketStatus} from "@/modules/chat/types";


export interface SendMessageInput {
  roomId: string;
  content: string;
}

export interface UseWebSocketOptions {
    // การยืนยันตัวตน/สโคป
    token?: string | null;
    roomId: string;
    senderId: number;
    // การเชื่อมต่อ
    autoConnect?: boolean;               // default: true
    // NOTE: autoJoin only runs when the underlying adapter sets `requiresManualJoin === true`
    autoJoin?: boolean;                  // default: true
    // ปิด/เปิดการ join room จาก hook นี้ (ค่าเริ่มต้น: ปิด)
    allowJoin?: boolean;

    topicBuilder?: (roomId: string) => string;

    // callbacks ระดับ socket (ดิบ)
    onOpen?: () => void;
    onClose?: () => void;
    onError?: (error: unknown) => void;
    onMessage?: (data: unknown) => void;
    onNewMessage?: (data: any) => void;
    onTyping?: (data: any) => void;
    // แผนที่ event → handler (ยืดหยุ่นกว่า onNewMessage/onTyping แบบ fix ชื่อ)
    eventHandlers?: Record<string, (payload: any) => void>; // e.g. {'chat:message': fn, 'chat:typing': fn}

    debug?: boolean;
}

export interface WebSocketAPI {
    status: 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';
    isReady: boolean;
    topic?: string;

    // ควบคุมการเชื่อมต่อ/เข้าช่อง
    connect: () => void;
    disconnect: () => void;
    join: (params?: { roomId?: string; senderId?: number }) => Promise<void> | void;
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
export function useWebSocket(options: Partial<UseWebSocketOptions> = {}): WebSocketAPI {
  const {
    token,
    roomId,
    senderId,
    autoConnect = true,
    autoJoin = true,
    topicBuilder = (roomId: string) => `room:${roomId}`,
    onOpen,
    onClose,
    onError,
    onMessage,
    onNewMessage,
    onTyping,
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

    // Avoid double-binding on the same adapter instance
    if ((adapter as any).__ws_bound) return;
    (adapter as any).__ws_bound = true;

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

        // top-level raw handler
        try { onMessage?.(parsed); } catch {}

        // fan-out to local subscribers
        try { listenersRef.current.forEach(fn => { try { fn(parsed); } catch {} }); } catch {}

        // event routing
        try {
          const evName = (parsed && (parsed.event || parsed.type)) as string | undefined;
          const payload = (parsed && (parsed.payload ?? parsed.data)) as any;
          if (evName) {
            // specific convenience callbacks
            if (evName === 'chat:message') {
              try { onNewMessage?.(payload); } catch {}
            } else if (evName === 'chat:typing') {
              try { onTyping?.(payload); } catch {}
            }
            // flexible map-based handlers
            if (eventHandlers && typeof eventHandlers[evName] === 'function') {
              eventHandlers[evName](payload);
            }
          }
        } catch {}
      };
    }
  }, [onOpen, onClose, onError, onMessage, onNewMessage, onTyping, eventHandlers, debug]);

  // Connect when token is available
  const connect = useCallback(() => {
    if (!autoConnect) { setStatus('idle'); return; }
    if (!token || !roomId) { setStatus('idle'); return; }

    const nextTopic = topicBuilder(roomId);

    // Fast path: if current adapter is connected for the same topic, do nothing
    const current = adapterRef.current as any;
    if (current && status === 'connected' && topic === nextTopic) {
      log('connect skipped (already connected to same topic)');
      return;
    }

    // Teardown existing adapter (if any) before reconnecting
    if (current) {
      try { current.close?.(); } catch {}
      try { current.disconnect?.(); } catch {}
    }

    setStatus('connecting');
    if (topic !== nextTopic) setTopic(nextTopic);
    const adapter = getChannelAdapter(token, nextTopic);
    adapterRef.current = adapter;
    bindAdapterHandlers(adapter);
  }, [token, roomId, autoConnect, topicBuilder, bindAdapterHandlers, status, topic]);

  const disconnect = useCallback(() => {
    const a = adapterRef.current;
    try { a?.close?.(); } catch {}
    try { a?.disconnect?.(); } catch {}
    adapterRef.current = null;
    setStatus('disconnected');
    // Do not call onClose here; adapter.onclose will invoke it to avoid duplicates
    log('disconnect');
  }, []);

  const join = useCallback(async (params?: { roomId?: string; senderId?: number }) => {
    const a = adapterRef.current; if (!a) return;
    const rid = params?.roomId ?? roomId; if (!rid) return;
    const sid = params?.senderId ?? senderId; if (sid === undefined) return;
    console.log('[------------useWebSocket] join', { roomId: rid, senderId: sid });
    const t = topicBuilder(rid);
    if (typeof a.join === 'function') { return await a.join(t); }
    if (typeof a.emit === 'function') { return await a.emit('phx_join', { topic: t, senderId: sid  }); }
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
    const a = adapterRef.current as any;
    // Only adapters that declare they require manual join will be joined here.
    if (a && a.requiresManualJoin === true) {
      if (roomId && typeof senderId === 'number') {
        void join({ roomId, senderId });
      }
    }
  }, [autoJoin, status, roomId, senderId, join]);

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
