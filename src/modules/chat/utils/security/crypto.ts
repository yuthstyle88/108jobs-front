const crypto = globalThis.crypto;
import {UserService} from "@/services";
import {idbGet, idbSet} from "@/utils";

export type AESKey = CryptoKey;

// === Constants ===
const ID_PRIV_KEY_IDB = "identity_priv_ecdh_p256"; // non-extractable CryptoKey in IDB
const ID_PUB_SEC1_HEX_KEY = "identity_pub_sec1_hex"; // uncompressed SEC1 public key hex (65B, starts with 04)

// WebCrypto handle
const subtle = typeof window !== "undefined" ? window.crypto?.subtle : undefined;

// === Hex helpers ===
const hexToBytes = (hex: string) => new Uint8Array(hex.match(/.{1,2}/g)!.map(h => parseInt(h, 16)));
const bytesToHex = (buf: ArrayBuffer | Uint8Array) => {
  const a = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  return Array.from(a).map(b => b.toString(16).padStart(2, "0")).join("");
};

// === Identity keypair (ECDH P-256) ===
export async function ensureIdentityKeyPair(): Promise<{ privateKey: CryptoKey; publicKeyHex: string }> {
  if (!subtle) throw new Error("WebCrypto not available");

  const existingPriv = await idbGet<CryptoKey>(ID_PRIV_KEY_IDB);
  const existingPubHex = localStorage.getItem(ID_PUB_SEC1_HEX_KEY) || undefined;
  if (existingPriv && existingPubHex) return { privateKey: existingPriv, publicKeyHex: existingPubHex };

  // Generate extractable pair to export public, then re-import private as non-extractable
  const pair = (await subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"])) as CryptoKeyPair;
  const pubRaw = await subtle.exportKey("raw", pair.publicKey); // 65 bytes, SEC1 uncompressed
  const publicKeyHex = bytesToHex(pubRaw);

  const pkcs8 = await subtle.exportKey("pkcs8", pair.privateKey);
  const privateKey = await subtle.importKey("pkcs8", pkcs8, { name: "ECDH", namedCurve: "P-256" }, false, ["deriveBits"]);

  await idbSet(ID_PRIV_KEY_IDB, privateKey);
  localStorage.setItem(ID_PUB_SEC1_HEX_KEY, publicKeyHex);
  return { privateKey, publicKeyHex };
}

// === Peer public key (strict SEC1 uncompressed hex) ===
async function importPeerPublicKeyHex(sec1Hex: string): Promise<CryptoKey> {
  if (!subtle) throw new Error("WebCrypto not available");
  const hex = String(sec1Hex || "").trim().toLowerCase();
  if (hex.length !== 130 || !hex.startsWith("04")) {
    throw new Error("Public key must be uncompressed SEC1 hex (130 chars, starts with 04)");
  }
  return subtle.importKey("raw", hexToBytes(hex), { name: "ECDH", namedCurve: "P-256" }, true, []);
}

// === Derive AES-GCM-256 directly from ECDH (no HKDF) ===
async function deriveRoomAesGcmKey(privateKey: CryptoKey, peerPubHex: string): Promise<CryptoKey> {
  const peerPub = await importPeerPublicKeyHex(peerPubHex);
  const shared = await subtle!.deriveBits({ name: "ECDH", public: peerPub }, privateKey, 256); // 32 bytes
  return subtle!.importKey("raw", shared, { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
}

// In-memory cache: roomId -> AES key (hex)
const ROOM_KEYS_MEM = new Map<string, string>();

// Ensure a shared AES key for a room using the peer's public key (hex, strict 130)
export async function ensureSharedKeyForRoom(roomId: string, peerPublicSec1Hex?: string): Promise<void> {
  const token = UserService.Instance.auth();
  if (!token || !subtle) return;

  const cached = ROOM_KEYS_MEM.get(roomId);
  if (cached) {
    UserService.Instance.authInfo = { ...(UserService.Instance.authInfo || { auth: token }), sharedKey: cached, claims: UserService.Instance.authInfo?.claims };
    return;
  }

  // If peer key is missing, don't block data loading; skip silently.
  if (!peerPublicSec1Hex) {
    return;
  }

  // Normalize and accept a few strict forms:
  let hex = String(peerPublicSec1Hex).trim().toLowerCase().replace(/^0x/, "");

  // If 64 hex chars → already a shared AES-256 key; store and return.
  if (hex.length === 64) {
    ROOM_KEYS_MEM.set(roomId, hex);
    UserService.Instance.authInfo = { ...(UserService.Instance.authInfo || { auth: token }), sharedKey: hex, claims: UserService.Instance.authInfo?.claims };
    return;
  }

  // If 128 hex chars → treat as SEC1 without 0x04, prepend it.
  if (hex.length === 128) {
    hex = `04${hex}`;
  }

  // If not 130 now, skip to avoid breaking initial data load.
  if (hex.length !== 130 || !hex.startsWith("04")) {
    return;
  }

  const { privateKey } = await ensureIdentityKeyPair();
  const aes = await deriveRoomAesGcmKey(privateKey, hex);
  const rawHex = bytesToHex(await subtle.exportKey("raw", aes));

  ROOM_KEYS_MEM.set(roomId, rawHex);
  UserService.Instance.authInfo = { ...(UserService.Instance.authInfo || { auth: token }), sharedKey: rawHex, claims: UserService.Instance.authInfo?.claims };
}

// Import AES key from hex (64 chars)
export async function importAesKey(sharedKeyHex: string, usage: KeyUsage): Promise<AESKey> {
  if (!subtle) throw new Error("WebCrypto not available");
  const hex = String(sharedKeyHex || "").trim().toLowerCase();
  if (hex.length !== 64) throw new Error("AES-256 key must be 32 bytes (64 hex chars)");
  return subtle.importKey("raw", hexToBytes(hex), { name: "AES-GCM", length: 256 }, false, [usage]);
}

// Derive AES key hex using a known private key and the server's public key hex
export async function deriveAesGcmKeyHex(clientPrivateKey: CryptoKey, serverPubHex: string): Promise<string> {
  if (!subtle) throw new Error("WebCrypto not available");
  const serverPub = await importPeerPublicKeyHex(serverPubHex);
  const shared = await subtle.deriveBits({ name: "ECDH", public: serverPub }, clientPrivateKey, 256);
  const aes = await subtle.importKey("raw", shared, { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
  return bytesToHex(await subtle.exportKey("raw", aes));
}
/**
 * AES-GCM-encrypt a UTF-8 string and return Base64 ciphertext with prepended nonce.
 *
 * The nonce is randomly generated (12 bytes, recommended for GCM) and prepended to the ciphertext.
 * The nonce is included in the output to allow decryption without separate storage.
 *
 * @param data       Plaintext string.
 * @param key        Symmetric `CryptoKey` (AES-GCM, 128/192/256-bit).
 * @returns          Base64 string containing nonce (12 bytes) + ciphertext.
 */
export async function encrypt(
  data: string,
  key: CryptoKey,
): Promise<string> {
    const nonce = crypto.getRandomValues(new Uint8Array(12)); // 12 bytes is recommended for GCM
    const encoded = new TextEncoder().encode(data);

    const ciphertextBuffer = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: nonce },
      key,
      encoded,
    );

    // Prepend nonce to ciphertext
    const combined = new Uint8Array(nonce.length + ciphertextBuffer.byteLength);
    combined.set(nonce, 0);
    combined.set(new Uint8Array(ciphertextBuffer), nonce.length);

    return Buffer.from(combined).toString("base64");
}

/**
 * Decrypt ciphertext produced by {@link encrypt}.
 *
 * @param ciphertextBase64  Base64 string containing nonce (12 bytes) + ciphertext.
 * @param key               Symmetric `CryptoKey` (same as encryption).
 * @returns                 Decrypted plaintext string (UTF-8).
 */
export async function decrypt(
  ciphertextBase64: string,
  key: CryptoKey,
): Promise<string> {
    const combined = Buffer.from(ciphertextBase64, "base64");
    if (combined.length < 12) {
        throw new Error("Ciphertext too short to contain valid nonce");
    }

    const nonce = combined.slice(0, 12); // Extract first 12 bytes as nonce
    const ciphertext = combined.slice(12); // Remainder is ciphertext

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: nonce },
      key,
      ciphertext,
    );

    return new TextDecoder().decode(decryptedBuffer);
}

