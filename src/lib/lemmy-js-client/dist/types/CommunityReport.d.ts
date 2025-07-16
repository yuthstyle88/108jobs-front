import type { CommunityId } from "./CommunityId";
import type { CommunityReportId } from "./CommunityReportId";
import type { PersonId } from "./PersonId";
/**
 * A comment report.
 */
export type CommunityReport = {
    id: CommunityReportId;
    creatorId: PersonId;
    communityId: CommunityId;
    originalCommunityName: string;
    originalCommunityTitle: string;
    originalCommunityDescription?: string;
    originalCommunitySidebar?: string;
    originalCommunityIcon?: string;
    originalCommunityBanner?: string;
    reason: string;
    resolved: boolean;
    resolverId?: PersonId;
    publishedAt: string;
    updatedAt?: string;
};
