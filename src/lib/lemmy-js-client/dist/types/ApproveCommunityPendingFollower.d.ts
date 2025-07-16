import type { CommunityId } from "./CommunityId";
import type { PersonId } from "./PersonId";
export type ApproveCommunityPendingFollower = {
    communityId: CommunityId;
    followerId: PersonId;
    approve: boolean;
};
