import type { WorkflowId } from "./WorkflowId";

// Matches backend CancelJobForm with camelCase fields
// #[serde(rename_all = "camelCase")]
// pub struct CancelJobForm { seq_number: i16, workflow_id: WorkflowId, reason: Option<String> }
export type CancelJobForm = {
  seqNumber: number; // i16 backend
  workflowId: WorkflowId;
  reason?: string;
};
