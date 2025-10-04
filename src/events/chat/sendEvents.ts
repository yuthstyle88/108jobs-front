import type {ChatMessage} from "lemmy-js-client";
import {UserService} from "@/services";
import {ensureSharedKeyForRoom, importAesKey} from "@/utils";
import {encrypt} from "@/lib/web-crypto";
import {emitChatNewMessage} from "@/events/chat";
import {PhoenixEvent} from "@/utils/chat";

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
      socket.push(event, payload);
      return true;
    }
    // 2) Adapter with emit(event, payload)
    if (typeof socket.emit === 'function') {
      socket.emit(event, payload);
      return true;
    }
    // 3) Raw WebSocket API
    if (typeof socket.send === 'function') {
      const canCheckReady = typeof (globalThis as any).WebSocket !== 'undefined' && typeof socket.readyState === 'number';
      if (canCheckReady && socket.readyState !== (globalThis as any).WebSocket.OPEN) return false;
      socket.send(JSON.stringify({ event, payload }));
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// Wait for server ACK for a specific message id
async function waitForAck(socket: any, id: string, timeoutMs = 8000): Promise<boolean> {
  return new Promise((resolve) => {
    const idToMatch = String(id);
    let done = false;
    let timer: any = null;
    const refreshTimer = () => {
      try { if (timer) clearTimeout(timer); } catch {}
      timer = setTimeout(() => finish(false), timeoutMs);
    };

    const finish = (ok: boolean) => {
      if (done) return;
      done = true;
      try { if (timer) clearTimeout(timer); } catch {}
      timer = null;
      // detach listeners
      try { socket.removeEventListener?.('message', onWsMessage as any); } catch {}
      try {
        if (offFns.length) offFns.forEach((off) => { try { off?.(); } catch {} });
      } catch {}
      try {
        if (originalOnMessageWrapped) {
          socket.onmessage = originalOnMessage; // restore
          originalOnMessageWrapped = false;
        }
      } catch {}
      resolve(ok);
    };

    const matchesId = (obj: any): boolean => {
      try {
        if (!obj) return false;
        const idToMatchStr = idToMatch;
        const get = (o: any, k: string) => {
          try { return o?.[k]; } catch { return undefined; }
        };
        const unwrap = (o: any) => (o?.response ?? o?.payload ?? o?.data ?? o);
        const candidate = unwrap(obj);

        const direct = get(candidate, 'in_reply_to') ?? get(candidate, 'id');
        if (direct != null && String(direct) === idToMatchStr) return true;

        const msgs = get(candidate, 'messages') ?? get(candidate, 'message');
        if (msgs) {
          const arr = Array.isArray(msgs) ? msgs : [msgs];
          for (const m of arr) {
            const mid = get(m, 'in_reply_to') ?? get(m, 'id');
            if (mid != null && String(mid) === idToMatchStr) return true;
          }
        }

        // deep fallback (limited depth)
        const stack: any[] = [candidate];
        let depth = 0;
        while (stack.length && depth < 4) {
          const cur = stack.pop();
          if (!cur || typeof cur !== 'object') continue;
          const mid = get(cur, 'in_reply_to') ?? get(cur, 'id');
          if (mid != null && String(mid) === idToMatchStr) return true;
          for (const v of Object.values(cur)) if (v && typeof v === 'object') stack.push(v);
          depth++;
        }
        return false;
      } catch { return false; }
    };

    const onWsMessage = (ev: any) => {
      try {
        // any inbound activity proves server is live
        refreshTimer();
        const data = typeof ev?.data === 'string' ? JSON.parse(ev.data) : ev?.data ?? ev;
        const eventName = String(data?.event ?? '');
        console.info('[ws-ack] onWsMessage', eventName, data)
        if (!eventName) return;
        if (
          eventName === 'phx_reply' ||
          eventName === 'chat:message'
        ) {
          if (matchesId(data)) return finish(true);
        }
      } catch { /* ignore */ }
    };

    const onChanEvent = (...args: any[]) => {
      try {
        refreshTimer();
        // adapters may call (payload) or (eventName, payload)
        const payload = args.length === 1 ? args[0] : args[1];
        const candidate = (payload?.response ?? payload?.payload ?? payload);
        if (matchesId(candidate)) return finish(true);
      } catch { /* ignore */ }
    };

    // Attach listeners depending on adapter shape
    const offFns: Array<() => void> = [];
    let originalOnMessage: any = null;
    let originalOnMessageWrapped = false;

    // 0) Adapter-style: addMessageListener / removeMessageListener
    if (typeof socket?.addMessageListener === 'function') {
      const onAdapterMessage = (packet: any) => {
        try {
          refreshTimer();
          // common packet shapes: { event, payload, ... } or raw { data }
          const evt = String(packet?.event ?? packet?.data?.event ?? '');
          const candidate = packet?.payload ?? packet?.data ?? packet;
          if (!evt) return;
          if (
            evt === 'phx_reply' ||
            evt === 'chat:message'
          ) {
            if (matchesId(candidate)) return finish(true);
          }
        } catch { /* noop */ }
      };

      try {
        const off = socket.addMessageListener(onAdapterMessage);
        if (typeof off === 'function') {
          offFns.push(() => { try { off(); } catch {} });
        } else if (typeof socket.removeMessageListener === 'function') {
          offFns.push(() => { try { socket.removeMessageListener(onAdapterMessage); } catch {} });
        }
      } catch {}
    }

    // 1) Native WebSocket (stricter detection to avoid adapter lookalikes)
    const looksLikeNativeWS = (
      typeof socket?.send === 'function' &&
      typeof socket?.close === 'function' &&
      typeof socket?.addEventListener === 'function' &&
      ('onopen' in (socket ?? {})) &&
      ('readyState' in (socket ?? {}))
    );
    if (looksLikeNativeWS) {
        try { if (process.env.NODE_ENV !== 'production') console.info('[ws-ack] native WebSocket detected'); } catch {}
        try { socket.addEventListener('message', onWsMessage as any); } catch {}
    }
    // 1.5) If the channel is nested (socket.channel), try there too
    const chan = (socket && socket.channel) ? socket.channel : null;
    if (chan && typeof chan.addEventListener === 'function') {
      try { chan.addEventListener('message', onWsMessage as any); } catch {}
      offFns.push(() => { try { chan.removeEventListener?.('message', onWsMessage as any); } catch {} });
    }
    if (chan && typeof chan.on === 'function') {
      const events = ['phx_reply', 'chat:message'];
      try {
        events.forEach((evt) => {
          try { chan.on(evt, onChanEvent as any); } catch {}
          offFns.push(() => { try { chan.off?.(evt, onChanEvent as any); } catch {} });
        });
      } catch {}
    }

    // 2) Phoenix channel-like adapter (.on/.off)
    if (typeof socket?.on === 'function') {
      const events = ['phx_reply', 'chat:message'];
      try {
        events.forEach((evt) => {
          try { socket.on(evt, onChanEvent as any); } catch {}
          offFns.push(() => { try { socket.off?.(evt, onChanEvent as any); } catch {} });
        });
      } catch {}
      // wildcard hook if adapter supports it
      if (typeof (socket as any).onAny === 'function') {
        try {
          (socket as any).onAny(onChanEvent as any);
          offFns.push(() => { try { (socket as any).offAny?.(onChanEvent as any); } catch {} });
        } catch {}
      }
    }

    // 3) Single-callback adapters (wrap onmessage)
    if (!socket?.addEventListener && !socket?.on && 'onmessage' in (socket ?? {})) {
      try {
        originalOnMessage = socket.onmessage ?? null;
        socket.onmessage = (ev: any) => {
          try { onWsMessage(ev); } catch {}
          try { return originalOnMessage?.call(socket, ev); } catch {}
        };
        originalOnMessageWrapped = true;
      } catch {}
    }

    // 4) Provider-level forward bus (PhoenixSocketService style)
    if (socket && typeof socket.onForward === 'function') {
      try {
        socket.onForward(onChanEvent as any);
        offFns.push(() => { try { socket.offForward?.(onChanEvent as any); } catch {} });
      } catch {}
    }

    // Kick off liveness timer
    refreshTimer();
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
export async function sendChatMessage(deps: SendMessageDeps, data: SendMessagePayload) {
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
        console.info('[send-message] send', p);
        const sent = wsSend(socket, createEvent('chat:message', p));
        try {
            if (sent) deps.sentSet?.add(String(p.id));
            deps.onAfterSend?.();
        } catch {}
        let acked = false;
        if (sent) {
            try { acked = await waitForAck(socket, String(messageId), 4000); } catch {}
        }
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
