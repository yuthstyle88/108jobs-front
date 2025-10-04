'use client';
// WebSocketContext.tsx
// ------------------------------------------------------------
// Purpose: Wrap the real useWebSocket hook with a React Context
// so consumers can access a single, shared websocket API.
// ------------------------------------------------------------

import React, {createContext, useContext} from 'react';
import type {UseWebSocketOptions, WebSocketAPI} from '@/hooks/chat/useWebSocket';
import {useWebSocket} from '@/hooks/chat/useWebSocket';

// ========================= Context Layer =======================
interface WebSocketContextValue extends WebSocketAPI {}

const WebSocketContext = createContext<WebSocketContextValue | undefined>(undefined);

// This should be the only place where WebSocket context is provided; other providers (like useRoomWebSocket) have been deprecated.
export const WebSocketProvider: React.FC<React.PropsWithChildren<{ options?: UseWebSocketOptions }>> = ({ children, options }) => {

  const ws = useWebSocket(options);
    console.log('WebSocketProvider', ws);
  const value = React.useMemo(() => ws, [ws]);
  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

WebSocketProvider.displayName = 'WebSocketProvider';

export function useWebSocketContext(): WebSocketContextValue {
  const ctx = useContext(WebSocketContext);
  if (!ctx) throw new Error('useWebSocketContext must be used within WebSocketProvider');
  return ctx;
}

// Notes:
// - The real connection logic (Phoenix adapter, events, retry, etc.) lives in `@/hooks/useWebSocket`.
// - This file now only exposes a Context/Provider wrapper around that hook.