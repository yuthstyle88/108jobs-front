import type { CommentId } from "./CommentId";
/**
 * Remove a comment (only doable by mods).
 */
export type RemoveComment = {
    commentId: CommentId;
    removed: boolean;
    reason?: string;
};
