"use client";
import React from "react";

interface WebSocketProviderProps {
  token: string;
  roomId: string;
  peerPublicKeyHex?: string;
  children: React.ReactNode;
}

/**
 * PhoenixSocketProvider (deprecated shim)
 * -------------------------------------
 * We now centralize all WebSocket wiring and message handling in:
 *  - WebSocketContext (connection lifecycle)
 *  - useChatRoom (domain events: chat:message / chat:typing / chat:read)
 *
 * This component remains as a no-op wrapper to preserve existing imports.
 * Remove its usage from your tree when convenient.
 */
export const PhoenixSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  return <>{children}</>;
};