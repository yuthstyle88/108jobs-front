import type { CommentId } from "./CommentId";
import type { LanguageId } from "./LanguageId";
/**
 * Edit a comment.
 */
export type EditComment = {
    commentId: CommentId;
    content?: string;
    language_id?: LanguageId;
};
