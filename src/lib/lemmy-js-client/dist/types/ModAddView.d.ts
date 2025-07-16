import type { ModAdd } from "./ModAdd";
import type { Person } from "./Person";
/**
 * When someone is added as a site moderator.
 */
export type ModAddView = {
    modAdd: ModAdd;
    moderator?: Person;
    otherPerson: Person;
};
