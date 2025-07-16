import type { PrivateMessageId } from "./PrivateMessageId";
/**
 * Mark a private message as read.
 */
export type MarkPrivateMessageAsRead = {
    privateMessageId: PrivateMessageId;
    read: boolean;
};
