const crypto = globalThis.crypto;

export async function generateKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
        {
            name: "AES-CBC",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    );
}

export async function exportKey(key: CryptoKey): Promise<string> {
    const rawKey = await crypto.subtle.exportKey("raw", key);
    return arrayBufferToHex(rawKey);
}

export async function importKey(hexKey: string): Promise<CryptoKey> {
    const raw = hexToUint8Array(hexKey);
    return crypto.subtle.importKey(
        "raw",
        raw,
        { name: "AES-CBC" },
        false,
        ["encrypt", "decrypt"]
    );
}


export async function encrypt(data: string, key: CryptoKey, sessionId: string): Promise<{ ciphertext: string, iv: string }> {
    const iv = new TextEncoder().encode(sessionId.padEnd(21, '0').slice(5, 21)).slice(0, 16);
    const encoded = new TextEncoder().encode(data);

    const ciphertextBuffer = await crypto.subtle.encrypt(
        { name: "AES-CBC", iv },
        key,
        encoded
    );

    return {
        ciphertext: Buffer.from(ciphertextBuffer).toString('base64'),
        iv: Buffer.from(iv).toString('base64')
    };
}

export async function decrypt(ciphertextBase64: string, sessionId: string, key: CryptoKey): Promise<string> {
    const ciphertext = Buffer.from(ciphertextBase64, 'base64');
    const iv = new TextEncoder().encode(sessionId.padEnd(21, '0').slice(5, 21)).slice(0, 16);

    const decryptedBuffer = await crypto.subtle.decrypt(
        { name: "AES-CBC", iv },
        key,
        ciphertext
    );

    return new TextDecoder().decode(decryptedBuffer);
}

export function random36Chars(): string {
    const bytes = crypto.getRandomValues(new Uint8Array(18));
    return Array.from(bytes, b => (b % 36).toString(36)).join('');
}


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


export function arrayBufferToHex(buf: ArrayBuffer): string {
    return Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}
