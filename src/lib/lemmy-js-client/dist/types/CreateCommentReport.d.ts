import type { CommentId } from "./CommentId";
/**
 * Report a comment.
 */
export type CreateCommentReport = {
    commentId: CommentId;
    reason: string;
    violates_instance_rules?: boolean;
};
