import type { PrivateMessageId } from "./PrivateMessageId";
/**
 * Create a report for a private message.
 */
export type CreatePrivateMessageReport = {
    privateMessageId: PrivateMessageId;
    reason: string;
};
