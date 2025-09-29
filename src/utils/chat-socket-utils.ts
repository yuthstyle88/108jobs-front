import  {__DEV__} from "@/utils/appConfig";
import { HttpService, UserService } from "@/services";
import { REQUEST_STATE } from "@/services/HttpService";
import { getHost, isHttps} from "@/utils/env";
import type {ChatMessage} from "lemmy-js-client";
import { decrypt } from "@/lib/web-crypto";
import {importAesKey} from "@/utils";

export function logDebug(...args: unknown[]) {
  if (__DEV__) console.debug(...args);
}
export function safeParse(val: unknown): unknown {
  try {
    const result = typeof val === "string" ? JSON.parse(val as string) : val;
    logDebug(`safeParse: Parsed value`, result);
    return result;
  } catch {
    logDebug(`safeParse: Failed to parse value`, val);
    return val;
  }
}

export function buildActixWsUrl(): string {
    // Always go through Actix first → Phoenix-compatible endpoint
    // Do not append token/room_id in the URL. Phoenix client will send auth via params.
    const proto = isHttps() ? 'wss' : 'ws';
    const host = getHost();
    // Actix will handle `/socket/websocket` (either as WS proxy to Phoenix on :4000 or native Phoenix-compatible handler)
    return `${proto}://${host}/socket`;
}

export function isBase64Like(s: string): boolean {
  return /^[A-Za-z0-9+/=]+$/.test(s);
}

export function getReceiverIdFromRoom(roomId: string): number {
  const receiverId = roomId.includes(":") ? Number(roomId.split(":")[1]) || 0 : 0;
  logDebug(`getReceiverIdFromRoom: Extracted receiverId ${receiverId} from roomId ${roomId}`);
  return receiverId;
}

export function addOnce(set: Set<string>, key: string): boolean {
  if (set.has(key)) {
    logDebug(`addOnce: Key ${key} already exists in set`);
    return false;
  }
  set.add(key);
  logDebug(`addOnce: Added key ${key} to set`);
  return true;
}

export function unwrapPhoenixFrame(data: any): any {
    try {
        // If already an envelope-like object: { event, payload, topic }
        if (data && typeof data === 'object' && ('event' in data || 'payload' in data || 'topic' in data)) {
            const env: any = data;
            const payload = env.payload ?? env;
            if (payload && typeof payload === 'object') {
                // Preserve topic/event for downstream mapping (e.g., infer room from topic)
                return { ...payload, topic: payload.topic ?? env.topic, event: payload.event ?? env.event };
            }
            return payload;
        }

        // Accept either raw string, or MessageEvent-like { data: string }
        const raw = typeof data === 'string' ? data : (typeof data?.data === 'string' ? data.data : null);
        if (!raw) return data;

        // Phoenix array frame: [join_ref, msg_ref, topic, event, payload]
        if (raw.startsWith('[')) {
            const arr = JSON.parse(raw);
            if (Array.isArray(arr) && arr.length >= 5) {
                const payload = arr[4];
                if (arr[3] === 'phx_reply' && payload && typeof payload === 'object' && 'response' in payload) {
                    return (payload as any).response;
                }
                return payload;
            }
        }

        // JSON envelope case: { event, payload, topic }
        const obj = JSON.parse(raw);
        if (obj && typeof obj === 'object' && ('event' in obj || 'payload' in obj || 'topic' in obj)) {
            const env: any = obj;
            const payload = env.payload ?? env;
            if (payload && typeof payload === 'object') {
                return { ...payload, topic: payload.topic ?? env.topic, event: payload.event ?? env.event };
            }
            return payload;
        }
        return obj;
    } catch {
        return data;
    }
}

// ---- Lightweight runtime validators for chat payloads ----
export function isValidOutgoingChatPayload(p: any): boolean {
  return !!(
    p && typeof p === 'object' &&
    (p.op === 'SendMessage' || typeof p.op === 'undefined') &&
    typeof p.sender_id === 'number' && p.sender_id >= 0 &&
    typeof p.room_id === 'string' && p.room_id.length > 0 &&
    typeof p.content === 'string' && p.content.length > 0 &&
    typeof p.id === 'string' && p.id.length > 0 &&
    typeof p.createdAt === 'string'
  );
}

