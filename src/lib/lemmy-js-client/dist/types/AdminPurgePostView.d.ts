import type { AdminPurgePost } from "./AdminPurgePost";
import type { Community } from "./Community";
import type { Person } from "./Person";
/**
 * When an admin purges a post.
 */
export type AdminPurgePostView = {
    adminPurgePost: AdminPurgePost;
    admin?: Person;
    community: Community;
};
