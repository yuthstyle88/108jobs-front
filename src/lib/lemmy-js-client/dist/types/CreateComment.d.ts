import type { CommentId } from "./CommentId";
import type { LanguageId } from "./LanguageId";
import type { PostId } from "./PostId";
/**
 * Create a comment.
 */
export type CreateComment = {
    content: string;
    postId: PostId;
    parent_id?: CommentId;
    language_id?: LanguageId;
};
