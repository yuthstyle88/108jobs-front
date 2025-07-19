import type { PaginationCursor } from "./PaginationCursor";
import type { PersonContentType } from "./PersonContentType";
/**
 * Gets your saved posts and comments
 */
export type ListPersonSaved = {
    type_?: PersonContentType;
    page_cursor?: PaginationCursor;
    page_back?: boolean;
    limit?: number;
};