export function isValidIncomingChatPayload(p: any): boolean {
  if (!p) return false;
  // Allow arrays of messages
  if (Array.isArray(p)) {
    return p.some((it) => isValidIncomingChatPayload(it));
  }
  if (typeof p !== 'object') return false;
  // View style { message: { content, room_id? }, room?: { id } }
  if ((p as any).message && typeof (p as any).message === 'object') {
    const m = (p as any).message;
    const hasContent = typeof m.content === 'string' && m.content.length > 0;
    const hasRoom = typeof m.room_id === 'string' || typeof m.room_id === 'number' || typeof (p as any)?.room?.id === 'string' || typeof (p as any)?.room?.id === 'number';
    return hasContent && !!(hasRoom);
  }
  // Flat style
  const hasRoom = typeof (p as any).room_id === 'string' || typeof (p as any).room_id === 'number' || typeof (p as any).roomId === 'string' || typeof (p as any).roomId === 'number';
  const hasContent = typeof (p as any).content === 'string' && (p as any).content.length > 0;
  return hasRoom && hasContent;
}

// === Helpers extracted from RealtimeChatContext / shared across contexts ===
/**
 * Install exactly ONE message listener depending on adapter capability and return a cleanup function.
 * Supports Phoenix EventEmitter-style `.on("message")`, DOM `addEventListener`, or `onmessage` property.
 */
export function installBestMessageListener(sock: any, handler: (evt: any) => void): () => void {
  // Prefer EventEmitter-style `.on("message")` for Phoenix adapters
  if (sock && typeof sock.on === 'function') {
    try {
      const wrapped = (payload: any) => handler({ data: JSON.stringify(payload) });
      sock.on('message', wrapped);
      return () => { try { sock.off?.('message', wrapped); } catch {} };
    } catch {}
  }
  // Next, try DOM-style addEventListener
  if (sock && typeof sock.addEventListener === 'function') {
    try {
      sock.addEventListener('message', handler);
      return () => { try { sock.removeEventListener?.('message', handler); } catch {} };
    } catch {}
  }
  // Fallback: property assignment
  if (sock) {
    try {
      (sock as any).onmessage = handler as any;
      return () => { try { if ((sock as any).onmessage === handler) (sock as any).onmessage = null; } catch {} };
    } catch {}
  }
  // Last resort: no-op cleanup
  return () => {};
}

/**
 * Map various incoming shapes to a ChatMessage, with optional decryption.
 * Uses `addOnce` to de-duplicate by a stable signature (id or composite key).
 */
export async function mapIncomingToChatMessage(
  m: any,
  opts: {
    token?: string | null;
    sharedKeyHex?: string;
    fallbackRoomId: string;
    localUserId: number;
    receivedSet: Set<string>;
    decryptLabel?: string;
  }
): Promise<ChatMessage | null> {
  try {
    // Skip empty content frames
    try { if (m?.content === "{}") return null; } catch {}

    const createdAtVal = m.created_at || m.createdAt || new Date().toISOString();
    const roomIdForKey = m.room_id || m.roomId || opts.fallbackRoomId || '';
    const senderIdForKey = String(m.sender_id ?? m.senderId ?? '');

    // Stable signature to dedupe messages
    const messageSignature = m.id
      ? `id:${m.id}`
      : `room:${roomIdForKey}|sender:${senderIdForKey}|ts:${createdAtVal}|content:${m.content}`;

    if (!addOnce(opts.receivedSet, messageSignature)) {
      return null; // duplicate
    }

    // Optional decrypt (only when looks like base64 and we have key+token)
    let content = m.content;
    if (opts.token && opts.sharedKeyHex && typeof m.content === 'string' && isBase64Like(m.content)) {
      try {
        const aesKey = await importAesKey(opts.sharedKeyHex, 'decrypt');
        const plain = await decrypt(m.content, opts.token, aesKey);
        if (plain && plain.length > 0) content = plain;
      } catch {}
    }

    const roomIdMapped = m.room_id || m.roomId || opts.fallbackRoomId;
    const senderIdMapped = Number(m.sender_id ?? m.senderId) || 0;
    const receiverIdMapped = Number(m.receiver_id ?? m.receiverId) || getReceiverIdFromRoom(roomIdMapped);
    const createdAtMapped = m.created_at || m.createdAt || createdAtVal;

    return {
      id: m.id || uuidv4(),
      senderId: senderIdMapped,
      roomId: roomIdMapped,
      content,
      status: typeof m.status === 'number' ? m.status : 1,
      createdAt: createdAtMapped,
      isOwner: senderIdMapped === opts.localUserId,
    } as ChatMessage;
  } catch {
    return null;
  }
}

