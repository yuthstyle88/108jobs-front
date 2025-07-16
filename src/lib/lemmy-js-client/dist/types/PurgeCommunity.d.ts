import type { CommunityId } from "./CommunityId";
/**
 * Purges a community from the database. This will delete all content attached to that community.
 */
export type PurgeCommunity = {
    communityId: CommunityId;
    reason?: string;
};
