import type { CommunityId } from "./CommunityId";
import type { PaginationCursor } from "./PaginationCursor";
import type { PostId } from "./PostId";
import type { ReportType } from "./ReportType";
/**
 * List reports.
 */
export type ListReports = {
    /**
     * Only shows the unresolved reports
     */
    unresolvedOnly?: boolean;
    /**
     * Filter the type of report.
     */
    type?: ReportType;
    /**
     * Filter by the post id. Can return either comment or post reports.
     */
    postId?: PostId;
    /**
     * if no community is given, it returns reports for all communities moderated by the auth user
     */
    communityId?: CommunityId;
    pageCursor?: PaginationCursor;
    pageBack?: boolean;
    limit?: number;
    /**
     * Only for admins: also show reports with `violatesInstanceRules=false`
     */
    showCommunityRuleViolations?: boolean;
    /**
     * If true, view all your created reports. Works for non-admins/mods also.
     */
    myReportsOnly?: boolean;
};
