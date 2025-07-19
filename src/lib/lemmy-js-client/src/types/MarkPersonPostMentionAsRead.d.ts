import type { PersonPostMentionId } from "./PersonPostMentionId";
/**
 * Mark a person mention as read.
 */
export type MarkPersonPostMentionAsRead = {
    personPostMentionId: PersonPostMentionId;
    read: boolean;
};
