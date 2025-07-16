import type { CommunitySortType } from "./CommunitySortType";
import type { ListingType } from "./ListingType";
import type { PaginationCursor } from "./PaginationCursor";
/**
 * Fetches a list of communities.
 */
export type ListCommunities = {
    type?: ListingType;
    sort?: CommunitySortType;
    /**
     * Filter to within a given time range, in seconds.
     * IE 60 would give results for the past minute.
     */
    timeRangeSeconds?: number;
    showNsfw?: boolean;
    pageCursor?: PaginationCursor;
    pageBack?: boolean;
    limit?: number;
};
