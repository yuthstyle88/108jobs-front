import type { PaginationCursor } from "./PaginationCursor";
/**
 * Gets your hidden posts.
 */
export type ListPersonHidden = {
    pageCursor?: PaginationCursor;
    pageBack?: boolean;
    limit?: number;
};
