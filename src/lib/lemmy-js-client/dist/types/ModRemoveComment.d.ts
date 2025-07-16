import type { CommentId } from "./CommentId";
import type { ModRemoveCommentId } from "./ModRemoveCommentId";
import type { PersonId } from "./PersonId";
/**
 * When a moderator removes a comment.
 */
export type ModRemoveComment = {
    id: ModRemoveCommentId;
    modPersonId: PersonId;
    commentId: CommentId;
    reason?: string;
    removed: boolean;
    publishedAt: string;
};
