"use client";

import {useRouter} from "next/navigation";
import React, {createContext, useCallback, useContext, useEffect, useRef, useState,} from "react";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {encrypt, decrypt, hexToUint8Array} from "@/lib/web-crypto";
import {exchange as exchangeSharedKey} from "@/lib/api/auth";
import {UserService} from "@/services";

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

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  token,
  partnerId,
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connectionError, setConnectionError] = useState(false);
  const router = useRouter();
  const {localUser} = useMyUser();
  // If NEXT_PUBLIC_E2E_MODE === 'mock', we bypass real WS and simulate messages for stable E2E tests
  const isE2EMock = process.env.NEXT_PUBLIC_E2E_MODE === "mock";

  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isManuallyClosingRef = useRef(false);
  const [connectionAttemptKey, setConnectionAttemptKey] = useState(0);

  // Build WS URL dynamically to support local, staging, and prod, and to improve E2E flexibility
  const defaultWsOrigin = typeof window !== "undefined"
    ? `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}`
    : "";
  const wsOrigin = process.env.NEXT_PUBLIC_WS_URL?.replace(/\/$/, "") || defaultWsOrigin;
  const wsUrl = `${wsOrigin}/api/v4/ws/?token=${token}&roomId=${partnerId}&userId=${localUser?.id}`;

  useEffect(() => {
      if (isE2EMock) {
        setIsConnected(true);
        return;
      }
      if (!token || !partnerId || !localUser) return;

      let cancelled = false;
      isManuallyClosingRef.current = false;

      (async () => {
        // Ensure key exchange happens BEFORE opening the WebSocket so the server session
        // has the shared key loaded for this connection.
        try {
          const existingToken = UserService.Instance.auth();
          if (existingToken && !UserService.Instance.authInfo?.sharedKey) {
            try {
              const derived = await exchangeSharedKey(existingToken);
              UserService.Instance.authInfo = {
                ...(UserService.Instance.authInfo || { auth: existingToken }),
                sharedKey: derived,
                claims: UserService.Instance.authInfo?.claims,
              };
            } catch (ex) {
              console.warn("Key exchange failed before WS connect. Proceeding without E2EE.", ex);
            }
          }
        } catch (e) {
          console.warn("Pre-WS key exchange error", e);
        }
        if (cancelled) return;

        const newSocket = new WebSocket(wsUrl);
        setSocket(newSocket);

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

        newSocket.onmessage = async (event) => {
          // Attempt to decrypt incoming messages if E2EE context is available
          try {
            const token = UserService.Instance.auth();
            const sharedKeyHex = UserService.Instance.authInfo?.sharedKey;

            const safeParse = (val: unknown) => {
              try {
                return typeof val === "string" ? JSON.parse(val as string) : val;
              } catch {
                return val;
              }
            };

            let parsed: any = safeParse(event.data);
            if (typeof parsed === "string") parsed = safeParse(parsed);

            const items: any[] = Array.isArray(parsed)
              ? parsed
              : parsed && typeof parsed === "object"
                ? [parsed]
                : [];

            if (token && sharedKeyHex && items.length) {
              try {
                const keyData = hexToUint8Array(sharedKeyHex);
                const aesKey = await crypto.subtle.importKey(
                  "raw",
                  keyData,
                  { name: "AES-CBC", length: 256 },
                  false,
                  ["decrypt"]
                );

                for (const it of items) {
                  if (it && typeof it.content === "string" && it.content) {
                    try {
                      const plain = await decrypt(it.content, token, aesKey);
                      // Heuristic: if decrypted text is printable, use it; otherwise keep as-is
                      if (typeof plain === "string" && plain.length > 0) {
                        it.content = plain;
                      }
                    } catch (_) {
                      // Ignore decryption errors and keep ciphertext
                    }
                  }
                }

                const transformed = Array.isArray(parsed) ? items : items[0];
                const nextEvent = { data: JSON.stringify(transformed) } as MessageEvent;
                for (const fn of listeners.values()) fn(nextEvent);
                return;
              } catch (e) {
                // fall back to original event
                console.warn("Failed to decrypt incoming message(s). Using original payload.", e);
              }
            }
          } catch (e) {
            // ignore and forward original
          }

          // Default: forward original event
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

          if ([1008, 4000, 4400].includes(event.code)) {
            setConnectionError(true);
            return;
          }

          reconnectTimeoutRef.current = setTimeout(() => {
              setSocket(null);
              setConnectionAttemptKey((prev) => prev + 1);
            },
            3000);
        };

        newSocket.onerror = (err) => {
          if (isManuallyClosingRef.current) {
            console.log("🟡 WebSocket error ignored due to manual close.");
            return;
          }
          console.error("🚨 WebSocket encountered error", err);
        };
      })();

      return () => {
        cancelled = true;
        isManuallyClosingRef.current = true;
        try { socket?.close(); } catch {}
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [wsUrl, connectionAttemptKey]);

  useEffect(() => {
      if (connectionError) {
        router.replace("/not-found");
      }
    },
    [connectionError, router]);

  useEffect(() => {
      if (!socket) return;
      console.log("📡 Socket state:",
        socket.readyState);
    },
    [socket]);

  const sendMessage = useCallback(
    async (data: MessagePayload) => {
      if (isE2EMock) {
        const mockMessage = {
          id: String(Date.now()),
          isOwner: true,
          createdAt: new Date().toISOString(),
          content: data.message,
          fileUrl: data.fileUrl || "",
          fileType: data.fileType || "",
          fileName: data.fileName || "",
        };
        const event = { data: JSON.stringify(mockMessage) } as MessageEvent;
        for (const fn of listeners.values()) {
          fn(event);
        }
        return;
      }

      // Optional E2EE: derive shared key lazily and encrypt if possible
      let payload: MessagePayload = { ...data };
      try {
        const token = UserService.Instance.auth();
        // If no sharedKey yet but we have a token, perform exchange
        if (token && !UserService.Instance.authInfo?.sharedKey) {
          try {
            const derived = await exchangeSharedKey(token);
            // store in UserService for subsequent use
            UserService.Instance.authInfo = {
              ...(UserService.Instance.authInfo || { auth: token }),
              sharedKey: derived,
              claims: UserService.Instance.authInfo?.claims,
            };
          } catch (ex) {
            console.warn("Could not derive shared key, will send plaintext.", ex);
          }
        }

        const sharedKeyHex = UserService.Instance.authInfo?.sharedKey;
        const shouldEncrypt = !!(token && sharedKeyHex && data.message && data.message.trim());
        if (shouldEncrypt) {
          const keyData = hexToUint8Array(sharedKeyHex!);
          const aesKey = await crypto.subtle.importKey(
            "raw",
            keyData,
            { name: "AES-CBC", length: 256 },
            false,
            ["encrypt"]
          );
          const encrypted = await encrypt(data.message, aesKey, token!);
          payload = { ...data, message: encrypted };
        }
      } catch (e) {
        console.warn("E2EE encryption failed, sending plaintext.", e);
      }

      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(payload));
      } else {
        console.warn("❗ WebSocket not ready to send");
      }
    },
    [socket, isE2EMock]
  );

  return (
    <WebSocketContext.Provider value={{sendMessage, isConnected, partnerId}}>
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
      listeners.set(key,
        onMessage);
      return () => {
        listeners.delete(key);
      };
    },
    [key, onMessage]);

  return context;
};
