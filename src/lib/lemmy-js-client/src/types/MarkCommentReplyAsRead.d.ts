import type { CommentReplyId } from "./CommentReplyId";
/**
 * Mark a comment reply as read.
 */
export type MarkCommentReplyAsRead = {
    commentReplyId: CommentReplyId;
    read: boolean;
};
