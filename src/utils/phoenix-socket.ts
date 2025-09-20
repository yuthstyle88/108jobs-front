import { Socket as PhoenixSocket } from "phoenix";
import { buildActixWsUrl } from "./chat-socket-utils";

// ---- production hardening constants ----
const JOIN_TIMEOUT_MS = 10000; // fail join after 10s
const ALLOWED_PUSH_EVENTS = ['send_message', 'message', 'new_msg', 'new_message', 'chat:message'] as const;

function safeStringify(obj: any) {
  try { return JSON.stringify(obj); } catch { return String(obj); }
}

// WebSocket-like interface used by RealtimeChatContext
export interface WsLike {
  readyState: number;
  onopen?: () => void;
  onmessage?: (event: { data: any }) => void;
  onclose?: (event: { code?: number; reason?: string }) => void;
  onerror?: (event?: any) => void;
  send: (data: string) => void;
  close: () => void;
}

// Singleton Phoenix Socket per token
class PhoenixSocketManager {
  private static instance: PhoenixSocketManager | null = null;

  static getInstance() {
    if (!this.instance) this.instance = new PhoenixSocketManager();
    return this.instance;
  }

  private socketByToken: Map<string, PhoenixSocket> = new Map();
  private refCountByToken: Map<string, number> = new Map();
  private channelsByKey: Map<string, any> = new Map(); // value is Phoenix Channel (augmented with __wired, __wiredRefs)

  /** Returns a Phoenix Socket for given token; creates if missing */
  getSocket(token: string): PhoenixSocket {
    let sock = this.socketByToken.get(token);
    if (!sock) {
      const url = buildActixWsUrl();
      sock = new PhoenixSocket(url, { params: { token } });
      sock.connect();
      this.socketByToken.set(token, sock);
      this.refCountByToken.set(token, 0);
    }
    // inc global ref count so we can disconnect when zero
    this.refCountByToken.set(token, (this.refCountByToken.get(token) || 0) + 1);
    return sock;
  }

  /** Decrease token socket ref count and disconnect when zero */
  releaseSocket(token: string) {
    const cur = (this.refCountByToken.get(token) || 1) - 1;
    if (cur <= 0) {
      const sock = this.socketByToken.get(token) as any;
      try { sock?.disconnect?.(() => undefined, 1000, "idle"); } catch {}
      this.socketByToken.delete(token);
      this.refCountByToken.delete(token);
      // also cleanup any channels left for this token
      for (const key of Array.from(this.channelsByKey.keys())) {
        if (key.startsWith(token + ":")) this.channelsByKey.delete(key);
      }
    } else {
      this.refCountByToken.set(token, cur);
    }
  }

  /** Get or join a channel for token+roomId */
  getOrJoinChannel(token: string, roomId: string) {
    const key = `${token}:${roomId}`;
    const existing = this.channelsByKey.get(key);
    if (existing) return existing;

    const socket = this.getSocket(token);
    const topic = `room:${roomId}`;
    const channel = socket.channel(topic, {});

    // cleanup cache if channel closes (and drop listeners)
    try {
      (channel as any).onClose?.(() => {
        try {
          const refs: Array<{ ev: string; ref: any }> = (channel as any).__wiredRefs || [];
          for (const { ev, ref } of refs) {
            try { (channel as any).off?.(ev, ref); } catch {}
          }
          (channel as any).__wired = false;
          (channel as any).__wiredRefs = [];
        } catch {}
        this.channelsByKey.delete(key);
      });
    } catch {}

    this.channelsByKey.set(key, channel);
    return channel;
  }

  leaveChannel(token: string, roomId: string) {
    const key = `${token}:${roomId}`;
    const ch = this.channelsByKey.get(key);
    if (ch) {
      try { ch.leave(); } catch {}
      this.channelsByKey.delete(key);
    }
    this.releaseSocket(token);
  }
}

/**
 * Returns a WebSocket-like adapter that uses a singleton Phoenix Socket under the hood
 */
