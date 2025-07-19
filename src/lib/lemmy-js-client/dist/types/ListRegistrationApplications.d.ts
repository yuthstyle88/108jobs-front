import type { PaginationCursor } from "./PaginationCursor";
/**
 * Fetches a list of registration applications.
 */
export type ListRegistrationApplications = {
    /**
       * Only shows the unread applications (IE those without an admin actor)
       */
    unread_only?: boolean;
    page_cursor?: PaginationCursor;
    page_back?: boolean;
    limit?: number;
};
