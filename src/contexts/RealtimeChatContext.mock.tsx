"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface MessagePayload {
  message: string;
  fileUrl?: string;
  fileType?: string;
  fileName?: string;
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

/** Registry of listeners giống hệt bản thật */
const listeners = new Map<string, (event: MessageEvent) => void>();

/** Helper tạo MessageEvent giả */
function makeMessageEvent(data: unknown): MessageEvent {
  return { data: JSON.stringify(data) } as unknown as MessageEvent;
}

/** Một vài tin nhắn mẫu random */
const cannedReplies = [
  "👍 Noted!",
  "Ok, I’ll check and get back to you.",
  "Can you share the source file?",
  "Thanks! Looks good to me.",
  "Please add one more revision on the header.",
  "Gửi giúp mình báo giá nha.",
];

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  token,       // không dùng, chỉ để tương thích
  partnerId,
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /** Giả lập connect sau 300ms */
  useEffect(() => {
    const t = setTimeout(() => setIsConnected(true), 300);
    return () => clearTimeout(t);
  }, []);

  /** Giả lập server push tin nhắn ngẫu nhiên mỗi 20–35s */
  useEffect(() => {
    if (!isConnected) return;

    function schedule() {
      const ms = 20000 + Math.floor(Math.random() * 15000);
      intervalRef.current = setTimeout(() => {
        const reply =
          cannedReplies[Math.floor(Math.random() * cannedReplies.length)];

        const evt = makeMessageEvent({
          type: "message",
          partnerId,
          payload: {
            id: `mock-${Date.now()}`,
            senderId: partnerId,
            content: reply,
            createdAt: new Date().toISOString(),
          },
        });

        for (const fn of listeners.values()) fn(evt);
        schedule(); // lặp lại
      }, ms) as unknown as NodeJS.Timeout;
    }

    schedule();
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isConnected, partnerId]);

  /** Gửi tin: phát cho listener local (echo “You”) và trả lời giả của partner sau 600–1200ms */
  const sendMessage = useCallback(
    (data: MessagePayload) => {
      if (!isConnected) return;

      // 1) Phát event "client_sent" để UI có thể append ngay (You)
      const clientEvt = makeMessageEvent({
        type: "client_sent",
        partnerId,
        payload: {
          id: `you-${Date.now()}`,
          senderId: "you",
          content: data.message,
          fileUrl: data.fileUrl ?? null,
          fileType: data.fileType ?? null,
          fileName: data.fileName ?? null,
          createdAt: new Date().toISOString(),
        },
      });
      for (const fn of listeners.values()) fn(clientEvt);

      // 2) Phát event "message" giả từ partner (echo hoặc canned reply)
      const ms = 600 + Math.floor(Math.random() * 600);
      setTimeout(() => {
        const evt = makeMessageEvent({
          type: "message",
          partnerId,
          payload: {
            id: `mock-reply-${Date.now()}`,
            senderId: partnerId,
            content:
              data.message?.trim().length > 0
                ? `Re: ${data.message}`
                : cannedReplies[Math.floor(Math.random() * cannedReplies.length)],
            createdAt: new Date().toISOString(),
          },
        });
        for (const fn of listeners.values()) fn(evt);
      }, ms);
    },
    [isConnected, partnerId]
  );

  const value = useMemo<WebSocketContextValue>(
    () => ({ sendMessage, isConnected, partnerId }),
    [sendMessage, isConnected, partnerId]
  );

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

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