// ===== Room listeners (shared across contexts) =====
export type RoomListener = { roomId: string; fn: (event: MessageEvent) => void };
const __roomListeners = new Map<string, RoomListener>();

/** Register a listener for a specific room id under a unique key. */
export function addRoomListener(key: string, roomId: string, fn: (event: MessageEvent) => void) {
  __roomListeners.set(key, { roomId: String(roomId), fn });
}

/** Remove a previously registered listener by key. */
export function removeRoomListener(key: string) {
  __roomListeners.delete(key);
}

function __pickRoomId(payload: any): string | null {
  if (!payload) return null;
  const norm = (v: any) => {
    if (!v) return null;
    let s = String(v);
    if (s.startsWith('room:')) s = s.slice(5);
    return s || null;
  };
  try {
    if (Array.isArray(payload) && payload.length > 0) {
      const h = payload[0];
      return norm(h?.roomId ?? h?.room_id ?? h?.topic);
    }
    return norm(payload?.roomId ?? payload?.room_id ?? payload?.topic);
  } catch { return null; }
}

/** Broadcast payload to listeners of its room (or to all if the room cannot be determined). */
export function broadcastToListeners(payload: unknown): void {
  const event = { data: JSON.stringify(payload) } as MessageEvent;
  try { (globalThis as any).__rtLast = payload; } catch {}

  let pid: string | null = null;
  try {
    const parsed = typeof payload === 'string' ? JSON.parse(payload as any) : payload;
    pid = __pickRoomId(parsed);
  } catch { pid = null; }

  if (pid) {
    for (const { roomId, fn } of __roomListeners.values()) {
      if (String(roomId) === String(pid)) fn(event);
    }
    return;
  }
  // Fallback: broadcast to all
  for (const { fn } of __roomListeners.values()) fn(event);
}

// ===== Payload handler (shared) =====
import {MutableRefObject, useCallback} from 'react';
import {uuidv4} from "zod/v4";

