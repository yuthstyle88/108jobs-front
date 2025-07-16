import type { DbUrl } from "./DbUrl";
import type { PersonId } from "./PersonId";
import type { PrivateMessageId } from "./PrivateMessageId";
/**
 * A private message.
 */
export type PrivateMessage = {
    id: PrivateMessageId;
    creatorId: PersonId;
    recipientId: PersonId;
    content: string;
    deleted: boolean;
    read: boolean;
    publishedAt: string;
    updatedAt?: string;
    apId: DbUrl;
    local: boolean;
    removed: boolean;
};
