/**
 * Phoenix socket/channel adapter — PRODUCTION-READY
 * - Stable WS-like surface (onopen/onmessage/onclose/onerror, send, close)
 * - Robust wiring via channel.onMessage wildcard + explicit events
 * - Dual-topic compatibility ("room:<id>" and "<id>")
 * - Minimal logging in production (logs only in development)
 * - Proper cleanup to avoid leaks
 */
import { Socket as PhoenixSocket } from "phoenix";
import { buildActixWsUrl } from "@/utils/chat-socket-utils";

export interface RealtimeChannelAdapter {
  readyState: number; // 0 connecting, 1 open, 2 closing, 3 closed
  onopen?: () => void;
  onmessage?: (event: { data: any }) => void;
  onclose?: (event: { code?: number; reason?: string }) => void;
  onerror?: (event?: any) => void;
  send: (data: string) => void;
  /** Emit a custom event with payload on the channel (e.g., typing). */
  emit?: (event: string, payload: any) => void;
  close: () => void;
}

const DEV = typeof process !== "undefined" && process.env.NODE_ENV !== "production";
const isInternalEvent = (ev?: string) => !!ev && ev.startsWith("phx_");

class PhoenixChannelHub {
  private static instance: PhoenixChannelHub | null = null;
  static getInstance() { return this.instance ?? (this.instance = new PhoenixChannelHub()); }

  private socketByToken = new Map<string, PhoenixSocket>();
  private channelsByKey = new Map<string, any>();

  getSocket(token: string): PhoenixSocket {
    let sock = this.socketByToken.get(token);
    if (!sock) {
      const url = buildActixWsUrl();
      sock = new PhoenixSocket(url, { params: { token } } as any);
      sock.connect();
      this.socketByToken.set(token, sock);
    }
    return sock;
  }

  getOrCreateChannel(token: string, topic: string) {
    const key = `${token}:${topic}`;
    const existing = this.channelsByKey.get(key);
    if (existing) return existing;
    const socket = this.getSocket(token);
    const ch = socket.channel(topic, { token });
    this.channelsByKey.set(key, ch);
    return ch;
  }

  leaveChannel(token: string, topic: string) {
    const key = `${token}:${topic}`;
    const ch = this.channelsByKey.get(key);
    if (ch) {
      try { ch.leave(); } catch {}
      this.channelsByKey.delete(key);
    }
  }
}

