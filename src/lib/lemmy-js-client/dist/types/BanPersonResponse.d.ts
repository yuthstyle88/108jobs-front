import type { PersonView } from "./PersonView";
/**
 * A response for a banned person.
 */
export type BanPersonResponse = {
    personView: PersonView;
    banned: boolean;
};
