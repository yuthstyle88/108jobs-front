import type { PaginationCursor } from "./PaginationCursor";
/**
 * Gets your read posts.
 */
export type ListPersonRead = {
    pageCursor?: PaginationCursor;
    pageBack?: boolean;
    limit?: number;
};
