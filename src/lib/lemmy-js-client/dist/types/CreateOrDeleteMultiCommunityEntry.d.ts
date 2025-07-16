import type { CommunityId } from "./CommunityId";
import type { MultiCommunityId } from "./MultiCommunityId";
export type CreateOrDeleteMultiCommunityEntry = {
    id: MultiCommunityId;
    communityId: CommunityId;
};
