import type { CommunityId } from "./CommunityId";
/**
 * Hide a community from the main view.
 */
export type HideCommunity = {
    communityId: CommunityId;
    hidden: boolean;
    reason?: string;
};
