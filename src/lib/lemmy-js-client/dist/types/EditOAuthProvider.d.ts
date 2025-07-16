import type { OAuthProviderId } from "./OAuthProviderId";
/**
 * Edit an external auth method.
 */
export type EditOAuthProvider = {
    id: OAuthProviderId;
    displayName?: string;
    authorizationEndpoint?: string;
    tokenEndpoint?: string;
    userinfoEndpoint?: string;
    idClaim?: string;
    clientSecret?: string;
    scopes?: string;
    autoVerifyEmail?: boolean;
    accountLinkingEnabled?: boolean;
    usePkce?: boolean;
    enabled?: boolean;
};
