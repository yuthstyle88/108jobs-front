import type { PaginationCursor } from "./PaginationCursor";
import type { VoteView } from "./VoteView";
/**
 * The post likes response
 */
export type ListPostLikesResponse = {
    postLikes: Array<VoteView>;
    /**
     * the pagination cursor to use to fetch the next page
     */
    next_page?: PaginationCursor;
    prev_page?: PaginationCursor;
};
