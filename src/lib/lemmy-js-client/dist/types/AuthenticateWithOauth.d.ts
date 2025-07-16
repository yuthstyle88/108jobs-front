import type { OAuthProviderId } from "./OAuthProviderId";
/**
 * Logging in with an OAuth 2.0 authorization
 */
export type AuthenticateWithOauth = {
    code: string;
    oauthProviderId: OAuthProviderId;
    redirectUri: string;
    /**
     * Username is mandatory at registration time
     */
    name?: string;
    email?: string;
    /**
     * An answer is mandatory if require application is enabled on the server
     */
    answer?: string;
    pkceCodeVerifier?: string;
};
