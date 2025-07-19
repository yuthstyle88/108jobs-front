import type { PersonCommentMentionId } from "./PersonCommentMentionId";
/**
 * Mark a person mention as read.
 */
export type MarkPersonCommentMentionAsRead = {
    personCommentMentionId: PersonCommentMentionId;
    read: boolean;
};
