import * as wcb from 'webcryptobox';

interface KeyPair {
    privateKey: string;
    publicKey: string;
}

export async function generateKeys(): Promise<{ privateKey: CryptoKey; publicKey: string }> {
    try {
        // Generate key pair
        const { privateKey, publicKey } = await wcb.generateKeyPair();

        // Export public key to PEM format
        const publicKeyPem = await wcb.exportPublicKeyPem(publicKey);

        // Export private key (สำหรับเก็บไว้ใช้ในภายหลัง)
        const privateKeyPem = await wcb.exportPrivateKeyPem(privateKey);

        return {
            privateKey: privateKeyPem,
            publicKey: publicKeyPem
        };
    } catch (error) {
        console.error('Error generating keys:', error);
        throw new Error('Failed to generate encryption keys');
    }
}

// สร้างฟังก์ชันสำหรับเข้ารหัสข้อมูล
export async function encryptData(data: string, publicKeyPem: string): Promise<string> {
    try {
        // แปลง PEM กลับเป็น CryptoKey
        const publicKey = await wcb.importPublicKeyPem(publicKeyPem);

        // เข้ารหัสข้อมูล
        const encrypted = await wcb.encrypt(data, publicKey);

        // แปลงเป็น base64 string เพื่อส่งผ่าน API
        return Buffer.from(encrypted).toString('base64');
    } catch (error) {
        console.error('Error encrypting data:', error);
        throw new Error('Failed to encrypt data');
    }
}

// สร้างฟังก์ชันสำหรับถอดรหัสข้อมูล
export async function decryptData(encryptedData: string, privateKeyPem: string): Promise<string> {
    try {
        // แปลง base64 string กลับเป็น ArrayBuffer
        const encryptedBuffer = Buffer.from(encryptedData, 'base64');

        // แปลง PEM กลับเป็น CryptoKey
        const privateKey = await wcb.importPrivateKeyPem(privateKeyPem);

        // ถอดรหัสข้อมูล
        const decrypted = await wcb.decrypt(encryptedBuffer, privateKey);

        // แปลงกลับเป็น string
        return new TextDecoder().decode(decrypted);
    } catch (error) {
        console.error('Error decrypting data:', error);
        throw new Error('Failed to decrypt data');
    }
}