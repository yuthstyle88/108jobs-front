import type { PaginationCursor } from "./PaginationCursor";
import type { PersonContentType } from "./PersonContentType";
import type { PersonId } from "./PersonId";
/**
 * Gets a person's content (posts and comments)
 *
 * Either person_id, or username are required.
 */
export type ListPersonContent = {
    type_?: PersonContentType;
    person_id?: PersonId;
    /**
     * Example: dessalines , or dessalines@xyz.tld
     */
    username?: string;
    page_cursor?: PaginationCursor;
    page_back?: boolean;
    limit?: number;
};
