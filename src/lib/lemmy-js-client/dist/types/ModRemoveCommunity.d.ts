import type { CommunityId } from "./CommunityId";
import type { ModRemoveCommunityId } from "./ModRemoveCommunityId";
import type { PersonId } from "./PersonId";
/**
 * When a moderator removes a community.
 */
export type ModRemoveCommunity = {
    id: ModRemoveCommunityId;
    modPersonId: PersonId;
    communityId: CommunityId;
    reason?: string;
    removed: boolean;
    publishedAt: string;
};
