import type { Community } from "./Community";
import type { ModAddCommunity } from "./ModAddCommunity";
import type { Person } from "./Person";
/**
 * When someone is added as a community moderator.
 */
export type ModAddCommunityView = {
    modAddCommunity: ModAddCommunity;
    moderator?: Person;
    community: Community;
    otherPerson: Person;
};
