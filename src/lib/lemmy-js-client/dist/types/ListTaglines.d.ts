import type { PaginationCursor } from "./PaginationCursor";
/**
 * Fetches a list of taglines.
 */
export type ListTaglines = {
    page_cursor?: PaginationCursor;
    page_back?: boolean;
    limit?: number;
};
