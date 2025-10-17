/**
 * Phoenix socket/channel adapter — PRODUCTION-READY
 * - Stable WS-like surface (onopen/onmessage/onclose/onerror, send, close)
 * - Robust wiring via channel.onMessage wildcard only (no explicit per-event handlers)
 * - Channel-scoped retry only (no page/network/global listeners to avoid duplication with upper layers)
 * - Minimal logging in production (logs only in development)
 * - Proper cleanup to avoid leaks
 */
import {Socket as PhoenixSocket} from "phoenix";
import {buildActixWsUrl} from "@/modules/chat/utils/chatSocketUtils";

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
const isInternalEvent = (ev?: string): boolean => !!ev && (
  ev.startsWith("chan_reply") ||   // Phoenix push replies
  ev === "heartbeat" ||
  ev === "presence_state" ||
  ev === "presence_diff"
);

class PhoenixChannelHub {
  private static instance: PhoenixChannelHub | null = null;
  static getInstance() {
    if (!this.instance) {
      this.instance = new PhoenixChannelHub();
    }
    return this.instance;
  }

  private socketByKey = new Map<string, PhoenixSocket>();
  private channelsByKey = new Map<string, any>();

  getSocket(token: string, roomId?: string, senderId?: number): PhoenixSocket {
    const key = "__single__"; // unify socket cache key; do not vary by token
    let sock = this.socketByKey.get(key);
    if (!sock) {
      const url = buildActixWsUrl();
      // Pass token only if present; otherwise use no params
      const opts = token ? ({ params: { token } } as any) : (undefined as any);
      sock = new PhoenixSocket(url, opts);

      // Custom heartbeat: trigger only after successful room join, and include both senderId and roomId.
      if (senderId != null) {
        const originalSendHeartbeat = (sock as any).sendHeartbeat;
        (sock as any).sendHeartbeat = function() {
          // ensure the socket and joined room are ready before sending heartbeat
          if (!(this as any).isConnected() || !roomId) return;
          const joined = (this as any).channels?.find((ch: any) => ch.topic === `room:${roomId}`);
          if (!joined || joined.state !== 'joined') return;

          (this as any).pendingHeartbeatRef = (this as any).makeRef();
          (this as any).push({
            topic: `room:${roomId}`,
            event: 'heartbeat',
            payload: { senderId, roomId },
            ref: (this as any).pendingHeartbeatRef,
          });

          (this as any).heartbeatTimeoutTimer = setTimeout(() => {
            (this as any).heartbeatTimeout();
          }, (this as any).heartbeatIntervalMs);
        };
      }

      sock.connect();
      this.socketByKey.set(key, sock);
    }
    return sock;
  }

  getOrCreateChannel(token: string, topic: string, roomId?: string, senderId?: number) {
    const key = `${topic}`; // unify channel cache key by topic only
    const existing = this.channelsByKey.get(key);
    if (existing) return existing;

    const socket = this.getSocket(token, roomId, senderId);
    const params: any = { topic };
    if (roomId) params.roomId = roomId;
    if (typeof senderId === 'number') params.senderId = senderId;
    if (token) params.token = token; // optional, for transitional auth

    const ch = socket.channel(topic, params);
    this.channelsByKey.set(key, ch);
    return ch;
  }

  leaveChannel(token: string, topic: string) {
    const key = `${topic}`;
    const ch = this.channelsByKey.get(key);
    if (ch) {
      try { ch.leave(); } catch {}
      this.channelsByKey.delete(key);
    }
  }
}

