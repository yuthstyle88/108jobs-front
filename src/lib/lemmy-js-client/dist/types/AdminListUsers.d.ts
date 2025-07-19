import type { PaginationCursor } from "./PaginationCursor";
export type AdminListUsers = {
    banned_only?: boolean;
    page_cursor?: PaginationCursor;
    page_back?: boolean;
    limit?: number;
};
