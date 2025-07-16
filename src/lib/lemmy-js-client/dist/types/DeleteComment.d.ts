import type { CommentId } from "./CommentId";
/**
 * Delete your own comment.
 */
export type DeleteComment = {
    commentId: CommentId;
    deleted: boolean;
};
