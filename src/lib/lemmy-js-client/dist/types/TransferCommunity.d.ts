import type { CommunityId } from "./CommunityId";
import type { PersonId } from "./PersonId";
/**
 * Transfer a community to a new owner.
 */
export type TransferCommunity = {
    communityId: CommunityId;
    personId: PersonId;
};
