import type { PersonId } from "./PersonId";
import type { PrivateMessageId } from "./PrivateMessageId";
import type { PrivateMessageReportId } from "./PrivateMessageReportId";
/**
 * The private message report.
 */
export type PrivateMessageReport = {
    id: PrivateMessageReportId;
    creatorId: PersonId;
    privateMessageId: PrivateMessageId;
    /**
     * The original text.
     */
    originalPmText: string;
    reason: string;
    resolved: boolean;
    resolver_id?: PersonId;
    publishedAt: string;
    updated_at?: string;
};
