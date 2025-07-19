import type { PersonId } from "./PersonId";
/**
 * Make a note for a person.
 *
 * An empty string deletes the note.
 */
export type NotePerson = {
    personId: PersonId;
};
