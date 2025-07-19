import type { PaginationCursor } from "./PaginationCursor";
import type { Tagline } from "./Tagline";
/**
 * A response for taglines.
 */
export type ListTaglinesResponse = {
    taglines: Array<Tagline>;
    /**
     * the pagination cursor to use to fetch the next page
     */
    next_page?: PaginationCursor;
    prev_page?: PaginationCursor;
};
