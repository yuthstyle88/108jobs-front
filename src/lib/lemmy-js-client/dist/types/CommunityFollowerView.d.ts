import type { Community } from "./Community";
import type { Person } from "./Person";
/**
 * A community follower.
 */
export type CommunityFollowerView = {
    community: Community;
    follower: Person;
};
