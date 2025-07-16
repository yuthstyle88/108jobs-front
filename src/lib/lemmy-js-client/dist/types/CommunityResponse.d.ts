import type { CommunityView } from "./CommunityView";
import type { LanguageId } from "./LanguageId";
/**
 * A simple community response.
 */
export type CommunityResponse = {
    communityView: CommunityView;
    discussionLanguages: Array<LanguageId>;
};
