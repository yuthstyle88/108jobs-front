/**
 * Create an external auth method.
 */
export type CreateOAuthProvider = {
    displayName: string;
    issuer: string;
    authorizationEndpoint: string;
    tokenEndpoint: string;
    userinfoEndpoint: string;
    idClaim: string;
    clientId: string;
    clientSecret: string;
    scopes: string;
    autoVerifyEmail?: boolean;
    accountLinkingEnabled?: boolean;
    usePkce?: boolean;
    enabled?: boolean;
};
