import type { PrivateMessageReportId } from "./PrivateMessageReportId";
/**
 * Resolve a private message report.
 */
export type ResolvePrivateMessageReport = {
    reportId: PrivateMessageReportId;
    resolved: boolean;
};
