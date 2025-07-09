import { API_ROUTES } from "@/api/endpoints";

export async function exchangePublicKey(exchange_key: string, token: string) {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL_V2}${API_ROUTES.auth.exchange_key}`,
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ exchange_key }),
            }
        );

        if (!response.ok) {
            throw new Error('Exchange token request failed');
        }

        const data = await response.json();

        return {
            publicKey: data.publicKey,
            session: data.session
        };
    } catch (error) {
        console.error('Token exchange error:', error);
        throw error;
    }
}
