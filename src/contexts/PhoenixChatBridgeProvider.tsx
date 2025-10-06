"use client";
import React, { useEffect, useRef } from "react";
import { useChatStore } from "@/store/chatStore";

// Try to use your existing WebSocketContext (if present in your codebase).
// If you have a different hook/path, adjust this import accordingly.
// The expected shape is an object with:
//   - connected: boolean
//   - on(event, handler)
//   - off(event, handler)?
//   - push(event, payload)  OR  send(JSON.stringify(...))
import { useWebSocketContext } from "@/contexts/WebSocketContext";

function pickChannel(ws: any, roomId?: string) {
  if (!ws) return null;
  if (ws.channel && typeof ws.channel.on === "function") return ws.channel;
  if (ws.chan && typeof ws.chan.on === "function") return ws.chan;
  if (ws.currentChannel && typeof ws.currentChannel.on === "function") return ws.currentChannel;
  const list = ws.channels || ws._channels || ws.__channels__;
  if (Array.isArray(list) && list.length) {
    if (roomId) {
      const topic = `room:${roomId}`;
      const byRoom = list.find((c: any) => String(c?.topic || "") === topic || String(c?.topic || "").includes(roomId));
      if (byRoom) return byRoom;
    }
    return list[0];
  }
  return null;
}

interface WebSocketProviderProps {
  token: string;
  roomId: string;
  peerPublicKeyHex?: string;
  children: React.ReactNode;
}

/**
 * PhoenixSocketProvider (compat bridge)
 * -------------------------------------
 * Historically a no-op wrapper. We now upgrade it to:
 *  - setSender for chatStore (so store can resend when online)
 *  - subscribe to server events to call ackMessage(...)
 * Keep until all imports are migrated to the new Provider.
 */
export const PhoenixChatBridgeProvider: React.FC<WebSocketProviderProps> = ({ children, roomId }) => {
  const ws = useWebSocketContext?.() as any;
  const store = useChatStore();

  const wiredWsRef = useRef<any>(null);
  const senderWiredRef = useRef<boolean>(false);
  const lastFlushAtRef = useRef<number>(0);

  useEffect(() => {
    if (!ws) return;

    // Avoid wiring the same ws instance repeatedly
    if (wiredWsRef.current === ws) return;
    wiredWsRef.current = ws;

    const maybeFlush = () => {
      const now = Date.now();
      if (now - lastFlushAtRef.current > 1500) {
        lastFlushAtRef.current = now;
        void store.flushPending();
      }
    };

    // Wire only when network is ONLINE (open). Do not set sender on mount.
    const onOpen = () => {
      store.setOnline(true);

      // Lazily wire sender exactly once per ws instance
      if (!senderWiredRef.current) {
        senderWiredRef.current = true;
        store.setSender(async (draft) => {
          try {
            const ch = pickChannel(ws, roomId);
            if (ch && typeof ch.push === "function") {
              const id = await new Promise<string | "">((resolve) => {
                try {
                  const push = ch.push("chat:message", draft);
                  let settled = false;
                  const to = setTimeout(() => { if (!settled) { settled = true; resolve(""); } }, 4000);
                  if (typeof push?.receive === "function") {
                    push.receive("ok", (resp: any) => {
                      if (settled) return;
                      settled = true;
                      clearTimeout(to);
                      resolve(typeof resp?.id === "string" ? resp.id : "");
                    });
                    push.receive("error", () => {
                      if (settled) return;
                      settled = true;
                      clearTimeout(to);
                      resolve("");
                    });
                    push.receive("timeout", () => {
                      if (settled) return;
                      settled = true;
                      clearTimeout(to);
                      resolve("");
                    });
                  } else {
                    resolve("");
                  }
                } catch {
                  resolve("");
                }
              });
              return id || false;
            }
            if (typeof ws?.push === "function") { try { ws.push("chat:message", draft); } catch {} return false; }
            if (typeof ws?.emit === "function") { try { ws.emit("chat:message", draft); } catch {} return false; }
            if (typeof ws?.send === "function") { try { ws.send(JSON.stringify({ event: "chat:message", payload: draft })); } catch {} return false; }
            return false;
          } catch {
            return false;
          }
        });
      }

      maybeFlush();
    };

    const onClose = () => {
      store.setOnline(false);
    };

    try { ws.on?.("open", onOpen); } catch {}
    try { ws.on?.("close", onClose); } catch {}

    // If the socket is already connected, trigger onOpen once
    if (typeof ws?.connected === "boolean" && ws.connected) {
      onOpen();
    }

    return () => {
      try { ws.off?.("open", onOpen); } catch {}
      try { ws.off?.("close", onClose); } catch {}
      wiredWsRef.current = null;
      senderWiredRef.current = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ws, roomId]);

  useEffect(() => {
    if (!ws) return; // allow channel-based wiring even when ws.on is missing
    const ch = pickChannel(ws, roomId);
    const ackFromMessage = (payload: any) => {
      try {
        const p = payload?.payload ?? payload;
        if (p?.id) {
          const rid = String(p?.roomId ?? roomId ?? "");
          if (rid) store.ackMessage(rid, String(p.id), { createdAt: p.createdAt, content: p.content });
        }
      } catch {}
    };
    const ackFromForward = (msg: any) => {
      try {
        const inner = msg?.payload?.payload ?? msg?.payload ?? msg;
        if (inner?.event === "chat:message") {
          const p = inner?.payload ?? inner;
          if (p?.id) {
            const rid = String(p?.roomId ?? roomId ?? "");
            if (rid) store.ackMessage(rid, String(p.id), { createdAt: p.createdAt, content: p.content });
          }
        }
      } catch {}
    };
    if (ch && typeof ch.on === "function") {
      try { ch.on("chat:message", ackFromMessage); } catch {}
      try { ch.on("forward", ackFromForward); } catch {}
      return () => {
        try { ch.off?.("chat:message", ackFromMessage); } catch {}
        try { ch.off?.("forward", ackFromForward); } catch {}
      };
    } else {
      try { ws.on("chat:message", ackFromMessage); } catch {}
      try { ws.on("forward", ackFromForward); } catch {}
      return () => {
        try { ws.off?.("chat:message", ackFromMessage); } catch {}
        try { ws.off?.("forward", ackFromForward); } catch {}
      };
    }
  }, [ws, store, roomId]);

  return <>{children}</>;
};