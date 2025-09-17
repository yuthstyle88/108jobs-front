import type { CommentId } from "./CommentId";

// Matches backend query with serde(rename_all = "camelCase")
export type GetBillingByCommentQuery = {
  commentId: CommentId;
};
