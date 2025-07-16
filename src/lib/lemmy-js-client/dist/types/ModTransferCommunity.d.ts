import type { CommunityId } from "./CommunityId";
import type { ModTransferCommunityId } from "./ModTransferCommunityId";
import type { PersonId } from "./PersonId";
/**
 * When a moderator transfers a community to a new owner.
 */
export type ModTransferCommunity = {
    id: ModTransferCommunityId;
    modPersonId: PersonId;
    otherPersonId: PersonId;
    communityId: CommunityId;
    publishedAt: string;
};
