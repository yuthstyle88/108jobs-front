import type { PaginationCursor } from "./PaginationCursor";
import type { PersonContentType } from "./PersonContentType";
import type { PersonId } from "./PersonId";
/**
 * Gets a person's content (posts and comments)
 *
 * Either personId, or username are required.
 */
export type ListPersonContent = {
    type?: PersonContentType;
    personId?: PersonId;
    /**
     * Example: dessalines , or dessalines@xyz.tld
     */
    username?: string;
    pageCursor?: PaginationCursor;
    pageBack?: boolean;
    limit?: number;
};
