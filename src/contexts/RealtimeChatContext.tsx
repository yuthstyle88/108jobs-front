"use client";

import { useRouter } from "next/navigation";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
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
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connectionError, setConnectionError] = useState(false);
  const router = useRouter();

  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isManuallyClosingRef = useRef(false);
  const [connectionAttemptKey, setConnectionAttemptKey] = useState(0);

  const wsUrl = `wss://fastwork.ibrowe.com/api/v4/ws/?token=${token}&job_id=${partnerId}`;

  useEffect(() => {
    const newSocket = new WebSocket(wsUrl);
    setSocket(newSocket);
    isManuallyClosingRef.current = false;

    newSocket.onopen = () => {
      setIsConnected(true);
      setConnectionError(false);
      isManuallyClosingRef.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      console.log("✅ WebSocket connected to", partnerId);
    };

    newSocket.onmessage = (event) => {
      for (const fn of listeners.values()) {
        fn(event);
      }
    };

    newSocket.onclose = (event) => {
      setIsConnected(false);
      console.warn("❌ WebSocket closed. Code:", event.code);

      if (isManuallyClosingRef.current) {
        console.log("🟡 WebSocket closed manually. Skipping error handling.");
        return;
      }

      // Only redirect if partnerId truly invalid or blocked
      if ([1008, 4000, 4400].includes(event.code)) {
        setConnectionError(true);
        return;
      }

      reconnectTimeoutRef.current = setTimeout(() => {
        setSocket(null);
        setConnectionAttemptKey((prev) => prev + 1); // Trigger reconnect
      }, 3000);
    };

    newSocket.onerror = (err) => {
      if (isManuallyClosingRef.current) {
        console.log("🟡 WebSocket error ignored due to manual close.");
        return;
      }
      console.error("🚨 WebSocket encountered error", err);
    };

    return () => {
      isManuallyClosingRef.current = true;
      newSocket.close();
      setSocket(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsUrl, connectionAttemptKey]);

  useEffect(() => {
    if (connectionError) {
      router.replace("/not-found");
    }
  }, [connectionError, router]);

  const sendMessage = useCallback(
    (data: MessagePayload) => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(data));
      } else {
        console.warn("❗ WebSocket not ready to send");
      }
    },
    [socket]
  );

  return (
    <WebSocketContext.Provider value={{ sendMessage, isConnected, partnerId }}>
      {children}
    </WebSocketContext.Provider>
  );
};

const listeners = new Map<string, (event: MessageEvent) => void>();

export const useWebSocket = (
  key: string,
  onMessage: (event: MessageEvent) => void
): WebSocketContextValue => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within WebSocketProvider");
  }

  useEffect(() => {
    listeners.set(key, onMessage);
    return () => {
      listeners.delete(key);
    };
  }, [key, onMessage]);

  return context;
};
