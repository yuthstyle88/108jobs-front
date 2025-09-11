import {HttpService, REQUEST_STATE} from "@/services/HttpService";

// Publish identity public key (idempotent). No DH with server.
// Keep the name `exchange` to minimize ripple changes, but it now returns the stored public key (echo).
export async function exchange(publicKeyHex?: string) {
    // If caller provided a key, publish it; otherwise try to load or generate
    let pub = publicKeyHex;
    if (!pub) {
        let local: string | null = null;
        if (typeof window !== "undefined") {
            local = localStorage.getItem("identity_pub_sec1_hex");
            if (!local) {
                // Lazy-generate identity keypair to obtain public key
                try {
                    const mod = await import("@/utils/crypto");
                    const pair = await (mod as any)["ensureIdentityKeyPair"]?.();
                    if (pair?.publicKeyHex) local = pair.publicKeyHex;
                } catch {}
            }
        }
        if (!local) throw new Error("No identity public key available to publish");
        pub = local;
    }

    const resp = await HttpService.client.exchangePublicKey({ publicKey: pub });

    if (resp.state !== REQUEST_STATE.SUCCESS || !resp.data) {
        throw (resp as any).err ?? new Error("Failed to publish identity public key");
    }

    // Return what server echoes back (or void). No shared secret here anymore.
    return resp.data.publicKey;
}

