import type { LocalUserId } from "./LocalUserId";
import type { OAuthProviderId } from "./OAuthProviderId";
/**
 * An auth account method.
 */
export type OAuthAccount = {
    localUserId: LocalUserId;
    oauthProviderId: OAuthProviderId;
    oauthUserId: string;
    publishedAt: string;
    updated_at?: string;
};
