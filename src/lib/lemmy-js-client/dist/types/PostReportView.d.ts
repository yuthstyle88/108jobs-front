import type { Community } from "./Community";
import type { CommunityActions } from "./CommunityActions";
import type { Person } from "./Person";
import type { PersonActions } from "./PersonActions";
import type { Post } from "./Post";
import type { PostActions } from "./PostActions";
import type { PostReport } from "./PostReport";
/**
 * A post report view.
 */
export type PostReportView = {
    postReport: PostReport;
    post: Post;
    community: Community;
    creator: Person;
    postCreator: Person;
    community_actions?: CommunityActions;
    post_actions?: PostActions;
    person_actions?: PersonActions;
    resolver?: Person;
    creatorIsAdmin: boolean;
    creatorIsModerator: boolean;
    creatorBanned: boolean;
    creatorBannedFromCommunity: boolean;
};
