import type { CommentId } from "./CommentId";
/**
 * Distinguish a comment (IE speak as moderator).
 */
export type DistinguishComment = {
    commentId: CommentId;
    distinguished: boolean;
};
