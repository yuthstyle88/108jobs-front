import type { PaginationCursor } from "./PaginationCursor";
import type { PersonLikedCombinedView } from "./PersonLikedCombinedView";
/**
 * Your liked posts response.
 */
export type ListPersonLikedResponse = {
    liked: Array<PersonLikedCombinedView>;
    /**
     * the pagination cursor to use to fetch the next page
     */
    next_page?: PaginationCursor;
    prev_page?: PaginationCursor;
};
