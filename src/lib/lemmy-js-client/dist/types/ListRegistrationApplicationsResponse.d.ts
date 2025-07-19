import type { PaginationCursor } from "./PaginationCursor";
import type { RegistrationApplicationView } from "./RegistrationApplicationView";
/**
 * The list of registration applications.
 */
export type ListRegistrationApplicationsResponse = {
    registrationApplications: Array<RegistrationApplicationView>;
    /**
     * the pagination cursor to use to fetch the next page
     */
    next_page?: PaginationCursor;
    prev_page?: PaginationCursor;
};
