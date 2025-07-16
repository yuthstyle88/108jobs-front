import type { LocalUser } from "./LocalUser";
import type { Person } from "./Person";
/**
 * A local user view.
 */
export type LocalUserView = {
    localUser: LocalUser;
    person: Person;
    banned: boolean;
};
