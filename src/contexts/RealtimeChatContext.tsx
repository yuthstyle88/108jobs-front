"use client";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface MessagePayload {
  message: string;
}

interface WebSocketContextValue {
  sendMessage: (data: MessagePayload) => void;
  isConnected: boolean;
  partnerId: string;
}

const WebSocketContext = createContext<WebSocketContextValue | undefined>(
  undefined
);

// Singleton instance
let socket: WebSocket | null = null;
const listeners = new Map<string, (event: MessageEvent) => void>();
let reconnectTimeout: NodeJS.Timeout | null = null;

interface WebSocketProviderProps {
  token: string;
  partnerId: string;
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  token,
  partnerId,
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const router = useRouter();
  const wsUrl = `wss://fastwork.ibrowe.com/api/v4/ws/?token=${token}&partner_id=${partnerId}`;

  const connect = useCallback(() => {
    if (socket && socket.readyState !== WebSocket.CLOSED) return;

    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      setIsConnected(true);
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        reconnectTimeout = null;
      }
      console.log("✅ WebSocket connected");
    };

    socket.onmessage = (event) => {
      for (const fn of listeners.values()) {
        fn(event);
      }
    };

    socket.onclose = () => {
      setIsConnected(false);
      reconnectTimeout = setTimeout(connect, 3000);
    };

    socket.onerror = (err) => {
      console.error("🚨 WebSocket error", err);
      if (err instanceof Event && socket?.readyState === WebSocket.CLOSING) {
        router.replace("/error");
      }
      socket?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsUrl]);

  useEffect(() => {
    connect();
    return () => {
      if (listeners.size === 0) {
        socket?.close();
        socket = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connect]);

  const sendMessage = useCallback((data: MessagePayload) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    } else {
      console.warn("❗ WebSocket not ready to send");
    }
  }, []);

  return (
    <WebSocketContext.Provider value={{ sendMessage, isConnected, partnerId }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (
  key: string,
  onMessage: (event: MessageEvent) => void
) => {
  const context = useContext(WebSocketContext);
  if (!context)
    throw new Error("useWebSocket must be used within WebSocketProvider");

  useEffect(() => {
    listeners.set(key, onMessage);
    return () => {
      listeners.delete(key);
    };
  }, [key, onMessage]);

  return context;
};
