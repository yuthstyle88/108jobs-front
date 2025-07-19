import type { PaginationCursor } from "./PaginationCursor";
import type { SearchCombinedView } from "./SearchCombinedView";
/**
 * The search response, containing lists of the return type possibilities
 */
export type SearchResponse = {
    results: Array<SearchCombinedView>;
    /**
     * the pagination cursor to use to fetch the next page
     */
    next_page?: PaginationCursor;
    prev_page?: PaginationCursor;
};
