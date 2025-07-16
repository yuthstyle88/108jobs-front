import type { LikeType } from "./LikeType";
import type { PaginationCursor } from "./PaginationCursor";
import type { PersonContentType } from "./PersonContentType";
/**
 * Gets your liked / disliked posts
 */
export type ListPersonLiked = {
    type?: PersonContentType;
    likeType?: LikeType;
    pageCursor?: PaginationCursor;
    pageBack?: boolean;
    limit?: number;
};
