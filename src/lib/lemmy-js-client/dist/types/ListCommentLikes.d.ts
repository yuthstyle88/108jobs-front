import type { CommentId } from "./CommentId";
import type { PaginationCursor } from "./PaginationCursor";
/**
 * List comment likes. Admins-only.
 */
export type ListCommentLikes = {
    commentId: CommentId;
    page_cursor?: PaginationCursor;
    page_back?: boolean;
    limit?: number;
};
