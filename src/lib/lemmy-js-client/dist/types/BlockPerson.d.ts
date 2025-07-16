import type { PersonId } from "./PersonId";
/**
 * Block a person.
 */
export type BlockPerson = {
    personId: PersonId;
    block: boolean;
};
