import type { CommentSlimView } from "./CommentSlimView";
import type { PaginationCursor } from "./PaginationCursor";
/**
 * A slimmer comment list response, without the post or community.
 */
export type GetCommentsSlimResponse = {
    comments: Array<CommentSlimView>;
    next_page?: PaginationCursor;
    prev_page?: PaginationCursor;
};
