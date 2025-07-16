import type { Community } from "./Community";
import type { ModBanFromCommunity } from "./ModBanFromCommunity";
import type { Person } from "./Person";
/**
 * When someone is banned from a community.
 */
export type ModBanFromCommunityView = {
    modBanFromCommunity: ModBanFromCommunity;
    moderator?: Person;
    community: Community;
    otherPerson: Person;
};
