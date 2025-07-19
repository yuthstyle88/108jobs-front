import type { Comment } from "./Comment";
import type { CommentActions } from "./CommentActions";
import type { InstanceActions } from "./InstanceActions";
import type { Person } from "./Person";
import type { PersonActions } from "./PersonActions";
/**
 * A slimmer comment view, without the post, or community.
 */
export type CommentSlimView = {
    comment: Comment;
    creator: Person;
    comment_actions?: CommentActions;
    person_actions?: PersonActions;
    instance_actions?: InstanceActions;
    creatorIsAdmin: boolean;
    canMod: boolean;
    creatorBanned: boolean;
    creatorIsModerator: boolean;
    creatorBannedFromCommunity: boolean;
};
