import type { CommentId } from "./CommentId";
/**
 * Purges a comment from the database. This will delete all content attached to that comment.
 */
export type PurgeComment = {
    commentId: CommentId;
};
