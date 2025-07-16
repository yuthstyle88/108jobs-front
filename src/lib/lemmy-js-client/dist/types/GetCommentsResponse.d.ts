import type { CommentView } from "./CommentView";
import type { PaginationCursor } from "./PaginationCursor";
/**
 * The comment list response.
 */
export type GetCommentsResponse = {
    comments: Array<CommentView>;
    nextPage?: PaginationCursor;
    prevPage?: PaginationCursor;
};
