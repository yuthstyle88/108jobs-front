import type { PersonId } from "./PersonId";
/**
 * Adds an admin to a site.
 */
export type AddAdmin = {
    personId: PersonId;
    added: boolean;
};