export async function handleIncomingPayload(
  payload: any,
  ctx: {
    roomId: string;
    localUserId: number;
    token: string | null | undefined;
    sharedKeyHex?: string;
    receivedSet: Set<string>;
    setPageCursor: (cursor: string | null) => void;
    setHasMoreMessages: (v: boolean) => void;
    setIsFetching: (v: boolean) => void;
    fetchTimeoutRef: MutableRefObject<NodeJS.Timeout | null>;
    fetchResolveRef: MutableRefObject<((value?: void) => void) | null>;
  }
): Promise<import("lemmy-js-client").ChatMessage[] | null> {
  try { logDebug('[RT] handleIncomingPayload →', payload); } catch {}
  // Ignore trivial frames
  if (
    payload == null ||
    payload === 'pong' ||
    payload === 'ping' ||
    (payload?.op === 'Ping') ||
    (payload?.event === 'phx_leave') ||
    (typeof payload === 'object' && !Array.isArray(payload) && Object.keys(payload).length === 0)
  ) {
    return null;
  }

  // Normalize Phoenix shapes to a flat message-like object
  try {
    if (Array.isArray(payload) && payload.length >= 5 && typeof payload[3] === 'string' && payload[4] && typeof payload[4] === 'object') {
      const [, , topic, ev, body] = payload as [any, any, string, string, any];
      payload = { event: ev, topic: topic.replace(/^room:/, ''), ...body };
    } else if (payload && typeof payload === 'object' && 'event' in payload && 'payload' in payload && typeof (payload as any).payload === 'object') {
      const env = payload as any;
      const topic = typeof env.topic === 'string' ? env.topic.replace(/^room:/, '') : env.topic;
      payload = { event: env.event, topic, ...(env.payload || {}) };
    }
  } catch {}

  const out: import("lemmy-js-client").ChatMessage[] = [];

  // ChatMessageView line: { message: {...}, room?: { id } }
  if (payload && typeof payload === 'object' && (payload as any).message) {
    const msgView = payload as any;
    const m = { ...msgView.message, room_id: msgView.room?.id || msgView.message?.room_id };
    const mapped = await mapIncomingToChatMessage(m, {
      token: ctx.token,
      sharedKeyHex: ctx.sharedKeyHex,
      fallbackRoomId: ctx.roomId,
      localUserId: ctx.localUserId,
      receivedSet: ctx.receivedSet,
      decryptLabel: 'message view',
    });
    if (mapped) out.push(mapped);
    return out;
  }

  // Flat ChatMessage line (and also detect inline typing JSON)
  if (payload && typeof payload === 'object' && Object.prototype.hasOwnProperty.call(payload, 'content')) {
    const m = (() => {
      const p: any = payload;
      const topic = typeof p.topic === 'string' ? p.topic.replace(/^room:/, '') : undefined;
      return { ...p, room_id: p.room_id ?? p.roomId ?? topic };
    })();

    // Typing embedded in content
    try {
      if (typeof m.content === 'string' && m.content.trim().startsWith('{')) {
        const parsed = safeParse(m.content);
        if (parsed && typeof parsed === 'object' && ('typing' in parsed)) {
          const senderIdNum = Number(m.sender_id ?? m.senderId ?? 0);
          const info = {
            type: 'typing',
            roomId: String(m.room_id || m.roomId || m.topic || ctx.roomId),
            senderId: senderIdNum,
            typing: Boolean((parsed as any).typing),
          } as any;
          if (senderIdNum !== Number(ctx.localUserId)) {
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('chat:typing', { detail: info }));
            }
          }
          return [];
        }
      }
    } catch {}

    const mapped = await mapIncomingToChatMessage(m, {
      token: ctx.token,
      sharedKeyHex: ctx.sharedKeyHex,
      fallbackRoomId: ctx.roomId,
      localUserId: ctx.localUserId,
      receivedSet: ctx.receivedSet,
      decryptLabel: 'flat message',
    });
    if (mapped) out.push(mapped);
    return out;
  }

  // Pagination payloads (prev/next page)
  if (payload && typeof payload === 'object' && ((payload as any).prevPage || (payload as any).prev_page || (payload as any).nextPage || (payload as any).next_page)) {
    const prev = (payload as any).prev_page ?? (payload as any).prevPage ?? null;
    const next = (payload as any).next_page ?? (payload as any).nextPage ?? null;
    if (typeof prev === 'string' && prev.length > 0) {
      ctx.setPageCursor(next);
      ctx.setHasMoreMessages(true);
    } else {
      ctx.setPageCursor(null);
      ctx.setHasMoreMessages(false);
    }
    if (ctx.fetchTimeoutRef.current) {
      clearTimeout(ctx.fetchTimeoutRef.current);
      ctx.fetchTimeoutRef.current = null;
    }
    ctx.setIsFetching(false);
    if (ctx.fetchResolveRef.current) {
      ctx.fetchResolveRef.current();
      ctx.fetchResolveRef.current = null;
    }
    return [];
  }

  try { logDebug('onmessage: dropped unknown payload shape', payload); } catch {}
  return null;
}

/**
 * Fetch one page of chat history via HTTP and map each item to ChatMessage.
 * The caller can decide how to broadcast the mapped messages.
 */
export async function fetchHistoryPage(
  params: { roomId: string; cursor: string | null; limit: number },
  deps: {
    localUserId: number;
    receivedSet: Set<string>;
    broadcast?: (m: import("lemmy-js-client").ChatMessage) => void;
  }
) {
  const res = await HttpService.client.getChatHistory({
    roomId: params.roomId,
    cursor: params.cursor ?? undefined,
    limit: params.limit,
    back: true,
  } as any);
  if (res.state !== REQUEST_STATE.SUCCESS) return { prev: null, next: null } as any;

  const resp = res.data as any;
  const items = Array.isArray(resp?.results) ? resp.results : [];

  const realToken = UserService.Instance.auth();
  const realShared = UserService.Instance.authInfo?.sharedKey;

  for (const view of items) {
    const m = { ...view.message, room_id: view.room?.id || view.message?.room_id };
    const mapped = await mapIncomingToChatMessage(m, {
      token: realToken,
      sharedKeyHex: realShared,
      fallbackRoomId: params.roomId,
      localUserId: deps.localUserId,
      receivedSet: deps.receivedSet,
      decryptLabel: 'history line',
    });
    if (mapped && deps.broadcast) deps.broadcast(mapped);
  }

  return {
    prev: resp.prevPage ?? resp.prev_page ?? null,
    next: resp.nextPage ?? resp.next_page ?? null,
  } as any;
}

