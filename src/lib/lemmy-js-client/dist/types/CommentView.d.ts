import type { Comment } from "./Comment";
import type { CommentActions } from "./CommentActions";
import type { Community } from "./Community";
import type { CommunityActions } from "./CommunityActions";
import type { InstanceActions } from "./InstanceActions";
import type { Person } from "./Person";
import type { PersonActions } from "./PersonActions";
import type { Post } from "./Post";
import type { TagsView } from "./TagsView";
/**
 * A comment view.
 */
export type CommentView = {
    comment: Comment;
    creator: Person;
    post: Post;
    community: Community;
    community_actions?: CommunityActions;
    comment_actions?: CommentActions;
    person_actions?: PersonActions;
    instance_actions?: InstanceActions;
    creatorIsAdmin: boolean;
    postTags: TagsView;
    canMod: boolean;
    creatorBanned: boolean;
    creatorIsModerator: boolean;
    creatorBannedFromCommunity: boolean;
};
