import type { PaginationCursor } from "./PaginationCursor";
import type { PostView } from "./PostView";
/**
 * You hidden posts response.
 */
export type ListPersonHiddenResponse = {
    hidden: Array<PostView>;
    /**
     * the pagination cursor to use to fetch the next page
     */
    next_page?: PaginationCursor;
    prev_page?: PaginationCursor;
};
