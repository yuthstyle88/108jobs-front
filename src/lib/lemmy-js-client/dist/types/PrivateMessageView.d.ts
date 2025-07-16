import type { Person } from "./Person";
import type { PrivateMessage } from "./PrivateMessage";
/**
 * A private message view.
 */
export type PrivateMessageView = {
    privateMessage: PrivateMessage;
    creator: Person;
    recipient: Person;
};
