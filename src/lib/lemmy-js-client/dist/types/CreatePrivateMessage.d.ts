import type { PersonId } from "./PersonId";
/**
 * Create a private message.
 */
export type CreatePrivateMessage = {
    content: string;
    recipientId: PersonId;
};