export function getPhoenixChannelSocket(token: string, roomId: string): WsLike {
  const manager = PhoenixSocketManager.getInstance();
  const channel = manager.getOrJoinChannel(token, roomId);

  let readyState = 0; // 0 connecting, 1 open, 2 closing, 3 closed
  const listeners: { [ev: string]: Array<(payload: any) => void> } = {};

  let opened = false;
  let joinTimer: any = null;
  const outbox: any[] = [];

  const adapter: WsLike = {
    get readyState() { return readyState; },
    set readyState(v: number) { readyState = v; },
    onopen: undefined,
    onmessage: undefined,
    onclose: undefined,
    onerror: undefined,
    send(data: string) {
      try {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;
        // minimal validation: expect object with string content
        if (!parsed || typeof parsed !== 'object' || (parsed.content !== undefined && typeof parsed.content !== 'string')) {
          throw new Error('phoenix-adapter: invalid payload');
        }
        const st = (channel as any).state as string | undefined;
        if (readyState !== 1 || (st !== 'joining' && st !== 'joined')) {
          outbox.push(parsed);
          // attempt join if needed
          if (st !== 'joining' && st !== 'joined') {
            try { (channel as any).join(); } catch {}
          }
          return;
        }
        // push only allowed events, fallback to 'message'
        let pushed = false;
        for (const ev of ALLOWED_PUSH_EVENTS) {
          try { (channel as any).push(ev, parsed); pushed = true; break; } catch {}
        }
        if (!pushed) { try { (channel as any).push('message', parsed); } catch {} }
      } catch (e) {
        adapter.onerror?.(e);
      }
    },
    close() {
      readyState = 2;
      manager.leaveChannel(token, roomId);
      readyState = 3;
      adapter.onclose?.({ code: 1000, reason: 'client closed' });
    },
  } as WsLike;

  // Join only if not already joining/joined, with timeout protection
  const chState = (channel as any).state as string | undefined;
  const markOpen = () => {
    if (!opened) {
      opened = true;
      readyState = 1;
      adapter.onopen?.();
      // flush queued messages
      while (outbox.length) {
        const parsed = outbox.shift();
        let pushed = false;
        for (const ev of ALLOWED_PUSH_EVENTS) {
          try { (channel as any).push(ev, parsed); pushed = true; break; } catch {}
        }
        if (!pushed) { try { (channel as any).push('message', parsed); } catch {} }
      }
    }
  };
  const clearJoinTimer = () => { if (joinTimer) { clearTimeout(joinTimer); joinTimer = null; } };

  if (chState !== 'joining' && chState !== 'joined') {
    joinTimer = setTimeout(() => {
      readyState = 3;
      adapter.onclose?.({ code: 4408, reason: 'phoenix join timeout' });
      try { (channel as any).leave?.(); } catch {}
    }, JOIN_TIMEOUT_MS);

    (channel as any).join()
      .receive('ok', () => { clearJoinTimer(); markOpen(); })
      .receive('error', () => {
        clearJoinTimer();
        readyState = 3;
        adapter.onclose?.({ code: 1008, reason: 'phoenix join error' });
      });
  } else if (chState === 'joined') {
    markOpen();
  }

  // Wire channel lifecycle events to adapter
  try {
    (channel as any).onError?.(() => {
      adapter.onerror?.({ code: 1006, reason: 'phoenix channel error' });
    });
    (channel as any).onClose?.(() => {
      // clear any outstanding join timer
      if (joinTimer) { clearTimeout(joinTimer); joinTimer = null; }
      if (readyState !== 3) {
        readyState = 3;
        adapter.onclose?.({ code: 1006, reason: 'phoenix channel closed' });
      }
    });
  } catch {}

  // Wire underlying socket lifecycle as well
  try {
    const sock = (channel as any).socket;
    sock?.onError?.(() => {
      adapter.onerror?.({ code: 1006, reason: 'phoenix socket error' });
    });
    sock?.onClose?.(() => {
      readyState = 3;
      adapter.onclose?.({ code: 1006, reason: 'phoenix socket closed' });
    });
  } catch {}

  const rawTopic = (channel as any).topic ?? `room:${roomId}`;
  const normalizedTopic = typeof rawTopic === 'string' ? rawTopic.replace(/^room:/, '') : roomId;
  if (!(channel as any).__wired) {
    const refs: Array<{ ev: string; ref: any }> = [];
    const forward = (ev: string) => (payload: any) => {
      const envelope = { event: ev, payload, topic: normalizedTopic };
      // Always stash last envelope for easy debugging in DevTools
      try { (globalThis as any).__phoenixRTLast = envelope; } catch {}
      // Prefer app handler if present; otherwise emit a helpful debug
      if (typeof adapter.onmessage === 'function') {
        adapter.onmessage({ data: safeStringify(envelope) });
      } else {
        // Visible breadcrumb so you know UI isn't wired yet
        try { console.debug('[phoenix-adapter] onmessage handler is not set; latest envelope at window.__phoenixRTLast', envelope); } catch {}
      }
    };
    for (const ev of ['new_msg', 'new_message', 'message', 'msg', 'chat:new', 'chat:message', 'broadcast', 'send_message', 'history_page', 'system:welcome']) {
      try {
        const ref = (channel as any).on(ev, forward(ev));
        refs.push({ ev, ref });
      } catch {}
    }
    (channel as any).__wired = true;
    (channel as any).__wiredRefs = refs;
  }

  return adapter;
}
