import type { ModlogCombinedView } from "./ModlogCombinedView";
import type { PaginationCursor } from "./PaginationCursor";
/**
 * The modlog fetch response.
 */
export type GetModlogResponse = {
    modlog: Array<ModlogCombinedView>;
    /**
     * the pagination cursor to use to fetch the next page
     */
    nextPage?: PaginationCursor;
    prevPage?: PaginationCursor;
};
