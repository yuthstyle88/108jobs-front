import type { PrivateMessageId } from "./PrivateMessageId";
/**
 * Delete a private message.
 */
export type DeletePrivateMessage = {
    privateMessageId: PrivateMessageId;
    deleted: boolean;
};
