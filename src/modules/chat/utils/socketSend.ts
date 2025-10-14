import {dbg} from "@/modules/chat/utils/helpers";
import {SendMessageDeps} from "@/modules/chat/types";

export function wsSend(socket: any, obj: any) {
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

/**
 * Wait for an ack ('chat:ack') that matches the given message id.
 * Uses onAny/onMessage if available; otherwise resolves false after timeout.
 */
export function waitForAck(deps: SendMessageDeps, clientId: string, timeoutMs = 4000): Promise<boolean> {
  return new Promise((resolve) => {
    let settled = false;
    let unsubs: Array<() => void> = [];

    // Phoenix protocol acknowledges messages with `phx_reply` event containing status 'ok' or 'error'
    const transport: any = (deps as any)?.adapter || (deps as any)?.sender;

    const cleanup = () => {
      try { clearTimeout(timer); } catch {}
      for (const off of unsubs) {
        try { typeof off === 'function' && off(); } catch {}
      }
      unsubs = [];
    };

    const timer: any = setTimeout(() => {
      if (!settled) {
        settled = true;
        try {
          dbg('waitForAck timeout', {
            clientId,
            timeoutMs,
            transport: !!transport,
            at: new Date().toISOString(),
          });
        } finally {
          cleanup();
          resolve(false);
        }
      }
    }, timeoutMs);


    try {
      const addMessageListener = (deps as any)?.addMessageListener;
      if (typeof addMessageListener === 'function') {
        const off = addMessageListener((packet: any) => {
          const ev = packet?.event;
          const payload = packet?.payload ?? packet;
          dbg('waitForAck addMessageListener event', { ev, payload });
          if (ev !== 'phx_reply') return;
          const status = payload?.status;
          const id = payload?.response?.id;
          if (String(id) === String(clientId) && status === 'ok') {
            dbg('waitForAck received', { clientId, status });
            if (!settled) { settled = true; cleanup(); resolve(true); }
          }
        });
        if (typeof off === 'function') unsubs.push(off);
      } else {
        dbg('waitForAck no addMessageListener on deps');
      }
    } catch (err) {
      dbg('waitForAck addMessageListener error', err);
    }

    dbg('waitForAck subscription summary', {
      hasAddMessageListener: typeof (deps as any)?.addMessageListener === 'function',
    });

    // Fallback: no event subscription → resolve false after timeout
  });
}