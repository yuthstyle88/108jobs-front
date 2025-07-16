import type { PaginationCursor } from "./PaginationCursor";
import type { PersonContentType } from "./PersonContentType";
/**
 * Gets your saved posts and comments
 */
export type ListPersonSaved = {
    type?: PersonContentType;
    pageCursor?: PaginationCursor;
    pageBack?: boolean;
    limit?: number;
};
