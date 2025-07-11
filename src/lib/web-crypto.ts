const crypto = globalThis.crypto;

/**
 * Generate an Elliptic-Curve key pair for either ECDH (default) or ECDSA.
 *
 * @param curve  Named curve to use. One of `"P-256" | "P-384" | "P-521"`.
 * @returns      A promise that resolves to `{ publicKey, privateKey }`.
 *
 * Example
 * ```ts
 * const { publicKey, privateKey } = await generateEcKeyPair(); // P-256
 * ```
 */
export async function generateEcKeyPair(
    curve: NamedCurve = "P-256",
): Promise<CryptoKeyPair> {
    return crypto.subtle.generateKey(
        {
            name: "ECDH",          // change to "ECDSA" if you need signing
            namedCurve: curve,
        },
        true,
        ["deriveKey", "deriveBits"], // for ECDSA use ["sign", "verify"]
    );
}

/**
 * Export an EC public key to a hex-encoded **SPKI DER** string.
 *
 * @param key  A `CryptoKey` whose `type === "public"`.
 * @returns       Hex string (lower-case, no `0x` prefix).
 *
 * Useful for compact text transport (e.g. REST/JSON) without PEM framing.
 */
export async function exportPublicKey(key: CryptoKey): Promise<string> {

    const spki = await crypto.subtle.exportKey("spki", key);
    return uint8ArrayToHex(new Uint8Array(spki));
}


/**
 * Import a hex-encoded **SPKI DER** string as an EC public `CryptoKey`.
 *
 * @param hex    Hex string produced by {@link importEcPublicKeyHex}.
 * @param curve  Must match the curve used when the key pair was generated.
 * @returns      A usable `CryptoKey` (public).
 *
 * ```ts
 * const publicKey = await importEcPublicKeyHex(remoteHex, "P-256");
 * ```
 */
export async function importEcPublicKeyHex(
    hex: string,
    curve: NamedCurve = "P-256",
): Promise<CryptoKey> {
    const spkiBytes = hexToUint8Array(hex);
    return crypto.subtle.importKey(
        "spki",
        spkiBytes,
        { name: "ECDH", namedCurve: curve },
        true,
        [],
    );
}

/**
 * AES-CBC-encrypt a UTF-8 string and return Base64 ciphertext.
 *
 * The IV is deterministically derived from `sessionId`
 * (16 bytes taken from characters 5-20, right-padded with `'0'`),
 * therefore it can be recomputed during decryption.  
 * Because the IV is **not** random, do **not** reuse the same
 * `sessionId` with the same key for different plaintexts if you
 * require semantic security.
 *
 * @param data       Plaintext string.
 * @param key        Symmetric `CryptoKey` (AES-CBC, 128/192/256-bit).
 * @param sessionId  Session identifier used to derive the IV.
 * @returns          Base64 ciphertext string.
 */
export async function encrypt(
  data: string,
  key: CryptoKey,
  sessionId: string,
): Promise<string> {
  const iv = new TextEncoder()
    .encode(sessionId.padEnd(21, "0").slice(5, 21))
    .slice(0, 16);

  const encoded = new TextEncoder().encode(data);

  const ciphertextBuffer = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    key,
    encoded,
  );

  return Buffer.from(ciphertextBuffer).toString("base64");
}

/**
 * Decrypt ciphertext produced by {@link encrypt}.
 *
 * @param ciphertextBase64  Base64 ciphertext string.
 * @param sessionId         Same sessionId that was used to encrypt.
 * @param key               Symmetric `CryptoKey` (same as encryption).
 * @returns                 Decrypted plaintext string (UTF-8).
 */
export async function decrypt(
    ciphertextBase64: string,
    sessionId: string,
    key: CryptoKey,
): Promise<string> {
    const ciphertext = Buffer.from(ciphertextBase64, "base64");
    const iv = new TextEncoder()
        .encode(sessionId.padEnd(21, "0").slice(5, 21))
        .slice(0, 16);

    const decryptedBuffer = await crypto.subtle.decrypt(
        { name: "AES-CBC", iv },
        key,
        ciphertext,
    );

    return new TextDecoder().decode(decryptedBuffer);
}


/**
 * Convert a hex string to `Uint8Array`.
 *
 * @throws Error if the string length is odd or contains non-hex characters.
 */
export function hexToUint8Array(hex: string): Uint8Array {
    const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
    if (clean.length % 2 !== 0) {
        throw new Error("Hex string length must be even");
    }
    const bytes = new Uint8Array(clean.length / 2);
    for (let i = 0; i < clean.length; i += 2) {
        bytes[i / 2] = parseInt(clean.substr(i, 2), 16);
    }
    return bytes;
}

/**
 * Convert an `ArrayBuffer` to a lower-case hex string.
 */
export function uint8ArrayToHex(buf: Uint8Array): string {
    return [...buf].map(b => b.toString(16).padStart(2, "0")).join("");
}

export function arrayBufferToHex(buffer: ArrayBuffer): string {
    return uint8ArrayToHex(new Uint8Array(buffer));
}
