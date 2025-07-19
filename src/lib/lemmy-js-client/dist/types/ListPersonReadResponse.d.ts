import type { PaginationCursor } from "./PaginationCursor";
import type { PostView } from "./PostView";
/**
 * You read posts response.
 */
export type ListPersonReadResponse = {
    read: Array<PostView>;
    /**
     * the pagination cursor to use to fetch the next page
     */
    next_page?: PaginationCursor;
    prev_page?: PaginationCursor;
};
