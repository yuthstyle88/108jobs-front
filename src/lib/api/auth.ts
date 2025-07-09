import {API_ROUTES} from "@/api/endpoints";
import {axiosPrivate} from "@/lib/axios";

interface ExchangeKeyResponse {
    publicKey: string;
}

export async function exchangePublicKey(public_key: string) {
    try {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL_V2;
        if (!base) {
            throw new Error("❌ NEXT_PUBLIC_API_BASE_URL_V2 is not set");
        }

        const url = `${base}${API_ROUTES.auth.exchange_key}`;

        const response = await axiosPrivate.post<ExchangeKeyResponse>(url, {
            public_key,
        });


        if (response.status !== 200) {
            throw new Error("Exchange token request failed");
        }

        return response.data;
    } catch (error) {
        console.error('Token exchange error:', error);
        throw error;
    }
}
