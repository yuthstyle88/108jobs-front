import type { OAuthProviderId } from "./OAuthProviderId";
/**
 * Edit an external auth method.
 */
export type EditOAuthProvider = {
    id: OAuthProviderId;
    display_name?: string;
    authorization_endpoint?: string;
    token_endpoint?: string;
    userinfo_endpoint?: string;
    id_claim?: string;
    client_secret?: string;
    scopes?: string;
    auto_verify_email?: boolean;
    account_linking_enabled?: boolean;
    use_pkce?: boolean;
    enabled?: boolean;
};
