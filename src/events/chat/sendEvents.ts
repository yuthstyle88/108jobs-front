import type {ChatMessage} from "lemmy-js-client";
import {UserService} from "@/services";
import {ensureSharedKeyForRoom, importAesKey} from "@/utils";
import {encrypt} from "@/lib/web-crypto";
import {emitChatNewMessage} from "@/events/chat";
import {dbg, PhoenixEvent} from "@/utils/chat";

// generic payload (ChatMessage, error, หรืออื่นๆ)
export interface PhoenixPacket<T = any> {
    event: PhoenixEvent;
    payload?: T;
}

// ฟังก์ชันกลาง สำหรับสร้าง event (รองรับ meta + ลบ key undefined)
export function createEvent<T>(
    event: PhoenixEvent,
    payload?: T,
): PhoenixPacket<T> & {
    roomId?: string;
    timestamp: string;
} {
    const packet: any = {
        event,
        payload,
        timestamp: new Date().toISOString(),
    };
    Object.keys(packet).forEach((k) => {
        if (packet[k] === undefined) delete packet[k];
    });
    return packet;
}

// ฟังก์ชันย่อย สำหรับสร้าง chat:message event โดยเฉพาะ
export function createMessage(
    content: string,
    senderId: number,
    id?: string,
): ChatMessage {
    if (!content || content.trim().length === 0) {
        throw new Error("Message content is required");
    }

    return {
        id: id ?? crypto.randomUUID(),
        senderId,
        content,
        status: "pending",
        createdAt: new Date().toISOString(),
    };
}

export interface SendMessageDeps {
    isE2EMock: boolean;
    roomId: string;
    peerPublicKeyHex?: string;
    sentSet: Set<string>;
    onAfterSend?: () => void; // ใช้เคลียร์ typing flag ที่ provider
    socket: any;
    // เชื่อม Chat Store แบบ optional: ถ้าไม่ได้ส่งมาก็ยังทำงานผ่าน DOM event เหมือนเดิม
    store?: {
        addPending?: (roomId: string, msg: ChatMessage) => void;
        commitStatus?: (
            roomId: string,
            id: string,
            status: ChatMessage['status'],
            patch?: Partial<ChatMessage>
        ) => void;
    };
}

export interface SendMessagePayload {
    message: string;
    senderId: number;
    id?: string
}

// --- Generic event-deps for socket sends ---
export interface SendEventDeps {
    roomId: string;
    senderId: number;
    socket: any;
}

// Safe JSON send over WebSocket
function wsSend(socket: any, obj: any) {
  if (!socket) return false;
  const event = obj?.event ?? obj?.type ?? 'message';
  const payload = obj?.payload ?? obj;
  try {
    // 1) Phoenix Channel API (channel.push(event, payload))
    if (typeof socket.push === 'function') {
      dbg('send via phoenix.push', { event, payload });
      socket.push(event, payload);
      return true;
    }
    // 2) Adapter with emit(event, payload)
    if (typeof socket.emit === 'function') {
      dbg('send via adapter.emit', { event, payload });
      socket.emit(event, payload);
      return true;
    }
    // 3) Raw WebSocket API
    if (typeof socket.send === 'function') {
      const canCheckReady = typeof (globalThis as any).WebSocket !== 'undefined' && typeof socket.readyState === 'number';
      if (canCheckReady && socket.readyState !== (globalThis as any).WebSocket.OPEN) {
        dbg('raw ws not open', { readyState: socket.readyState });
        return false;
      }
      dbg('send via raw WebSocket', { event });
      socket.send(JSON.stringify({ event, payload }));
      return true;
    }
    dbg('no send method found');
    return false;
  } catch {
    return false;
  }
}

