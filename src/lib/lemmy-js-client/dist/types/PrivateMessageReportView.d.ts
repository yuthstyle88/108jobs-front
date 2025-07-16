import type { Person } from "./Person";
import type { PrivateMessage } from "./PrivateMessage";
import type { PrivateMessageReport } from "./PrivateMessageReport";
/**
 * A private message report view.
 */
export type PrivateMessageReportView = {
    privateMessageReport: PrivateMessageReport;
    privateMessage: PrivateMessage;
    creator: Person;
    privateMessageCreator: Person;
    resolver?: Person;
};
