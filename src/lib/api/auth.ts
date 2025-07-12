import {API_ROUTES} from "@/api/endpoints";
import {axiosPublicV2} from "@/lib/axios";

interface ExchangeKeyResponse {
    public_key: string;
}

export async function exchangePublicKey(public_key: string, token: string) {
    try {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL_V2;
        if (!base) {
            throw new Error("❌ NEXT_PUBLIC_API_BASE_URL_V2 is not set");
        }

        const url = `${base}${API_ROUTES.auth.exchange_key}`;

        const response = await fetch(url,    
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    public_key: public_key,
                })
            },
        );

        if (!response.ok) {
            throw new Error("Exchange token request failed");
        }

        const data = await response.json() as ExchangeKeyResponse;
        return data.public_key;
    } catch (error) {
        console.error('Token exchange error:', error);
        throw error;
    }
}

export async function sendTokenToApiServer(userId: string, name: string, email: string, accessToken: string) {
    await axiosPublicV2.post(`/api/v4/auth/authorize`,
      {
          userId: userId,
          name: name,
          email: email,
          accessToken: accessToken
      });
}
