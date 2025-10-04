import {LocalUserId} from "lemmy-js-client";

export type WsMessageSender = (data: MessagePayload) => void | Promise<void>;

export interface MessagePayload {
    message: string;
    senderId: LocalUserId;
    id?: string;
}
/**
 * Canonical typing detail for `chat:typing` events.
 * - roomId: room identifier (same as topic without the `room:` prefix)
 * - senderId: local user id of the typist
 * - typing: true when typing starts, false when stops
 * - createdAt: optional ISO timestamp when the event was generated (server/client)
 */
export interface ChatTypingDetail {
  roomId: string;
  senderId: LocalUserId;
  typing: boolean;
  createdAt?: string;
}
export const TYPING_EVENT_NAMES = ['chat:typing'];

export const EVENTS = [
  'phx_reply',
  'forward',
  'chat:message',
  'chat:typing',
  'chat:read',
  'history_page',
];

export type PhoenixEvent =
  | "phx_join"
  | "phx_leave"
  | "phx_reply"
  | "phx_error"
  | "phx_close"
  | "chat:message"
  | "chat:typing"
  | "chat:read"
  | "room:update"
  | "history_page";