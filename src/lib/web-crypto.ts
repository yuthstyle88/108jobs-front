export async function generateKey(): Promise<CryptoKey> {
    return await window.crypto.subtle.generateKey(
        {
            name: "AES-CBC",
            length: 256, // AES-256
        },
        true, // extractable
        ["encrypt", "decrypt"]
    );
}

export async function exportKey(key: CryptoKey): Promise<string> {
    const rawKey = await window.crypto.subtle.exportKey("raw", key);
    return btoa(String.fromCharCode(...new Uint8Array(rawKey)));
}

export async function importAesKeyFromBase64(base64Key: string): Promise<CryptoKey> {
    const raw = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));
    return await window.crypto.subtle.importKey(
        "raw",
        raw,
        { name: "AES-CBC" },
        true,
        ["encrypt", "decrypt"]
    );
}

export async function encrypt(data: string, key: CryptoKey, sessionId: string): Promise<{ ciphertext: string, iv: string }> {
    const iv = new TextEncoder().encode(sessionId.padEnd(21, '0').slice(5, 21)).slice(0, 16);
    const encoded = new TextEncoder().encode(data);

    const ciphertextBuffer = await window.crypto.subtle.encrypt(
        { name: "AES-CBC", iv },
        key,
        encoded
    );

    return {
        ciphertext: btoa(String.fromCharCode(...new Uint8Array(ciphertextBuffer))),
        iv: btoa(String.fromCharCode(...iv))
    };
}

export async function decrypt(ciphertextBase64: string, sessionId: string, key: CryptoKey): Promise<string> {
    const ciphertext = Uint8Array.from(atob(ciphertextBase64), c => c.charCodeAt(0));
    const iv = new TextEncoder().encode(sessionId.padEnd(21, '0').slice(5, 21)).slice(0, 16);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: "AES-CBC", iv },
        key,
        ciphertext
    );

    return new TextDecoder().decode(decryptedBuffer);
}