// Wait for server ACK for a specific message id (simplified version)
async function waitForAck(socket: any, id: string, timeoutMs = 8000): Promise<boolean> {
  return new Promise((resolve) => {
    const idToMatch = String(id);
    let done = false;
    let timer: any = setTimeout(() => finish(false), timeoutMs);

    // Track cleanup functions and handlers for various adapters
    const cleanupFns: Array<() => void> = [];
    let anyHandler: ((evt: any, payload: any) => void) | null = null;
    let onMessageUnsub: (() => void) | null = null;
    let addMsgCb: ((packet: any) => void) | null = null;

    // Helper: checks if payload matches our id (by 'id' only for chat:message)
    const matchesId = (obj: any): boolean => {
      console.log('waitForAck/matchesId', { obj, idToMatch });
      if (!obj) return false;
      // Check top-level id
      if (obj.id != null && String(obj.id) === idToMatch) return true;
      // Check payload.id
      if (obj.payload?.id != null && String(obj.payload.id) === idToMatch) return true;
      // Check forward wrapper
      if (obj.event === 'forward' && obj.payload) {
        const inner = obj.payload;
        const innerPayload = inner.payload ?? inner;
        if (inner.event === 'chat:message') {
          if (innerPayload?.id != null && String(innerPayload.id) === idToMatch) return true;
        }
      }
      return false;
    };

    // Clean up listeners and timer
    const finish = (ok: boolean) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      try { cleanupFns.forEach((fn) => { try { fn(); } catch {} }); } catch {}
      // direct removals for cases where we didn't push into cleanupFns
      if (wsListener && typeof socket?.removeEventListener === 'function') {
        try { socket.removeEventListener('message', wsListener); } catch {}
      }
      if (typeof socket?.off === 'function') {
        try { socket.off('chat:message', chanListener as any); } catch {}
        try { socket.off('forward', chanListener as any); } catch {}
      }
      const channel = (socket as any)?.channel;
      if (channel) {
        if (typeof channel.off === 'function') {
          try { channel.off('chat:message', chanListener as any); } catch {}
          try { channel.off('forward', chanListener as any); } catch {}
        }
        if (typeof channel.removeEventListener === 'function') {
          try { channel.removeEventListener('message', wsListener); } catch {}
        }
      }
      // wildcard & generic unsubs
      try { (socket as any)?.offAny?.(anyHandler as any); } catch {}
      try { onMessageUnsub?.(); } catch {}
      try { if (addMsgCb && typeof (socket as any)?.removeMessageListener === 'function') { (socket as any).removeMessageListener(addMsgCb); } } catch {}
      resolve(ok);
    };

    // WebSocket 'message' event handler
    const wsListener = (ev: any) => {
      try {
        clearTimeout(timer);
        timer = setTimeout(() => finish(false), timeoutMs);
        const data = typeof ev?.data === 'string' ? JSON.parse(ev.data) : ev?.data ?? ev;
        try { dbg('waitForAck/ws', { data }); } catch {}
        const inner = data.event === 'forward' ? data.payload : data;
        const innerEvent = inner?.event;
        const innerPayload = inner?.payload ?? inner;
        if (innerEvent === 'chat:message' && matchesId(innerPayload)) {
          return finish(true);
        }
      } catch {}
    };

    // Phoenix channel 'on' handler
    const chanListener = (payload: any, eventName?: string) => {
      try { dbg('waitForAck/chan', { payload, eventName }); } catch {}
      clearTimeout(timer);
      timer = setTimeout(() => finish(false), timeoutMs);
      let evt = eventName;
      let pl = payload;
      if (payload?.event === 'forward' && payload.payload) {
        evt = payload.payload.event;
        pl = payload.payload.payload ?? payload.payload;
      }
      if (evt === 'chat:message' && matchesId(pl)) return finish(true);
    };

    // Attach listeners for WebSocket and Phoenix channel
    const looksLikeWS = typeof socket?.addEventListener === 'function' && typeof socket?.send === 'function';
    if (looksLikeWS) {
      try {
        socket.addEventListener('message', wsListener);
        cleanupFns.push(() => { try { socket.removeEventListener('message', wsListener); } catch {} });
      } catch {}
    }

    if (typeof socket?.on === 'function') {
      try {
        socket.on('chat:message', (p: any) => chanListener(p, 'chat:message'));
        socket.on('forward', (p: any) => chanListener(p, 'forward'));
        cleanupFns.push(() => {
          try { socket.off('chat:message', chanListener as any); } catch {}
          try { socket.off('forward', chanListener as any); } catch {}
        });
      } catch {}
    }

    // Generic adapter hooks
    // 4) socket.onMessage((packet) => ...)  -> returns unsubscribe
    if (typeof (socket as any)?.onMessage === 'function') {
      try {
        onMessageUnsub = (socket as any).onMessage((packet: any) => wsListener(packet));
      } catch {}
    }

    // 5) socket.addMessageListener(cb) / removeMessageListener(cb)
    if (typeof (socket as any)?.addMessageListener === 'function') {
      addMsgCb = (packet: any) => wsListener(packet);
      try { (socket as any).addMessageListener(addMsgCb); } catch {}
      cleanupFns.push(() => {
        try { (socket as any)?.removeMessageListener?.(addMsgCb!); } catch {}
      });
    }

    // 6) socket.onAny((event, payload) => ...) / socket.offAny(handler)
    if (typeof (socket as any)?.onAny === 'function') {
      anyHandler = (evt: any, payload: any) => chanListener(payload, String(evt));
      try { (socket as any).onAny(anyHandler); } catch {}
      cleanupFns.push(() => { try { (socket as any)?.offAny?.(anyHandler!); } catch {} });
    }

    // Nested channel (for socket.channel)
    const channel = socket?.channel;
    if (channel && typeof channel.on === 'function') {
      channel.on('chat:message', (p: any) => chanListener(p, 'chat:message'));
      channel.on('forward', (p: any) => chanListener(p, 'forward'));
    }
    if (channel && typeof channel.addEventListener === 'function') {
      channel.addEventListener('message', wsListener);
    }
    // Timer for fallback
    timer = setTimeout(() => finish(false), timeoutMs);
  });
}

