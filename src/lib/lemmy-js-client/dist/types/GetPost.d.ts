import type { CommentId } from "./CommentId";
import type { PostId } from "./PostId";
/**
 * Get a post. Needs either the post id, or commentId.
 */
export type GetPost = {
    id?: PostId;
    commentId?: CommentId;
};
