import type { ModBan } from "./ModBan";
import type { Person } from "./Person";
/**
 * When someone is banned from the site.
 */
export type ModBanView = {
    modBan: ModBan;
    moderator?: Person;
    otherPerson: Person;
};
