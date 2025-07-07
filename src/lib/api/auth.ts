import { API_ROUTES } from "@/api/endpoints";

export async function exchangeToken(exchange_key: string) {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}${API_ROUTES.auth.exchange_key}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
        };
    } catch (error) {
        console.error('Token exchange error:', error);
        throw error;
    }
}
