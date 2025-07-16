import type { PersonId } from "./PersonId";
/**
 * Gets a person's details.
 *
 * Either personId, or username are required.
 */
export type GetPersonDetails = {
    personId?: PersonId;
    /**
     * Example: dessalines , or dessalines@xyz.tld
     */
    username?: string;
};
