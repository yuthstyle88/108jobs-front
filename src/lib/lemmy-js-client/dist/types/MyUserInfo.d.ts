import type { Community } from "./Community";
import type { CommunityFollowerView } from "./CommunityFollowerView";
import type { CommunityModeratorView } from "./CommunityModeratorView";
import type { Instance } from "./Instance";
import type { LanguageId } from "./LanguageId";
import type { LocalUserView } from "./LocalUserView";
import type { Person } from "./Person";
/**
 * Your user info.
 */
export type MyUserInfo = {
    localUserView: LocalUserView;
    follows: Array<CommunityFollowerView>;
    moderates: Array<CommunityModeratorView>;
    communityBlocks: Array<Community>;
    instanceBlocks: Array<Instance>;
    personBlocks: Array<Person>;
    keywordBlocks: Array<string>;
    discussionLanguages: Array<LanguageId>;
};
