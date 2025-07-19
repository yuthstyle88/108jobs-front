import type { PaginationCursor } from "./PaginationCursor";
import type { PersonContentCombinedView } from "./PersonContentCombinedView";
/**
 * A person's content response.
 */
export type ListPersonContentResponse = {
    content: Array<PersonContentCombinedView>;
    /**
     * the pagination cursor to use to fetch the next page
     */
    next_page?: PaginationCursor;
    prev_page?: PaginationCursor;
};
