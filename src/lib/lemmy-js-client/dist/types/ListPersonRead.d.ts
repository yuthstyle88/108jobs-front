import type { PaginationCursor } from "./PaginationCursor";
/**
 * Gets your read posts.
 */
export type ListPersonRead = {
    page_cursor?: PaginationCursor;
    page_back?: boolean;
    limit?: number;
};
