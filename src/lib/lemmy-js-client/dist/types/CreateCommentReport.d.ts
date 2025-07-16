import type { CommentId } from "./CommentId";
/**
 * Report a comment.
 */
export type CreateCommentReport = {
    commentId: CommentId;
    reason: string;
    violatesInstanceRules?: boolean;
};
