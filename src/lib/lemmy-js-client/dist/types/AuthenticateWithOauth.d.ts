import type { OAuthProviderId } from "./OAuthProviderId";
/**
 * Logging in with an OAuth 2.0 authorization
 */
export type AuthenticateWithOauth = {
    code: string;
    oauthProviderId: OAuthProviderId;
    redirectUri: string;
    show_nsfw?: boolean;
    /**
     * Username is mandatory at registration time
     */
    username?: string;
    /**
     * An answer is mandatory if require application is enabled on the server
     */
    answer?: string;
    pkce_code_verifier?: string;
};
