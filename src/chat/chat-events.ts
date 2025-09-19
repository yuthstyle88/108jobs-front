// Centralized chat event helpers for consistent usage across the app
// This provides typed helpers to emit and subscribe to chat CustomEvents
// keeping window and event-name details in one place.
import {isBrowser} from "@/utils/browser";
export const CHAT_EVENT = {
  NEW_MESSAGE: 'chat:new-message',
  WS_RECONNECTED: 'ws:reconnected',
} as const;

export type ChatNewMessageDetail = {
  roomId: string;
  content?: string;
  senderId?: number;
  timestamp?: string;
  unread?: boolean;
  // allow extra fields without forcing all callers to know the full shape
  [k: string]: any;
};

export type ChatNewMessageHandler = (detail: ChatNewMessageDetail) => void;

export function emitChatNewMessage(detail: ChatNewMessageDetail): void {
  if (!isBrowser()) return;
  try {
    window.dispatchEvent(new CustomEvent(CHAT_EVENT.NEW_MESSAGE, { detail }));
  } catch (e) {
    // swallow errors to keep callers simple
  }
}

export function onChatNewMessage(handler: ChatNewMessageHandler): () => void {
  if (!isBrowser()) return () => {};
  const wrapped = (e: Event) => {
    try {
      const d = (e as CustomEvent).detail as ChatNewMessageDetail;
      if (!d) return;
      handler(d);
    } catch {}
  };
  window.addEventListener(CHAT_EVENT.NEW_MESSAGE as any, wrapped as any);
  return () => window.removeEventListener(CHAT_EVENT.NEW_MESSAGE as any, wrapped as any);
}

export function emitWsReconnected(): void {
  if (!isBrowser()) return;
  try {
    window.dispatchEvent(new Event(CHAT_EVENT.WS_RECONNECTED as any));
  } catch {}
}

export function onWsReconnected(handler: () => void): () => void {
  if (!isBrowser()) return () => {};
  window.addEventListener(CHAT_EVENT.WS_RECONNECTED as any, handler as any);
  return () => window.removeEventListener(CHAT_EVENT.WS_RECONNECTED as any, handler as any);
}