// --- Typing events ---
export function sendTyping(deps: SendEventDeps, typing: boolean) {
    const { socket, senderId } = deps;
    const unified = createEvent("chat:typing", {
        typing,
        senderId,
    });
    wsSend(socket, unified);
}

export const sendTypingStart = (deps: SendEventDeps) => sendTyping(deps, true);
export const sendTypingStop = (deps: SendEventDeps) => sendTyping(deps, false);

// --- Read receipt ---
export function sendReadReceipt(deps: SendEventDeps, lastMessageId: string) {
    const { socket } = deps;
    const packet = createEvent(
        "chat:read",
        { lastReadMessageId: String(lastMessageId || "") },
    );
    wsSend(socket, packet);
}

// --- Room update ---
export function sendRoomUpdateEvent(
    deps: SendEventDeps,
    update: Record<string, any>
) {
    const { socket } = deps;
    const packet = createEvent(
        "room:update",
        { ...update },
    );
    wsSend(socket, packet);
}

/** Centralized send-message flow used by PhoenixSocketProvider */
export async function sendChatMessage(deps: SendMessageDeps, data: SendMessagePayload): Promise<{ id: string; sent: boolean; acked: boolean; } | undefined> {
    const {roomId,  peerPublicKeyHex, socket} = deps;

    try {
        const token = UserService.Instance.auth();

        // Create once (plaintext) and optimistically update UI
        const p = createMessage(
          data.message,
          data.senderId,
          data.id,
        );
        if (p) p.status = "pending";

        try {
            deps.store?.addPending?.(roomId, p);
        } catch {}

        emitChatNewMessage({
            roomId,
            id: p.id,
            senderId: data.senderId,
            content: p.content,
            createdAt: p.createdAt,
            status: p.status,
        });
        const messageId = p.id;

        // 1. Ensure we have a shared key for this room
        if (token && peerPublicKeyHex && !UserService.Instance.authInfo?.sharedKey) {
            try {
                if (peerPublicKeyHex) {
                    await ensureSharedKeyForRoom(roomId, peerPublicKeyHex);
                } else {
                    console.warn(`[crypto] skipped key derivation: no peerPublicKey for room ${roomId}`);
                }
            } catch (ex) {
                if (process.env.NODE_ENV !== 'production') {
                    console.warn(
                        `sendMessage: Could not derive shared key for room, sending plaintext`,
                        ex
                    );
                }
            }
        }
        const sharedKeyHex = UserService.Instance.authInfo?.sharedKey;
        const shouldEncrypt = token && peerPublicKeyHex && sharedKeyHex && data.message && data.message.trim();

        let finalContent = data.message;

        if(shouldEncrypt) {
            try {
                const aesKey = await importAesKey(sharedKeyHex!, "encrypt");
                finalContent = await encrypt(data.message, aesKey);
            } catch (err) {
                if (process.env.NODE_ENV !== 'production') {
                    console.warn(
                        `sendMessage: Encryption failed, falling back to plaintext`,
                        err
                    );
                }
            }
        }

        // If encrypted content differs, mutate the single packet before sending
        if (finalContent !== data.message && p) {
            p.content = finalContent;
            try {
                // sync การแก้ไข content (เช่น ciphertext) ไปยัง store ถ้ามี
                deps.store?.commitStatus?.(roomId, String(p.id), p.status, { content: p.content });
            } catch {}
        }
        const sent = wsSend(socket, createEvent('chat:message', p));
        dbg('chat:message sent?', { roomId, id: p.id, sent });
        try {
            if (sent) deps.sentSet?.add(String(p.id));
            deps.onAfterSend?.();
        } catch {}
        let acked = false;
        if (sent) {
            try { acked = await waitForAck(socket, String(messageId), 4000); } catch {}
        }
        dbg('chat:message ack?', { id: messageId, acked });
        // Notify UI of final status:
        // - If not sent at transport level => failed
        // - If sent but no ACK => keep 'pending' (server broadcast will set to 'sent')
        // - If ACK received => mark 'sent' early
        try {
            const updated = { ...p };
            updated.status = !sent ? "failed" : (acked ? "sent" : "pending");

            // อัปเดตลง store หากมี (commitStatus จะอัปเดตเฉพาะสถานะ/แพตช์)
            try {
                deps.store?.commitStatus?.(roomId, String(updated.id), updated.status, {
                    content: updated.content,
                    createdAt: p.createdAt,
                });
            } catch {}

            // คงพฤติกรรมเดิม: แจ้ง DOM ให้ UI อื่น ๆ รับรู้ด้วย
            emitChatNewMessage({
                roomId,
                id: String(updated.id),
                senderId: data.senderId,
                content: updated.content,
                createdAt: p.createdAt,
                status: updated.status,
            });
        } catch {}
    } catch (ignored) {
    }
    return;
}
