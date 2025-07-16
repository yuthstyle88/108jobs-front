import type { CommunityFollowerState } from "./CommunityFollowerState";
import type { MultiCommunityId } from "./MultiCommunityId";
import type { PersonId } from "./PersonId";
export type MultiCommunityFollow = {
    multiCommunityId: MultiCommunityId;
    personId: PersonId;
    followState: CommunityFollowerState;
};
