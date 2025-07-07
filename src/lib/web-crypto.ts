export async function generateKeys(): Promise<{ privateKey: CryptoKey; publicKey: string }> {
    if (typeof window === 'undefined') {
        throw new Error('generateKeys must be called in browser environment');
    }

    try {
        // สร้าง key pair
        const keyPair = await window.crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256",
            },
            true,
            ["encrypt", "decrypt"]
        );

        // แปลง public key เป็น PEM format
        const publicKeyExported = await window.crypto.subtle.exportKey(
            "spki",
            keyPair.publicKey
        );
        const publicKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(publicKeyExported)));
        const publicKeyPEM = `-----BEGIN PUBLIC KEY-----\n${publicKeyBase64}\n-----END PUBLIC KEY-----`;

        return {
            privateKey: keyPair.privateKey,
            publicKey: publicKeyPEM
        };
    } catch (error) {
        console.error('Error generating keys:', error);
        throw new Error('Failed to generate encryption keys');
    }
}

export async function encryptData(data: string, publicKeyPem: string): Promise<string> {
    if (typeof window === 'undefined') {
        throw new Error('encryptData must be called in browser environment');
    }

    try {
        // แปลง PEM กลับเป็น CryptoKey
        const publicKeyBase64 = publicKeyPem
            .replace('-----BEGIN PUBLIC KEY-----', '')
            .replace('-----END PUBLIC KEY-----', '')
            .replace(/\n/g, '');
        const publicKeyBinary = Uint8Array.from(atob(publicKeyBase64), c => c.charCodeAt(0));
        const publicKey = await window.crypto.subtle.importKey(
            "spki",
            publicKeyBinary,
            {
                name: "RSA-OAEP",
                hash: "SHA-256"
            },
            true,
            ["encrypt"]
        );

        // เข้ารหัสข้อมูล
        const encodedData = new TextEncoder().encode(data);
        const encrypted = await window.crypto.subtle.encrypt(
            {
                name: "RSA-OAEP"
            },
            publicKey,
            encodedData
        );

        return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
    } catch (error) {
        console.error('Error encrypting data:', error);
        throw new Error('Failed to encrypt data');
    }
}

export async function decryptData(encryptedData: string, privateKey: CryptoKey): Promise<string> {
    if (typeof window === 'undefined') {
        throw new Error('decryptData must be called in browser environment');
    }

    try {
        // แปลง base64 string กลับเป็น ArrayBuffer
        const encryptedBuffer = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));

        // ถอดรหัสข้อมูล
        const decrypted = await window.crypto.subtle.decrypt(
            {
                name: "RSA-OAEP"
            },
            privateKey,
            encryptedBuffer
        );

        return new TextDecoder().decode(decrypted);
    } catch (error) {
        console.error('Error decrypting data:', error);
        throw new Error('Failed to decrypt data');
    }
}