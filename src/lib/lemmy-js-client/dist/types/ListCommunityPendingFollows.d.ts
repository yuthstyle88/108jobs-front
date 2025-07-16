import type { PaginationCursor } from "./PaginationCursor";
export type ListCommunityPendingFollows = {
    /**
     * Only shows the unapproved applications
     */
    pendingOnly?: boolean;
    allCommunities?: boolean;
    pageCursor?: PaginationCursor;
    pageBack?: boolean;
    limit?: number;
};
