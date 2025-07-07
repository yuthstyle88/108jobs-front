declare module 'webcryptobox' {
    export function generateKeyPair(): Promise<{
        privateKey: CryptoKey;
        publicKey: CryptoKey;
    }>;

    export function exportPublicKeyPem(key: CryptoKey): Promise<string>;

    export function importPublicKeyPem(pem: string): Promise<CryptoKey>;

    export function exportPrivateKeyPem(pem: CryptoKey): Promise<CryptoKey>;

    export function importPrivateKeyPem(pem: string): Promise<CryptoKey>;


    export function encrypt(
        data: string | ArrayBuffer,
        publicKey: CryptoKey
    ): Promise<ArrayBuffer>;

    export function decrypt(
        data: Buffer<ArrayBuffer>,
        privateKey: CryptoKey
    ): Promise<ArrayBuffer>;
}