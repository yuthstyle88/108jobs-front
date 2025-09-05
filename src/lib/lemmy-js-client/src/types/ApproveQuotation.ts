import type { BillingId } from "./BillingId";
import type { WalletId } from "./WalletId";
import type { WorkflowId } from "./WorkflowId";

// Matches backend ApproveQuotation with camelCase
export type ApproveQuotation = {
  seqNumber: number; // i16 backend
  billingId: BillingId;
  walletId: WalletId;
  workflowId: WorkflowId;
};
