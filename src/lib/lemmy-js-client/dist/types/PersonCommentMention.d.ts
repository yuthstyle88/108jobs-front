import type { CommentId } from "./CommentId";
import type { PersonCommentMentionId } from "./PersonCommentMentionId";
import type { PersonId } from "./PersonId";
/**
 * A person mention.
 */
export type PersonCommentMention = {
    id: PersonCommentMentionId;
    recipientId: PersonId;
    commentId: CommentId;
    read: boolean;
    publishedAt: string;
};
