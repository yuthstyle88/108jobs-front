import {API_ROUTES} from "@/api/endpoints";
import {axiosPublicV2} from "@/lib/axios";

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

export async function sendTokenToApiServer(oauthProvider: string, providerAccountId: string, name: string, email: string) {
  // ตัวอย่างการยิงไป API ภายใน
  return await axiosPublicV2.post(`/oauth/authenticate`,
    {
      oauthProvider: oauthProvider,
      providerAccountId: providerAccountId,
      name: name,
      email: email,
    });
}
export async function sendAplicationFormToApiServer(oauthProvider: string, providerAccountId: string, name: string, email: string) {
  // ตัวอย่างการยิงไป API ภายใน
  return await axiosPublicV2.post(`/oauth/register_with_oauth`,
    {
      oauthProvider: oauthProvider,
      providerAccountId: providerAccountId,
      name: name,
      email: email,
      roles: "freelancer"
    });
}
