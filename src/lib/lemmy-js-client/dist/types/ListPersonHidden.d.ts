import type { PaginationCursor } from "./PaginationCursor";
/**
 * Gets your hidden posts.
 */
export type ListPersonHidden = {
    page_cursor?: PaginationCursor;
    page_back?: boolean;
    limit?: number;
};
