import type { InboxCombinedView } from "./InboxCombinedView";
import type { PaginationCursor } from "./PaginationCursor";
/**
 * Get your inbox (replies, comment mentions, post mentions, and messages)
 */
export type ListInboxResponse = {
    inbox: Array<InboxCombinedView>;
    /**
     * the pagination cursor to use to fetch the next page
     */
    nextPage?: PaginationCursor;
    prevPage?: PaginationCursor;
};
