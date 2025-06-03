import { useEffect, useRef } from "react";

interface UseWebSocketProps {
  token: string;
  partnerId: string;
  onMessage: (event: MessageEvent) => void;
}
interface MessagePayload {
  message: string;
}

export const useWebSocket = ({ token, partnerId, onMessage }: UseWebSocketProps) => {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!token || !partnerId) return;

    if (socketRef.current) {
      // console.warn("⚠️ Existing WebSocket already exists. Closing it.");
      socketRef.current.close();
    }

    const wsUrl = `wss://fastwork.ibrowe.com/api/v4/ws/?token=${token}&partner_id=${partnerId}`;
    const ws = new WebSocket(wsUrl);

    // console.log("🔌 Connecting WebSocket:", wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      // console.log("✅ WebSocket connected");
    };

    ws.onmessage = onMessage;

    ws.onclose = (event) => {
      console.log("❌ WebSocket disconnected", event);
    };

    ws.onerror = (err) => {
      console.error("🚨 WebSocket error:", err);
    };

    return () => {
      // console.log("🧹 Cleaning up WebSocket...");
      ws.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, partnerId]);

  const sendMessage = (data: MessagePayload) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    } else {
      console.warn("⚠️ Cannot send: WebSocket not connected");
    }
  };

  return {
    sendMessage,
    socket: socketRef.current,
  };
};
