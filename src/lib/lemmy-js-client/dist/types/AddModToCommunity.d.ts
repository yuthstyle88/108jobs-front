import type { CommunityId } from "./CommunityId";
import type { PersonId } from "./PersonId";
/**
 * Add a moderator to a community.
 */
export type AddModToCommunity = {
    communityId: CommunityId;
    personId: PersonId;
    added: boolean;
};
