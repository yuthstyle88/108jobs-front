import type { PaginationCursor } from "./PaginationCursor";
import type { PostId } from "./PostId";
/**
 * List post likes. Admins-only.
 */
export type ListPostLikes = {
    postId: PostId;
    pageCursor?: PaginationCursor;
    pageBack?: boolean;
    limit?: number;
};
