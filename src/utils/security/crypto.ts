import {UserService} from "@/services";
import {idbGet, idbSet} from "@/utils";

export type AESKey = CryptoKey;

// Helpers for identity key persistence using IndexedDB and non-extractable CryptoKey
const ID_PRIV_KEY_IDB = "identity_priv_ecdh_p256";
const ID_PUB_SEC1_HEX_KEY = "identity_pub_sec1_hex"; // public is safe in localStorage/IDB

export async function ensureIdentityKeyPair(): Promise<{ privateKey: CryptoKey; publicKeyHex: string }> {
  if (typeof window === "undefined") throw new Error("ensureIdentityKeyPair requires browser environment");

  // Try to load non-extractable CryptoKey from IDB
  const existingPriv = await idbGet<CryptoKey>(ID_PRIV_KEY_IDB);
  const existingPubHex = localStorage.getItem(ID_PUB_SEC1_HEX_KEY) || undefined;
  if (existingPriv && existingPubHex) {
    return { privateKey: existingPriv, publicKeyHex: existingPubHex };
  }

  // Migration: if legacy pkcs8 is found in localStorage, import once, store CryptoKey in IDB, then delete
  const legacyPrivB64 = localStorage.getItem("identity_priv_pkcs8_b64");
  const legacyPubHex = localStorage.getItem(ID_PUB_SEC1_HEX_KEY) || undefined;
  if (legacyPrivB64) {
    try {
      const pkcs8 = Uint8Array.from(atob(legacyPrivB64), c => c.charCodeAt(0)).buffer;
      const imported = await crypto.subtle.importKey(
        "pkcs8",
        pkcs8,
        { name: "ECDH", namedCurve: "P-256" },
        false,
        ["deriveBits", "deriveKey"]
      );
      await idbSet(ID_PRIV_KEY_IDB, imported);
      if (legacyPubHex) {
        localStorage.setItem(ID_PUB_SEC1_HEX_KEY, legacyPubHex);
      }
      localStorage.removeItem("identity_priv_pkcs8_b64");
      return { privateKey: imported, publicKeyHex: legacyPubHex || (await exportPublicHex(imported)) };
    } catch {}
  }

  // Generate new pair: temporarily extractable to export public; then re-import private as non-extractable
  const tmpPair = await crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveBits", "deriveKey"]
  ) as CryptoKeyPair;
  // Export public as raw -> hex
  const pubRaw = new Uint8Array(await crypto.subtle.exportKey("raw", tmpPair.publicKey));
  const publicKeyHex = Array.from(pubRaw).map(b => b.toString(16).padStart(2, "0")).join("");
  // Re-import private as non-extractable
  const pkcs8 = await crypto.subtle.exportKey("pkcs8", tmpPair.privateKey);
  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    pkcs8,
    { name: "ECDH", namedCurve: "P-256" },
    false,
    ["deriveBits", "deriveKey"]
  );
  await idbSet(ID_PRIV_KEY_IDB, privateKey);
  localStorage.setItem(ID_PUB_SEC1_HEX_KEY, publicKeyHex);
  return { privateKey, publicKeyHex };
}

async function exportPublicHex(privateKey: CryptoKey): Promise<string> {
  // Recreate public key by generating a pair is not possible; we need the public key.
  // Workaround: generate a throwaway pair and ignore; but we actually had only private here.
  // Better: in generate flow we already had public. In migration, we don't. So we derive from an ECDH import of pkcs8 missing public isn't possible.
  // Therefore, only used in generate path; for migration we keep legacyPubHex.
  throw new Error("exportPublicHex should not be called without available public key");
}

async function importPeerPublicKeyHex(sec1Hex: string): Promise<CryptoKey> {
  const bytes = new Uint8Array(sec1Hex.match(/.{1,2}/g)!.map(h => parseInt(h, 16)));
  if (bytes.length !== 65 || bytes[0] !== 0x04) {
    throw new Error("Invalid SEC1 uncompressed P-256 public key");
  }
  return crypto.subtle.importKey("raw", bytes, { name: "ECDH", namedCurve: "P-256" }, true, []);
}

function utf8(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

async function deriveRoomAesGcmKey(privateKey: CryptoKey, peerPubHex: string, roomId: string): Promise<CryptoKey> {
  const peerPub = await importPeerPublicKeyHex(peerPubHex);
  const shared = await crypto.subtle.deriveBits({ name: "ECDH", public: peerPub }, privateKey, 256);
  const ikm = await crypto.subtle.importKey("raw", shared, "HKDF", false, ["deriveKey"]);
  // Derive an AES-GCM key. It must be extractable to export raw bytes for in-memory caching/base64.
  return crypto.subtle.deriveKey(
    { name: "HKDF", hash: "SHA-256", salt: utf8(roomId), info: utf8("108jobs-chat") },
    ikm,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

// In-memory cache for per-room AES-GCM keys (base64 raw). Not persisted.
const ROOM_KEYS_MEM = new Map<string, string>();

// Derive and cache a per-room AES-GCM key based on peer's public key.
export async function ensureSharedKeyForRoom(roomId: string, peerPublicSec1Hex?: string): Promise<void> {
  const token = UserService.Instance.auth();
  if (!token) return;

  try {
    const cached = ROOM_KEYS_MEM.get(roomId);
    if (cached) {
      UserService.Instance.authInfo = {
        ...(UserService.Instance.authInfo || { auth: token }),
        sharedKey: cached,
        claims: UserService.Instance.authInfo?.claims,
      };
      return;
    }

    const { privateKey } = await ensureIdentityKeyPair();

    if (!peerPublicSec1Hex) {
      throw new Error("Peer public key is required to derive room key");
    }

    const aesGcmKey = await deriveRoomAesGcmKey(privateKey, peerPublicSec1Hex, roomId);
    const raw = new Uint8Array(await crypto.subtle.exportKey("raw", aesGcmKey));
    const rawB64 = btoa(String.fromCharCode(...raw));

    ROOM_KEYS_MEM.set(roomId, rawB64);

    UserService.Instance.authInfo = {
      ...(UserService.Instance.authInfo || { auth: token }),
      sharedKey: rawB64,
      claims: UserService.Instance.authInfo?.claims,
    };
  } catch (ex) {
    console.warn(`ensureSharedKeyForRoom: Key derivation failed for room ${roomId}`, ex);
  }
}

// Import the cached per-room AES-GCM key (base64 raw) for encrypt/decrypt usage
export async function importAesKey(sharedKeyBase64Raw: string, usage: KeyUsage): Promise<AESKey> {
  const raw = Uint8Array.from(atob(sharedKeyBase64Raw), c => c.charCodeAt(0));
  return crypto.subtle.importKey("raw", raw, { name: "AES-GCM", length: 256 }, false, [usage]);
}