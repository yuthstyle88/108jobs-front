import type { Comment } from "./Comment";
import type { CommentActions } from "./CommentActions";
import type { Community } from "./Community";
import type { CommunityActions } from "./CommunityActions";
import type { InstanceActions } from "./InstanceActions";
import type { Person } from "./Person";
import type { PersonActions } from "./PersonActions";
import type { PersonCommentMention } from "./PersonCommentMention";
import type { Post } from "./Post";
/**
 * A person comment mention view.
 */
export type PersonCommentMentionView = {
    personCommentMention: PersonCommentMention;
    recipient: Person;
    comment: Comment;
    creator: Person;
    post: Post;
    community: Community;
    communityActions?: CommunityActions;
    commentActions?: CommentActions;
    personActions?: PersonActions;
    instanceActions?: InstanceActions;
    creatorIsAdmin: boolean;
    canMod: boolean;
    creatorBanned: boolean;
    creatorIsModerator: boolean;
    creatorBannedFromCommunity: boolean;
};
