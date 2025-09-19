import type { WorkflowId } from "./WorkflowId";
import type { CommentId } from "./CommentId";

// Matches backend ApproveWorkForm with camelCase fields
export type ApproveWorkForm = {
  seqNumber: number; // i16 backend
  workflowId: WorkflowId;
  commentId: CommentId;
};
