import { v4 as uuidv4 } from 'uuid';
import type { WsMessageSender } from './types';
import {emitChatNewMessage} from "@/chat";
import {getReceiverIdFromRoom} from "@/utils/chat/chat-socket-utils";

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

export const dispatchPreview = (detail: { roomId: string; content: string; senderId: number; timestamp?: string }) => {
  try {
    const ts = detail.timestamp || new Date().toISOString();
    const detail2 = { ...detail,receiverId: getReceiverIdFromRoom(detail.roomId), timestamp: ts };
    emitChatNewMessage(detail2);
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
  dispatchPreview({ roomId, content: opts.previewText || content, senderId: Number(opts.senderId || 0) });

  await sendMessage({ message, id });
  return id;
};

// Backward/semantic alias to better convey intent in callers
export const sendStructuredMessage = sendStructured;
