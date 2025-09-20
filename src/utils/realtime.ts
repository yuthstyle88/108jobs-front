export const __DEV__ = process.env.NODE_ENV !== "production";

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

// Phoenix Socket URL helper
export function buildPhoenixUrl(): string {
  // Allow override via env; default to same host at /socket
    return process.env.NEXT_PUBLIC_PHOENIX_WS_URL || "wss://api-fastwork-stg.ibrowe.com/socket";
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
