import type { Community } from "./Community";
import type { ModTransferCommunity } from "./ModTransferCommunity";
import type { Person } from "./Person";
/**
 * When a moderator transfers a community to a new owner.
 */
export type ModTransferCommunityView = {
    modTransferCommunity: ModTransferCommunity;
    moderator?: Person;
    community: Community;
    otherPerson: Person;
};
