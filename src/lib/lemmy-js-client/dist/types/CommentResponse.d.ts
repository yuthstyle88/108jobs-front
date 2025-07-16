import type { CommentView } from "./CommentView";
import type { LocalUserId } from "./LocalUserId";
/**
 * A comment response.
 */
export type CommentResponse = {
    commentView: CommentView;
    recipientIds: Array<LocalUserId>;
};
