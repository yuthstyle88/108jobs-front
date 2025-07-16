import type { PaginationCursor } from "./PaginationCursor";
/**
 * Fetches a list of taglines.
 */
export type ListTaglines = {
    pageCursor?: PaginationCursor;
    pageBack?: boolean;
    limit?: number;
};
