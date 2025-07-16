import type { PaginationCursor } from "./PaginationCursor";
export type AdminListUsers = {
    bannedOnly?: boolean;
    pageCursor?: PaginationCursor;
    pageBack?: boolean;
    limit?: number;
};
