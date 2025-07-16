import type { CommentId } from "./CommentId";
/**
 * Save / bookmark a comment.
 */
export type SaveComment = {
    commentId: CommentId;
    save: boolean;
};
