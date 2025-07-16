import type { PrivateMessageId } from "./PrivateMessageId";
/**
 * Edit a private message.
 */
export type EditPrivateMessage = {
    privateMessageId: PrivateMessageId;
    content: string;
};
