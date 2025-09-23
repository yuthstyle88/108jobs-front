import  {__DEV__} from "@/utils/appConfig";
import { getHost, isHttps} from "@/utils/env";

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
  if (!p || typeof p !== 'object') return false;

  // Reject if this looks like a typing payload (top-level typing field)
  if (typeof (p as any).typing === 'boolean') return false;

  // Reject if content is clearly not a real message
  const content = (p as any).content;
  if (typeof content !== 'string' || content.length === 0) return false;

  const trimmed = content.trim();
  if (trimmed === '{}') return false;

  try {
    // If content is a JSON string and represents a typing shape, reject
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed === 'object') {
      const hasTyping = Object.prototype.hasOwnProperty.call(parsed, 'typing');
      const looksTyping = hasTyping && typeof (parsed as any).typing === 'boolean';
      const isEmptyObj = Object.keys(parsed as any).length === 0;
      if (looksTyping || isEmptyObj) return false;
    }
  } catch { /* not JSON, ignore */ }

  return !!(
    (p as any).op === 'SendMessage' || typeof (p as any).op === 'undefined'
  ) &&
  typeof (p as any).sender_id === 'number' && (p as any).sender_id >= 0 &&
  typeof (p as any).room_id === 'string' && (p as any).room_id.length > 0 &&
  typeof (p as any).id === 'string' && (p as any).id.length > 0 &&
  typeof (p as any).createdAt === 'string';
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