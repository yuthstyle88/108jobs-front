import type { Person } from "./Person";
import type { PersonActions } from "./PersonActions";
/**
 * A person view.
 */
export type PersonView = {
    person: Person;
    isAdmin: boolean;
    personActions?: PersonActions;
    creatorBanned: boolean;
};
