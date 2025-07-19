import type { PaginationCursor } from "./PaginationCursor";
import type { PersonSavedCombinedView } from "./PersonSavedCombinedView";
/**
 * A person's saved content response.
 */
export type ListPersonSavedResponse = {
    saved: Array<PersonSavedCombinedView>;
    /**
     * the pagination cursor to use to fetch the next page
     */
    next_page?: PaginationCursor;
    prev_page?: PaginationCursor;
};
