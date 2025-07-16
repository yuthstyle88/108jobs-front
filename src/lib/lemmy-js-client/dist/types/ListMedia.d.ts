import type { PaginationCursor } from "./PaginationCursor";
/**
 * Get your user's image / media uploads.
 */
export type ListMedia = {
    pageCursor?: PaginationCursor;
    pageBack?: boolean;
    limit?: number;
};
