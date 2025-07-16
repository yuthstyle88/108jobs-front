import type { CommentId } from "./CommentId";
import type { PaginationCursor } from "./PaginationCursor";
/**
 * List comment likes. Admins-only.
 */
export type ListCommentLikes = {
    commentId: CommentId;
    pageCursor?: PaginationCursor;
    pageBack?: boolean;
    limit?: number;
};
