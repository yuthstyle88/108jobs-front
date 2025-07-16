import type { CommentId } from "./CommentId";
import type { CommentSortType } from "./CommentSortType";
import type { CommunityId } from "./CommunityId";
import type { ListingType } from "./ListingType";
import type { PaginationCursor } from "./PaginationCursor";
import type { PostId } from "./PostId";
/**
 * Get a list of comments.
 */
export type GetComments = {
    type?: ListingType;
    sort?: CommentSortType;
    /**
     * Filter to within a given time range, in seconds.
     * IE 60 would give results for the past minute.
     */
    timeRangeSeconds?: number;
    maxDepth?: number;
    pageCursor?: PaginationCursor;
    pageBack?: boolean;
    limit?: number;
    communityId?: CommunityId;
    communityName?: string;
    postId?: PostId;
    parentId?: CommentId;
};
