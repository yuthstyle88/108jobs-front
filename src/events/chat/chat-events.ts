// Centralized chat event helpers for consistent usage across the app
// This provides typed helpers to emit and subscribe to chat CustomEvents
// keeping window and event-name details in one place.
import {isBrowser} from "@/utils/browser";

export type DeliveryStatus = "pending" | "sent" | "failed";

function stripUndef<T extends Record<string, any>>(obj: T): T {
  Object.keys(obj).forEach((k) => {
    if ((obj as any)[k] === undefined) delete (obj as any)[k];
  });
  return obj;
}

export const CHAT_EVENT = Object.freeze({
  NEW_MESSAGE: 'chat:new-message',
  TYPING: 'chat:typing',
  READ_RECEIPT: 'chat:read-receipt',
  WS_RECONNECTED: 'ws:reconnected',
} as const);

export type ChatNewMessageDetail = {
  roomId: string;          // required: UI context
  id: string;              // required: for de-dup & updates
  content: string;         // required: message text (already decrypted for UI)
  createdAt?: string;      // ISO string; defaults to now if omitted
  status?: DeliveryStatus; // pending | sent | failed
  unread?: boolean;        // default false
};

// Normalize detail for consistent UI handling (no socket dependency)
export function normalizeChatNewMessageDetail(detail: ChatNewMessageDetail): ChatNewMessageDetail {
  const now = new Date().toISOString();
  const normalized: ChatNewMessageDetail = stripUndef({
    ...detail,
    createdAt: detail.createdAt ?? now,
    unread: detail.unread ?? false,
  });
  return normalized;
}

export function isChatNewMessageDetail(v: any): v is ChatNewMessageDetail {
  return !!v && typeof v === 'object'
    && typeof v.roomId === 'string'
    && typeof v.id === 'string'
    && typeof v.content === 'string';
}

export type ChatNewMessageHandler = (detail: ChatNewMessageDetail) => void;

// ---- Typing (unified) ----
export type ChatTypingDetail = { roomId: string; senderId: number; typing: boolean };
export function isChatTypingDetail(v: any): v is ChatTypingDetail {
  return !!v && typeof v === 'object' && typeof v.roomId === 'string' && typeof v.typing === 'boolean';
}
export type ChatTypingHandler = (detail: ChatTypingDetail) => void;
export function onChatTyping(handler: ChatTypingHandler): () => void {
  if (!isBrowser()) return () => {};
  const wrapped = (e: Event) => {
    try {
      const d = (e as CustomEvent).detail;
      if (!isChatTypingDetail(d)) return;
      handler(d);
    } catch {}
  };
  window.addEventListener(CHAT_EVENT.TYPING as any, wrapped as any);
  return () => window.removeEventListener(CHAT_EVENT.TYPING as any, wrapped as any);
}

export function emitChatNewMessage(detail: ChatNewMessageDetail): void {
  if (!isBrowser()) return;
  try {
    const normalized = normalizeChatNewMessageDetail(detail);
    window.dispatchEvent(new CustomEvent(CHAT_EVENT.NEW_MESSAGE, { detail: normalized }));
  } catch {
    // swallow errors to keep callers simple
  }
}

// Emit multiple new-message events in order (UI may render progressively)
export function emitChatNewMessages(details: ChatNewMessageDetail[]): void {
  if (!isBrowser()) return;
  for (const d of details) emitChatNewMessage(d);
}

export function onChatNewMessage(handler: ChatNewMessageHandler): () => void {
  if (!isBrowser()) return () => {};
  const wrapped = (e: CustomEvent<ChatNewMessageDetail>) => {
    try {
      const d = e.detail;
      if (!isChatNewMessageDetail(d)) return;
      handler(normalizeChatNewMessageDetail(d));
    } catch {}
  };
  window.addEventListener(CHAT_EVENT.NEW_MESSAGE, wrapped as EventListener);
  return () => window.removeEventListener(CHAT_EVENT.NEW_MESSAGE, wrapped as EventListener);
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

/** Emit a unified typing event */
export function emitChatTyping(detail: { roomId: string; senderId: number; typing: boolean }) {
    try {
        if (isBrowser()) window.dispatchEvent(new CustomEvent(CHAT_EVENT.TYPING, {detail}));
    } catch {
    }
}

/** Emit a unified read-receipt event */
export function emitReadReceipt(roomId: string, lastMessageId: string, readerId: number) {
    try {
        if (isBrowser()) window.dispatchEvent(new CustomEvent(CHAT_EVENT.READ_RECEIPT, {
            detail: {
                roomId,
                lastMessageId,
                readerId
            }
        }));
    } catch {
    }
}

// Utility: an empty unsubscribe for non-browser contexts
export const noopUnsubscribe = () => {};
