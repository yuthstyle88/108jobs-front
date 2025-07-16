import type { Community } from "./Community";
import type { ModRemoveCommunity } from "./ModRemoveCommunity";
import type { Person } from "./Person";
/**
 * When a moderator removes a community.
 */
export type ModRemoveCommunityView = {
    modRemoveCommunity: ModRemoveCommunity;
    moderator?: Person;
    community: Community;
};
