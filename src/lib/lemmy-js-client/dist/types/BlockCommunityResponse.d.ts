import type { CommunityView } from "./CommunityView";
/**
 * The block community response.
 */
export type BlockCommunityResponse = {
    communityView: CommunityView;
    blocked: boolean;
};
