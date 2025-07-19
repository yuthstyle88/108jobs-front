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
    auto_verify_email?: boolean;
    account_linking_enabled?: boolean;
    use_pkce?: boolean;
    enabled?: boolean;
};
