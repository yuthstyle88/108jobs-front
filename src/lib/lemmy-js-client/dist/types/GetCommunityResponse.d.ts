import type { CommunityModeratorView } from "./CommunityModeratorView";
import type { CommunityView } from "./CommunityView";
import type { LanguageId } from "./LanguageId";
import type { Site } from "./Site";
/**
 * The community response.
 */
export type GetCommunityResponse = {
    communityView: CommunityView;
    site?: Site;
    moderators: Array<CommunityModeratorView>;
    discussionLanguages: Array<LanguageId>;
};
