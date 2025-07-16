import type { CommentId } from "./CommentId";
/**
 * Like a comment.
 */
export type CreateCommentLike = {
    commentId: CommentId;
    /**
     * Must be -1, 0, or 1 .
     */
    score: number;
};
