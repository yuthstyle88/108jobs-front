import type { CommunityId } from "./CommunityId";
import type { CommunityVisibility } from "./CommunityVisibility";
import type { ModChangeCommunityVisibilityId } from "./ModChangeCommunityVisibilityId";
import type { PersonId } from "./PersonId";
export type ModChangeCommunityVisibility = {
    id: ModChangeCommunityVisibilityId;
    communityId: CommunityId;
    modPersonId: PersonId;
    publishedAt: string;
    visibility: CommunityVisibility;
};
