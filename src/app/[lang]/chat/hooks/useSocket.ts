import { useEffect, useRef, useCallback } from "react";

type UseWebSocketProps = {
  token: string;
  partnerId: string;
  onMessage: (event: MessageEvent) => void;
};

type MessagePayload = {
  message: string;
};

// Singleton WebSocket and listeners
let socket: WebSocket | null = null;
const listeners = new Set<(event: MessageEvent) => void>();
let reconnectTimeout: NodeJS.Timeout | null = null;

export const useWebSocket = ({ token, partnerId, onMessage }: UseWebSocketProps) => {
  const currentUrl = `wss://fastwork.ibrowe.com/api/v4/ws/?token=${token}&partner_id=${partnerId}`;
  const isMounted = useRef(true);

  const connect = useCallback(() => {
    if (socket && socket.readyState !== WebSocket.CLOSED) {
      console.log("🛑 Socket already exists. Skipping re-connection.");
      return;
    }

    socket = new WebSocket(currentUrl);

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    socket.onmessage = (event) => {
      listeners.forEach((listener) => listener(event));
    };

    socket.onclose = (event) => {
      console.warn("❌ WebSocket disconnected", event);
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      reconnectTimeout = setTimeout(() => {
        if (isMounted.current) connect();
      }, 3000);
    };

    socket.onerror = (err) => {
      console.error("🚨 WebSocket error", err);
      socket?.close(); // force reconnect
    };
  }, [currentUrl]);

  useEffect(() => {
    isMounted.current = true;
    connect();

    listeners.add(onMessage);

    return () => {
      isMounted.current = false;
      listeners.delete(onMessage);

      // Chỉ đóng nếu không còn ai nghe nữa
      if (listeners.size === 0) {
        socket?.close();
        socket = null;
      }
    };
  }, [connect, onMessage]);

  const sendMessage = (data: MessagePayload) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    } else {
      console.warn("❗ WebSocket not ready to send");
    }
  };

  return { sendMessage };
};
