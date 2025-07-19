import type { PaginationCursor } from "./PaginationCursor";
import type { VoteView } from "./VoteView";
/**
 * The comment likes response
 */
export type ListCommentLikesResponse = {
    commentLikes: Array<VoteView>;
    /**
     * the pagination cursor to use to fetch the next page
     */
    next_page?: PaginationCursor;
    prev_page?: PaginationCursor;
};
