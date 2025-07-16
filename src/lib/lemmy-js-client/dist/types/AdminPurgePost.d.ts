import type { AdminPurgePostId } from "./AdminPurgePostId";
import type { CommunityId } from "./CommunityId";
import type { PersonId } from "./PersonId";
/**
 * When an admin purges a post.
 */
export type AdminPurgePost = {
    id: AdminPurgePostId;
    adminPersonId: PersonId;
    communityId: CommunityId;
    reason?: string;
    publishedAt: string;
};