// Type guard: ensure we only treat real chat messages (not typing frames) as messages
export function isChatMessageLike(m: any): m is { id: string; roomId: string; senderId: number; content: string; createdAt: string } {
    return !!(
        m && typeof m === 'object' &&
        typeof m.id === 'string' &&
        (typeof m.roomId === 'string' || typeof m.room_id === 'string') &&
        (typeof m.senderId === 'number' || typeof m.sender_id === 'number') &&
        typeof m.content === 'string' && m.content.trim() !== '' &&
        typeof (m.createdAt ?? m.created_at) === 'string'
    );
}

/**
 * Emit-based read acker for sockets that expose `.emit(event, payload)` instead of Phoenix Channel `.push(...)`.
 * - Debounced (50ms) to avoid flooding
 * - Monotonic for numeric ids, de-dupe for string/UUID ids
 */
/**
 * Emit-based read acker for sockets that expose `.emit(event, payload)`.
 * เปิดดีบักด้วย: localStorage.setItem('debug_read_ack','1')
 */
export function makeEmitReadAcker(
    emit: (event: string, payload: any) => void,
    roomId: string,
    initialPointer: number | string = 0
) {
    const DBG =
        typeof window !== 'undefined' &&
        typeof window.localStorage !== 'undefined' &&
        window.localStorage.getItem('debug_read_ack') === '1';

    let maxPointerNum = Number.isFinite(Number(initialPointer)) ? Number(initialPointer) : -Infinity;
    let lastIdStr: string | null = typeof initialPointer === 'string' ? String(initialPointer) : null;

    let scheduled = false;
    let pendingIdStr: string | null = null;

    if (DBG) {
        try {
            console.log('[read-ack][emit] init', { roomId, initialPointer, maxPointerNum, lastIdStr });
        } catch {}
    }

    const schedulePush = () => {
        if (scheduled || !pendingIdStr) return;
        scheduled = true;
        if (DBG) {
            try { console.log('[read-ack][emit] schedule', { roomId, pendingIdStr }); } catch {}
        }
        setTimeout(() => {
            scheduled = false;
            if (!pendingIdStr) return;
            const payload = {
                room_id: roomId,
                last_read_message_id: pendingIdStr,
            };
            if (DBG) {
                try { console.log('[read-ack][emit] push', payload); } catch {}
            }
            try {
                emit('chat:read', payload);
            } catch (e) {
                try { console.warn('[read-ack][emit] push failed', e); } catch {}
            } finally {
                pendingIdStr = null;
            }
        }, 50);
    };

    return function ack(messageId: number | string | null | undefined) {
        if (messageId == null) {
            if (DBG) { try { console.log('[read-ack][emit] skip:null'); } catch {} }
            return;
        }

        const idStr = String(messageId);
        const idNum = Number(messageId);

        if (Number.isFinite(idNum)) {
            if (idNum <= maxPointerNum) {
                if (DBG) { try { console.log('[read-ack][emit] skip:not-advancing', { roomId, idNum, maxPointerNum }); } catch {} }
                return;
            }
            maxPointerNum = idNum;
            lastIdStr = idStr;
            if (DBG) { try { console.log('[read-ack][emit] accept:numeric', { roomId, idNum, maxPointerNum }); } catch {} }
        } else {
            if (lastIdStr === idStr) {
                if (DBG) { try { console.log('[read-ack][emit] skip:dup-uuid', { roomId, idStr }); } catch {} }
                return;
            }
            lastIdStr = idStr;
            if (DBG) { try { console.log('[read-ack][emit] accept:uuid', { roomId, idStr }); } catch {} }
        }

        pendingIdStr = idStr;
        schedulePush();
    };
}
