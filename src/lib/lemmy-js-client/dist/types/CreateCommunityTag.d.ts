import type { CommunityId } from "./CommunityId";
/**
 * Create a tag for a community.
 */
export type CreateCommunityTag = {
    communityId: CommunityId;
    displayName: string;
};
