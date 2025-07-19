import type { PaginationCursor } from "./PaginationCursor";
/**
 * Get your user's image / media uploads.
 */
export type ListMedia = {
    page_cursor?: PaginationCursor;
    page_back?: boolean;
    limit?: number;
};
