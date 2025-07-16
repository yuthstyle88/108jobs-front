import type { Community } from "./Community";
import type { CommunityFollowerState } from "./CommunityFollowerState";
import type { Person } from "./Person";
export type PendingFollow = {
    person: Person;
    community: Community;
    isNewInstance: boolean;
    followState?: CommunityFollowerState;
};