export function getChannelAdapter(token: string, topic: string, roomId: string, senderId: number): RealtimeChannelAdapter {
  const hub = PhoenixChannelHub.getInstance();

  // Create channels (primary + alias) and join both. If alias is unused, it will be idle.
  let channel = hub.getOrCreateChannel(token, topic, roomId, senderId);

  let readyState = 0;
  const adapter: RealtimeChannelAdapter = {
    get readyState() { return readyState; },
    set readyState(v: number) { readyState = v; },
    onopen: undefined,
    onmessage: undefined,
    onclose: undefined,
    onerror: undefined,
    send(data: string | Record<string, any>) {
      try {
        const payload = typeof data === 'string' ? JSON.parse(data) : data;
        (channel as any).push("chat:message", payload);
      } catch (e) {
        if (DEV) console.error('[phoenix] send() invalid JSON payload', { data, e });
        try { adapter.onerror?.({ code: 'INVALID_JSON', reason: 'send() expects a JSON string or object', data }); } catch {}
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

      hub.leaveChannel(token, topic);
      readyState = 3;
      adapter.onclose?.({ code: 1000, reason: 'client closed' });
    },
  } as RealtimeChannelAdapter;

  // Unify forward → adapter.onmessage with normalized envelope
    const forward = (event: string, topic: string, payload: any) => {
        // ignore any Phoenix reply noise that shouldn't reach the app layer

        const isPass = isInternalEvent(event);

        if (!event || isPass) return;

        // --- unwrap server envelope like: {event:"chat:message", payload:{...}} ---
        let outEvent = event;
        // default to an empty object when payload is null/undefined
        let outPayload: any = (payload == null ? {} : payload);

        if (
            payload &&
            typeof payload === "object" &&
            typeof (payload as any).event === "string"
        ) {
            outEvent = String((payload as any).event);
            const inner = (payload as any).payload;
            outPayload = (inner == null ? {} : inner);
        }
        const env = { event: outEvent, topic: topic.replace(/^room:/, ""), payload: outPayload };
        try { adapter.onmessage?.({ data: JSON.stringify(env) }); } catch {}
    };

  // Wire a channel with wildcard forwarding and explicit events
  function wireChannel(ch: any, topicLabel: string) {
    // idempotent wiring: wire only once per channel instance
    if ((ch as any).__wired) return;
    (ch as any).__wired = true;
    if (DEV) console.log('[phoenix] wire channel', { topic: topicLabel });
    // Patch onMessage to wildcard‑forward every event before original handler, ensuring we never miss early events.
    try {
      const orig = ch.onMessage?.bind(ch);
      ch.onMessage = (event: string, payload: any, ref: any) => {
        forward(event, topicLabel, payload);
        return orig ? orig(event, payload, ref) : payload;
      };
    } catch {}
  }

  function recreateChannels() {
    try { (channel as any).leave?.(); } catch {}

    hub.leaveChannel(token, topic);

    channel = hub.getOrCreateChannel(token, topic, roomId, senderId);

    // Reset to connecting so that onopen can fire after successful rejoin
    readyState = 0;

    wireChannel(channel, topic);

    joinChannel(channel, topic);
  }

  // --- background resiliency helpers ---
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

  // ⬇️ Add this line
  const JOIN_TIMEOUT_MS = 5000; // if server never replies to join, recreate

  // Join helpers
  function joinChannel(ch: any, topicLabel: string) {
    // Guard: avoid calling join() twice on the same channel instance
    try {
      const st = (ch as any).state;
      if (st === 'joining' || st === 'joined') {
        if (DEV) console.log('[phoenix] skip join (state)', { topic: topicLabel, state: st });
        return;
      }
    } catch {}

    try {
      let joinTimer: any = null;
      const clearJoinTimer = () => { if (joinTimer) { try { clearTimeout(joinTimer); } catch {} joinTimer = null; } };

      // start watchdog in case server never answers
      joinTimer = setTimeout(() => {
        try {
          const st = (ch as any).state;
          if (st === 'joining') {
            if (DEV) console.log('[phoenix] join timeout → recreate', { topic: topicLabel });
            try { (ch as any).leave?.(); } catch {}
            scheduleRetry('join timeout:' + topicLabel);
          }
        } catch {}
      }, JOIN_TIMEOUT_MS);

      ch.join()
        .receive('ok', () => {
          if (DEV) console.log('[phoenix] join ok', { topic: topicLabel });
          clearJoinTimer();
          retryAttempt = 0; // reset backoff on any success
          clearRetry();
          if (readyState === 0) { readyState = 1; adapter.onopen?.(); }
        })
        .receive('error', (e: any) => {
          clearJoinTimer();
          if (DEV) console.log('[phoenix] join error', { topic: topicLabel, e });
          scheduleRetry('join error:' + topicLabel);
          adapter.onerror?.(e);
        });
    } catch (e) {
      if (DEV) console.log('[phoenix] join exception', { topic: topicLabel, e });
      scheduleRetry('join exception:' + topicLabel);
      adapter.onerror?.(e);
    }
  }

  // Wire before initial join to avoid missing early events
  wireChannel(channel, topic);

  // Initial join after wiring
  joinChannel(channel, topic);

  // Lifecycle propagation (errors/close)
  try { (channel as any).onError?.((e: any) => { if (DEV) console.log('[phoenix] channel error', e); adapter.onerror?.(e); scheduleRetry('channel error'); }); } catch {}
  try {
    (channel as any).onClose?.(() => {
      if (DEV) console.log('[phoenix] channel closed');
      try { adapter.onclose?.({ code: 1006, reason: 'channel closed' }); } catch {}
      scheduleRetry('channel closed');
    });
  } catch {}

  return adapter;
}
