import {arrayBufferToHex, exportPublicKey, generateEcKeyPair, importEcPublicKeyHex} from "@/lib/web-crypto";
import {HttpService, REQUEST_STATE} from "@/services/HttpService";

export async function exchange() {
    const {privateKey, publicKey} = await generateEcKeyPair();

    const pub = await exportPublicKey(publicKey);

    const resp = await HttpService.client.exchangePublicKey({
        publicKey: pub
    });

    if (resp.state !== REQUEST_STATE.SUCCESS || !resp.data) {
        throw (resp as any).err ?? new Error("Failed to exchange public key");
    }

    const serverPubKey = await importEcPublicKeyHex(resp.data.publicKey);

    const sharedKey = await crypto.subtle.deriveBits(
        {name: "ECDH", public: serverPubKey},
        privateKey,
        256
    );

    return arrayBufferToHex(sharedKey);
}

