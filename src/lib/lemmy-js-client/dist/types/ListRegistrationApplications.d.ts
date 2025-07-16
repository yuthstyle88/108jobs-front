import type { PaginationCursor } from "./PaginationCursor";
/**
 * Fetches a list of registration applications.
 */
export type ListRegistrationApplications = {
    /**
     * Only shows the unread applications (IE those without an admin actor)
     */
    unreadOnly?: boolean;
    pageCursor?: PaginationCursor;
    pageBack?: boolean;
    limit?: number;
};
