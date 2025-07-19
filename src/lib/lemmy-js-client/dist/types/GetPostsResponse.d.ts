import type { PaginationCursor } from "./PaginationCursor";
import type { PostView } from "./PostView";
/**
 * The post list response.
 */
export type GetPostsResponse = {
    posts: Array<PostView>;
    /**
     * the pagination cursor to use to fetch the next page
     */
    next_page?: PaginationCursor;
    prev_page?: PaginationCursor;
};
