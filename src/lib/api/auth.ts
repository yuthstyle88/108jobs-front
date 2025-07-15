import {API_ROUTES} from "@/api/endpoints";
import {axiosPublicV2} from "@/lib/axios";
import {arrayBufferToHex, exportPublicKey, generateEcKeyPair, importEcPublicKeyHex} from "@/lib/web-crypto";

interface ExchangeKeyResponse {
  public_key: string;
}

export async function exchangePublicKey(public_key: string, token: string) {
  try {

    const url = `${API_ROUTES.auth.exchange_key}`;

    const response = await axiosPublicV2.post(url,
      {
        public_key: public_key,
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
    return (response.data as ExchangeKeyResponse).public_key;
  } catch (error) {
    console.error('Token exchange error:',
      error);
    throw error;
  }
}

/**
 * Authenticate a returning user via an external OAuth provider and receive
 * our application's token in exchange.
 *
 * @param provider            OAuth provider name (e.g. "google")
 * @param providerAccountId   Provider‑specific user ID
 * @param fullName            User’s full display name
 * @param emailAddress        User’s email
 */
export async function authenticateWithOAuth(
  provider: string,
  providerAccountId: string,
  fullName: string,
  emailAddress: string,
) {
  return axiosPublicV2.post("/oauth/authenticate", {
    oauthProvider: provider,
    providerAccountId,
    name: fullName,
    email: emailAddress,
  });
}
export async function checkEmailExists(email: string) {
  return axiosPublicV2.post("/oauth/email-exists", { email });
}

export async  function  exchange(accessToken: string) {
  const {publicKey, privateKey} = await generateEcKeyPair();
  const pub = await exportPublicKey(publicKey);
  const public_key = await exchangePublicKey(pub, accessToken as string);
  const serverPubKey = await importEcPublicKeyHex(public_key);
  const shared_key = await crypto.subtle.deriveBits(
    {name: "ECDH", public: serverPubKey},
    privateKey,
    256
  );
  return arrayBufferToHex(shared_key);
}
