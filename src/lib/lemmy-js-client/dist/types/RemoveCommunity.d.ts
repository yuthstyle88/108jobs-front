import type { CommunityId } from "./CommunityId";
/**
 * Remove a community (only doable by moderators).
 */
export type RemoveCommunity = {
    communityId: CommunityId;
    removed: boolean;
    reason?: string;
};
