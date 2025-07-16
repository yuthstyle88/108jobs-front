import type { PersonView } from "./PersonView";
/**
 * The response for banning a user from a community.
 */
export type BanFromCommunityResponse = {
    personView: PersonView;
    banned: boolean;
};
