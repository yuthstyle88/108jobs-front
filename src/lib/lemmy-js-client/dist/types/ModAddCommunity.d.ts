import type { CommunityId } from "./CommunityId";
import type { ModAddCommunityId } from "./ModAddCommunityId";
import type { PersonId } from "./PersonId";
/**
 * When someone is added as a community moderator.
 */
export type ModAddCommunity = {
    id: ModAddCommunityId;
    modPersonId: PersonId;
    otherPersonId: PersonId;
    communityId: CommunityId;
    removed: boolean;
    publishedAt: string;
};
