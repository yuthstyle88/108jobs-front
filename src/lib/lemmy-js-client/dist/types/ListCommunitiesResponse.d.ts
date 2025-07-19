import type { CommunityView } from "./CommunityView";
import type { PaginationCursor } from "./PaginationCursor";
/**
 * The response for listing communities.
 */
export type ListCommunitiesResponse = {
    communities: Array<CommunityView>;
    /**
     * the pagination cursor to use to fetch the next page
     */
    next_page?: PaginationCursor;
    prev_page?: PaginationCursor;
};
