import { v4 as uuidv4 } from 'uuid';
import type { WsMessageSender } from './types';
import {emitChatNewMessage} from "@/events/chat";

export type Structured = Record<string, any>;

export const parseStructured = (raw: unknown): Structured | null => {
  if (typeof raw !== 'string') return null;
  const s = raw.trim();
  if (!s.startsWith('{')) return null;
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
};

export const serializeStructured = (obj: Structured): string => {
  try {
    return JSON.stringify(obj);
  } catch {
    return '{}';
  }
};

export const dispatchPreview = (detail: { roomId: string; id: string; content: string; createdAt?: string; unread?: boolean }) => {
  try {
    const createdAt = detail.createdAt || new Date().toISOString();
    emitChatNewMessage({
      roomId: detail.roomId,
      id: detail.id,
      content: detail.content,
      createdAt,
      unread: detail.unread ?? false,
    });
  } catch {
    // no-op if window/custom event not available
  }
};

export const sendStructured = async (
  sendMessage: WsMessageSender,
  roomId: string,
  payload: Structured,
  opts: { senderId?: number; previewText?: string; attach?: { url: string; name?: string } | null } = {}
) => {
  const id = uuidv4();
  const content = serializeStructured(payload);
  const message = opts.attach
    ? serializeStructured({ ...payload, fileUrl: opts.attach.url, fileName: opts.attach.name })
    : content;

  // fire preview for optimistic updates in lists
  dispatchPreview({ roomId, id, content: opts.previewText || content, createdAt: new Date().toISOString(), unread: false });

  await sendMessage({ message, id });
  return id;
};

// Backward/semantic alias to better convey intent in callers
export const sendStructuredMessage = sendStructured;
