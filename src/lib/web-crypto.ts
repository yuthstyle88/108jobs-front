export async function generateKeys(): Promise<{ privateKey: CryptoKey; publicKey: string }> {
    if (typeof window === 'undefined') {
        throw new Error('generateKeys must be called in browser environment');
    }

    try {
        const keyPair = await window.crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256",
            },
            true, // extractable
            ["encrypt", "decrypt"]
        );

        // ✅ Export public key เป็น SPKI
        const spkiBuffer = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);

        // ✅ แปลงเป็น Base64 PEM format (64 chars per line)
        const binary = new Uint8Array(spkiBuffer);
        const base64 = btoa(String.fromCharCode(...binary));
        const formattedBase64 = base64.match(/.{1,64}/g)?.join('\n') ?? base64;
        const publicKeyPEM = `-----BEGIN PUBLIC KEY-----\n${formattedBase64}\n-----END PUBLIC KEY-----`;

        return {
            privateKey: keyPair.privateKey,
            publicKey: publicKeyPEM
        };

    } catch (error) {
        console.error('Error generating keys:', error);
        throw new Error('Failed to generate encryption keys');
    }
}

export async function exportPublicKeyToPem(publicKey: CryptoKey) {
    const spki = await window.crypto.subtle.exportKey('spki', publicKey);
    const b64 = btoa(String.fromCharCode(...new Uint8Array(spki)));
    const pem = `-----BEGIN PUBLIC KEY-----\n${b64.match(/.{1,64}/g)?.join('\n')}\n-----END PUBLIC KEY-----`;
    return pem;
}

export async function exportPrivateKeyToPem(privateKey: CryptoKey) {
    const pkcs8 = await window.crypto.subtle.exportKey('pkcs8', privateKey);
    const b64 = btoa(String.fromCharCode(...new Uint8Array(pkcs8)));
    const pem = `-----BEGIN PRIVATE KEY-----\n${b64.match(/.{1,64}/g)?.join('\n')}\n-----END PRIVATE KEY-----`;
    return pem;
}

export async function importRsaPublicKey(pem: string) {
    const binaryDer = pemToBinary(pem);
    return await window.crypto.subtle.importKey(
        "spki",
        binaryDer,
        { name: "RSA-OAEP", hash: "SHA-256" },
        true,
        ["encrypt"]
    );
}
export async function importRsaPrivateKey(pem: string) {
    const binaryDer = pemToBinary(pem);
    return await window.crypto.subtle.importKey(
        "pkcs8",
        binaryDer,
        { name: "RSA-OAEP", hash: "SHA-256" },
        true,
        ["decrypt"]
    );
}

function pemToBinary(pem: string) {
    const b64 = pem
        .replace(/-----(BEGIN|END) (PUBLIC|PRIVATE) KEY-----/g, '')
        .replace(/\s+/g, '');
    const binary = atob(b64);
    return new Uint8Array([...binary].map(c => c.charCodeAt(0)));
}

export async function encryptData(data: string, publicKeyPem: string): Promise<string> {
    const publicKey = await importRsaPublicKey(publicKeyPem);
    const encodedData = new TextEncoder().encode(data);

    const encrypted = await window.crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        publicKey,
        encodedData
    );

    return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}


export async function decryptData(encryptedData: string, privateKey: CryptoKey): Promise<string> {
    const encryptedBuffer = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));

    const decrypted = await window.crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        privateKey,
        encryptedBuffer
    );

    return new TextDecoder().decode(decrypted);
}