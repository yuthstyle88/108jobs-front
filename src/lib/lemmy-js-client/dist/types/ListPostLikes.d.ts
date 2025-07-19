import type { PaginationCursor } from "./PaginationCursor";
import type { PostId } from "./PostId";
/**
 * List post likes. Admins-only.
 */
export type ListPostLikes = {
    postId: PostId;
    page_cursor?: PaginationCursor;
    page_back?: boolean;
    limit?: number;
};
