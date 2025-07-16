import type { CommunityId } from "./CommunityId";
/**
 * Create a report for a community.
 */
export type CreateCommunityReport = {
    communityId: CommunityId;
    reason: string;
};
