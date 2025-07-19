import type { CommentId } from "./CommentId";
import type { PostId } from "./PostId";
/**
 * Get a post. Needs either the post id, or comment_id.
 */
export type GetPost = {
    id?: PostId;
    comment_id?: CommentId;
};
