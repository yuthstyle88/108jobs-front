import type { PaginationCursor } from "./PaginationCursor";
import type { PendingFollow } from "./PendingFollow";
export type ListCommunityPendingFollowsResponse = {
    items: Array<PendingFollow>;
    /**
     * the pagination cursor to use to fetch the next page
     */
    next_page?: PaginationCursor;
    prev_page?: PaginationCursor;
};
