import type { BillingId } from "./BillingId";
import type { PersonId } from "./PersonId";
import type { PostId } from "./PostId";
import type { CommentId } from "./CommentId";
import type { Coin } from "./Coin";
import type { BillingStatus } from "./BillingStatus";

// Mirrors backend Billing struct with camelCase keys
export type Billing = {
  id: BillingId;
  freelancerId: PersonId;
  employerId: PersonId;
  postId: PostId;
  commentId: CommentId;
  amount: Coin;
  description: string;
  status: BillingStatus;
  workDescription?: string | null;
  deliverableUrl?: string | null;
  createdAt: string; // ISO datetime
  updatedAt?: string | null; // ISO datetime
  paidAt?: string | null; // ISO datetime
};
