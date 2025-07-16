import type { CommunityReportId } from "./CommunityReportId";
/**
 * Resolve a community report.
 */
export type ResolveCommunityReport = {
    reportId: CommunityReportId;
    resolved: boolean;
};
