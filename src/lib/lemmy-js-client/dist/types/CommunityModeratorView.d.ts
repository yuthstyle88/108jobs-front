import type { Community } from "./Community";
import type { Person } from "./Person";
/**
 * A community moderator.
 */
export type CommunityModeratorView = {
    community: Community;
    moderator: Person;
};
