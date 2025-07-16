import type { PaginationCursor } from "./PaginationCursor";
import type { ReportCombinedView } from "./ReportCombinedView";
/**
 * The post reports response.
 */
export type ListReportsResponse = {
    reports: Array<ReportCombinedView>;
    /**
     * the pagination cursor to use to fetch the next page
     */
    nextPage?: PaginationCursor;
    prevPage?: PaginationCursor;
};
