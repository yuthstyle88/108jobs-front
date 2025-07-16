import type { CommentId } from "./CommentId";
import type { CommentReplyId } from "./CommentReplyId";
import type { PersonId } from "./PersonId";
/**
 * A comment reply.
 */
export type CommentReply = {
    id: CommentReplyId;
    recipientId: PersonId;
    commentId: CommentId;
    read: boolean;
    publishedAt: string;
};