export function getChannelAdapter(token: string, roomId: string): RealtimeChannelAdapter {
  const hub = PhoenixChannelHub.getInstance();
  const primaryTopic = `room:${roomId}`;
  const aliasTopic = `${roomId}`; // compatibility for backends that emit without prefix

  // Create channels (primary + alias) and join both. If alias is unused, it will be idle.
  let channel = hub.getOrCreateChannel(token, primaryTopic);
  let aliasChannel = hub.getOrCreateChannel(token, aliasTopic);

  let readyState = 0;
  const adapter: RealtimeChannelAdapter = {
    get readyState() { return readyState; },
    set readyState(v: number) { readyState = v; },
    onopen: undefined,
    onmessage: undefined,
    onclose: undefined,
    onerror: undefined,
    send(data: string) {
      // Accept either raw string JSON or object-like string
      try {
        const payload = typeof data === "string" ? JSON.parse(data) : (data as any);
        (channel as any).push("send_message", payload);
      } catch {
        (channel as any).push("send_message", { room_id: roomId, content: String(data) });
      }
    },
    emit(event: string, payload: any) {
      try {
        (channel as any).push(event, payload);
      } catch (e) {
        if (DEV) console.warn("[phoenix] emit failed", { event, e });
      }
    },
    close() {
      if (readyState === 3) return;
      readyState = 2;
      clearRetry();
      try { (channel as any).leave?.(); } catch {}
      try { (aliasChannel as any).leave?.(); } catch {}
      hub.leaveChannel(token, primaryTopic);
      hub.leaveChannel(token, aliasTopic);
      // remove network listeners
      cleanups.forEach(fn => { try { fn(); } catch {} });
      readyState = 3;
      adapter.onclose?.({ code: 1000, reason: 'client closed' });
    },
  } as RealtimeChannelAdapter;

  // Unify forward → adapter.onmessage with normalized envelope
  const forward = (event: string, topic: string, payload: any) => {
    if (!event || isInternalEvent(event)) return;
    const env = { event, topic: topic.replace(/^room:/, ""), payload };
    try { adapter.onmessage?.({ data: JSON.stringify(env) }); } catch {}
  };

  // Wire a channel with wildcard forwarding and explicit events
  function wireChannel(ch: any, topicLabel: string) {
    // wildcard forward
    try {
      const orig = ch.onMessage?.bind(ch);
      ch.onMessage = (event: string, payload: any, ref: any) => {
        forward(event, topicLabel, payload);
        return orig ? orig(event, payload, ref) : payload;
      };
    } catch {}
    // explicit events we care about
    try { ch.on('system:welcome', (p: any) => forward('system:welcome', topicLabel, p)); } catch {}
    try { ch.on('chat:message', (p: any) => forward('chat:message', topicLabel, p)); } catch {}
    try { ch.on('chat:read', (p: any) => forward('chat:read', topicLabel, p)); } catch {}
    try { ch.on('chat:read-receipt', (p: any) => forward('chat:read-receipt', topicLabel, p)); } catch {}
  }

  function recreateChannels() {
    try { (channel as any).leave?.(); } catch {}
    try { (aliasChannel as any).leave?.(); } catch {}
    hub.leaveChannel(token, primaryTopic);
    hub.leaveChannel(token, aliasTopic);

    channel = hub.getOrCreateChannel(token, primaryTopic);
    aliasChannel = hub.getOrCreateChannel(token, aliasTopic);

    wireChannel(channel, primaryTopic);
    wireChannel(aliasChannel, aliasTopic);

    joinChannel(channel, primaryTopic);
    joinChannel(aliasChannel, aliasTopic);
  }

  // --- background resiliency helpers ---
  const cleanups: Array<() => void> = [];
  let retryAttempt = 0;
  let retryTimer: any = null;
  let rejoinInFlight = false;
  const clearRetry = () => { if (retryTimer) { try { clearTimeout(retryTimer); } catch {} retryTimer = null; } };
  const scheduleRetry = (reason: string) => {
    clearRetry();
    const delay = Math.min(8000, 500 * Math.pow(2, Math.max(0, retryAttempt)));
    if (DEV) console.log('[phoenix] schedule rejoin', { reason, attempt: retryAttempt, delay });
    retryTimer = setTimeout(() => {
      if (rejoinInFlight) return;
      rejoinInFlight = true;
      retryAttempt++;
      try { recreateChannels(); } finally { rejoinInFlight = false; }
    }, delay);
  };

  // Join helpers
  function joinChannel(ch: any, topicLabel: string) {
    try {
      ch.join()
        .receive("ok", () => {
          // joined (for either primary or alias)
          retryAttempt = 0; // reset backoff on any success
          clearRetry();
          if (readyState === 0) { readyState = 1; adapter.onopen?.(); }
        })
        .receive("error", (e: any) => {
          if (DEV) console.log("[phoenix] join error", { topic: topicLabel, e });
          // keep adapter open and schedule rejoin in background
          scheduleRetry("join error:" + topicLabel);
          adapter.onerror?.(e);
        });
    } catch (e) {
      if (DEV) console.log("[phoenix] join exception", { topic: topicLabel, e });
      scheduleRetry("join exception:" + topicLabel);
      adapter.onerror?.(e);
    }
  }

  joinChannel(channel, primaryTopic);
  joinChannel(aliasChannel, aliasTopic);

  // Network-awareness: re-join when back online; pause backoff while offline
  try {
    const onOnline = () => {
      if (DEV) console.log('[phoenix] online → rejoin');
      retryAttempt = 0;
      clearRetry();
      try { recreateChannels(); } catch {}
    };
    const onOffline = () => {
      if (DEV) console.log('[phoenix] offline');
      clearRetry();
    };
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    cleanups.push(() => { try { window.removeEventListener('online', onOnline); } catch {} });
    cleanups.push(() => { try { window.removeEventListener('offline', onOffline); } catch {} });
  } catch {}

  wireChannel(channel, primaryTopic);
  wireChannel(aliasChannel, aliasTopic);

  // Lifecycle propagation (errors/close)
  try { (channel as any).onError?.((e: any) => { if (DEV) console.log('[phoenix] channel error', e); adapter.onerror?.(e); scheduleRetry('channel error'); }); } catch {}
  try { (channel as any).onClose?.(() => { if (DEV) console.log('[phoenix] channel closed'); scheduleRetry('channel closed'); }); } catch {}
  try { ((channel as any).socket as any)?.onError?.((e: any) => { if (DEV) console.log('[phoenix] socket error', e); adapter.onerror?.(e); scheduleRetry('socket error'); }); } catch {}
  try { ((channel as any).socket as any)?.onClose?.(() => { if (DEV) console.log('[phoenix] socket closed'); scheduleRetry('socket closed'); }); } catch {}

  return adapter;
}
