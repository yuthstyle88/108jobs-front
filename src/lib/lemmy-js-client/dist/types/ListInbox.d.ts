import type { InboxDataType } from "./InboxDataType";
import type { PaginationCursor } from "./PaginationCursor";
/**
 * Get your inbox (replies, comment mentions, post mentions, and messages)
 */
export type ListInbox = {
    type?: InboxDataType;
    unreadOnly?: boolean;
    pageCursor?: PaginationCursor;
    pageBack?: boolean;
    limit?: number;
};
