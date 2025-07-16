import type { AdminPurgeComment } from "./AdminPurgeComment";
import type { Person } from "./Person";
import type { Post } from "./Post";
/**
 * When an admin purges a comment.
 */
export type AdminPurgeCommentView = {
    adminPurgeComment: AdminPurgeComment;
    admin?: Person;
    post: Post;
};
