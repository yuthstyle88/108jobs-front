import type { AdminPurgeCommunityId } from "./AdminPurgeCommunityId";
import type { PersonId } from "./PersonId";
/**
 * When an admin purges a community.
 */
export type AdminPurgeCommunity = {
    id: AdminPurgeCommunityId;
    adminPersonId: PersonId;
    reason?: string;
    publishedAt: string;
};
