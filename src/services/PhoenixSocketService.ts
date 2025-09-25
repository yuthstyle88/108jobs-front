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
  const channel = hub.getOrCreateChannel(token, primaryTopic);
  const aliasChannel = hub.getOrCreateChannel(token, aliasTopic);

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
      try { (channel as any).leave?.(); } catch {}
      try { (aliasChannel as any).leave?.(); } catch {}
      hub.leaveChannel(token, primaryTopic);
      hub.leaveChannel(token, aliasTopic);
      readyState = 3;
      adapter.onclose?.({ code: 1000, reason: "client closed" });
    },
  } as RealtimeChannelAdapter;

  // Join helpers
  function joinChannel(ch: any, topicLabel: string) {
    try {
      ch.join()
        .receive("ok", () => {
          if (readyState === 0) { readyState = 1; adapter.onopen?.(); }
        })
        .receive("error", (e: any) => {
          if (DEV) console.log("[phoenix] join error", { topic: topicLabel, e });
          readyState = 3;
          adapter.onerror?.(e);
          adapter.onclose?.({ code: 1008, reason: "join error" });
        });
    } catch (e) {
      if (DEV) console.log("[phoenix] join exception", { topic: topicLabel, e });
      readyState = 3;
      adapter.onerror?.(e);
    }
  }

  joinChannel(channel, primaryTopic);
  joinChannel(aliasChannel, aliasTopic);

  // Unify forward → adapter.onmessage with normalized envelope
  const forward = (event: string, topic: string, payload: any) => {
    if (!event || isInternalEvent(event)) return;
    const env = { event, topic: topic.replace(/^room:/, ""), payload };
    try { adapter.onmessage?.({ data: JSON.stringify(env) }); } catch {}
  };

  // Channel-level wildcard via onMessage (primary)
  try {
    const orig = (channel as any).onMessage?.bind(channel);
    (channel as any).onMessage = (event: string, payload: any, ref: any) => {
      // if (DEV) console.log("[phoenix] onMessage", { event, ref });
      forward(event, primaryTopic, payload);
      return orig ? orig(event, payload, ref) : payload;
    };
  } catch {}

  // Channel-level wildcard via onMessage (alias)
  try {
    const origA = (aliasChannel as any).onMessage?.bind(aliasChannel);
    (aliasChannel as any).onMessage = (event: string, payload: any, ref: any) => {
      forward(event, aliasTopic, payload);
      return origA ? origA(event, payload, ref) : payload;
    };
  } catch {}

  // Explicit events we actually use
  try {
    (channel as any).on("system:welcome", (p: any) => forward("system:welcome", primaryTopic, p));
    (channel as any).on("chat:message", (p: any) => forward("chat:message", primaryTopic, p));
  } catch {}
  try {
    (aliasChannel as any).on("chat:message", (p: any) => forward("chat:message", aliasTopic, p));
  } catch {}

  // Lifecycle propagation (errors/close)
  try { (channel as any).onError?.((e: any) => { if (DEV) console.log("[phoenix] channel error", e); adapter.onerror?.(e); }); } catch {}
  try { (channel as any).onClose?.(() => { if (readyState !== 3) { readyState = 3; adapter.onclose?.({ code: 1006, reason: "channel closed" }); } }); } catch {}
  try { ((channel as any).socket as any)?.onError?.((e: any) => { if (DEV) console.log("[phoenix] socket error", e); adapter.onerror?.(e); }); } catch {}
  try { ((channel as any).socket as any)?.onClose?.(() => { if (readyState !== 3) { readyState = 3; adapter.onclose?.({ code: 1006, reason: "socket closed" }); } }); } catch {}

  return adapter;
}
