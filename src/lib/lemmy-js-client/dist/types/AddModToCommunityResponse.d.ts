import type { CommunityModeratorView } from "./CommunityModeratorView";
/**
 * The response of adding a moderator to a community.
 */
export type AddModToCommunityResponse = {
    moderators: Array<CommunityModeratorView>;
};
