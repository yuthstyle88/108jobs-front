import type { PersonId } from "./PersonId";
/**
 * Purges a person from the database. This will delete all content attached to that person.
 */
export type PurgePerson = {
    personId: PersonId;
};
