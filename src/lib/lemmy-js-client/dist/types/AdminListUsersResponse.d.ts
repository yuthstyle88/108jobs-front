import type { LocalUserView } from "./LocalUserView";
import type { PaginationCursor } from "./PaginationCursor";
export type AdminListUsersResponse = {
    users: Array<LocalUserView>;
    /**
     * the pagination cursor to use to fetch the next page
     */
    nextPage?: PaginationCursor;
    prevPage?: PaginationCursor;
};
