import type { PersonId } from "./PersonId";
/**
 * Gets a person's details.
 *
 * Either person_id, or username are required.
 */
export type GetPersonDetails = {
    person_id?: PersonId;
    /**
     * Example: dessalines , or dessalines@xyz.tld
     */
    username?: string;
};
