import type { PaginationCursor } from "./PaginationCursor";
export type ListCommunityPendingFollows = {
    /**
       * Only shows the unapproved applications
       */
    pending_only?: boolean;
    all_communities?: boolean;
    page_cursor?: PaginationCursor;
    page_back?: boolean;
    limit?: number;
};
