import type { AdminPurgeCommentId } from "./AdminPurgeCommentId";
import type { PersonId } from "./PersonId";
import type { PostId } from "./PostId";
/**
 * When an admin purges a comment.
 */
export type AdminPurgeComment = {
    id: AdminPurgeCommentId;
    adminPersonId: PersonId;
    postId: PostId;
    reason?: string;
    publishedAt: string;
};
