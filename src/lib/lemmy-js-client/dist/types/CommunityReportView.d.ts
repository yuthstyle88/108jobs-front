import type { Community } from "./Community";
import type { CommunityReport } from "./CommunityReport";
import type { Person } from "./Person";
/**
 * A community report view.
 */
export type CommunityReportView = {
    communityReport: CommunityReport;
    community: Community;
    creator: Person;
    resolver?: Person;
    creatorIsAdmin: boolean;
    creatorIsModerator: boolean;
    creatorBanned: boolean;
    creatorBannedFromCommunity: boolean;
};
