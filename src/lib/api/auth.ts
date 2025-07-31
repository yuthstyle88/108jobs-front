import {API_ROUTES} from "@/api/endpoints";
import {axiosPublicV2} from "@/lib/axios";
import {arrayBufferToHex, exportPublicKey, generateEcKeyPair, importEcPublicKeyHex} from "@/lib/web-crypto";

interface ExchangeKeyResponse {
  publicKey: string;
}

export async function exchangePublicKey(publicKey: string, token: string) {
  try {

    const url = `${API_ROUTES.auth.exchangeKey}`;

    const response = await axiosPublicV2.post(url,
      {
        publicKey: publicKey,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });

    if (response.status !== 200) {
      throw new Error("Exchange token request failed");
    }
    return (response.data as ExchangeKeyResponse).publicKey;
  } catch (error) {
    console.error('Token exchange error:',
      error);
    throw error;
  }
}

export async function checkEmailExists(email: string) {
  return axiosPublicV2.post("/oauth/email-exists",
    {email});
}

export async function exchange(accessToken: string) {
  // รับทั้ง privateKey และ publicKey
  const {privateKey, publicKey} = await generateEcKeyPair();

  // ส่งออกคีย์สาธารณะโดยใช้ publicKey (ไม่ใช่ privateKey)
  const pub = await exportPublicKey(publicKey);
  const publicKeyHex = await exchangePublicKey(pub,
    accessToken);

  const serverPubKey = await importEcPublicKeyHex(publicKeyHex);

  const sharedKey = await crypto.subtle.deriveBits(
    {name: "ECDH", public: serverPubKey},
    privateKey,
    256
  );

  return arrayBufferToHex(sharedKey);
}

