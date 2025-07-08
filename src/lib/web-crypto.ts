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
    return Array.from(new Uint8Array(rawKey)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function importKey(hexKey: string): Promise<CryptoKey> {
    const raw = new Uint8Array(hexKey.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    return await crypto.subtle.importKey("raw", raw, { name: "AES-CBC" }, false, ["encrypt", "decrypt"]);
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