import type { LocalImageView } from "./LocalImageView";
import type { PaginationCursor } from "./PaginationCursor";
export type ListMediaResponse = {
    images: Array<LocalImageView>;
    /**
     * the pagination cursor to use to fetch the next page
     */
    next_page?: PaginationCursor;
    prev_page?: PaginationCursor;
};
