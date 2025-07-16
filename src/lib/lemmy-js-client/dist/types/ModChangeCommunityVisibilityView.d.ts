import type { Community } from "./Community";
import type { ModChangeCommunityVisibility } from "./ModChangeCommunityVisibility";
import type { Person } from "./Person";
/**
 * When the visibility of a community is changed
 */
export type ModChangeCommunityVisibilityView = {
    modChangeCommunityVisibility: ModChangeCommunityVisibility;
    moderator?: Person;
    community: Community;
};
