import type { Comment } from "./Comment";
import type { Community } from "./Community";
import type { ModRemoveComment } from "./ModRemoveComment";
import type { Person } from "./Person";
import type { Post } from "./Post";
/**
 * When a moderator removes a comment.
 */
export type ModRemoveCommentView = {
    modRemoveComment: ModRemoveComment;
    moderator?: Person;
    otherPerson: Person;
    comment: Comment;
    post: Post;
    community: Community;
};
