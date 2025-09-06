import {hexToUint8Array} from "@/lib/web-crypto";
import {exchange} from "@/lib/api/auth";
import {UserService} from "@/services";
import {logDebug} from "./realtime";

export type AESKey = CryptoKey;

export async function ensureSharedKeyForRoom(roomId: string): Promise<void> {
  const token = UserService.Instance.auth();
  if (!token) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(`ensureSharedKeyForRoom: Skipped - no token`);
    }
    return;
  }

  try {
    const storageKey = `sharedKey_room_${roomId}`;
    const storedKey = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
    if (storedKey) {
      UserService.Instance.authInfo = {
        ...(UserService.Instance.authInfo || { auth: token }),
        sharedKey: storedKey,
        claims: UserService.Instance.authInfo?.claims,
      };
      logDebug(`ensureSharedKeyForRoom: Loaded shared key from localStorage for room ${roomId}`);
      return;
    }

    const derived = await exchange();
    UserService.Instance.authInfo = {
      ...(UserService.Instance.authInfo || { auth: token }),
      sharedKey: derived,
      claims: UserService.Instance.authInfo?.claims,
    };
    if (typeof window !== "undefined") localStorage.setItem(storageKey, derived);
    logDebug(`ensureSharedKeyForRoom: Exchanged and stored new shared key for room ${roomId}`);
  } catch (ex) {
    console.warn(`ensureSharedKeyForRoom: Key exchange failed for room ${roomId}`, ex);
  }
}

export async function importAesKey(sharedKeyHex: string, usage: KeyUsage): Promise<AESKey> {
  const keyData = hexToUint8Array(sharedKeyHex);
  logDebug(`importAesKey: Importing AES key for ${usage}`);
  return crypto.subtle.importKey("raw", keyData, { name: "AES-CBC", length: 256 }, false, [usage]);
}