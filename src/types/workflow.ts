export enum WorkFlowStatus {
  QuotationPending = "QuotationPending",
  OrderApproved = "OrderApproved", 
  InProgress = "InProgress",
  PendingEmployerReview = "PendingEmployerReview",
  Completed = "Completed",
  Cancelled = "Cancelled"
}

export enum WorkFlowAction {
  SubmitQuotation = "SubmitQuotation",
  StartWork = "StartWork",
  SubmitFinishedWork = "SubmitFinishedWork",
  ApproveWork = "ApproveWork",
  SubmitRevision = "SubmitRevision",
  SubmitCancelled = "SubmitCancelled"
}

export interface Quote {
  id: string;
  amount: number;
  currency: string;
  dueDate: string;
  description: string;
  status: "pending" | "approved" | "rejected";
}

export interface WorkflowStep {
  id: number;
  name: string;
  status: "completed" | "current" | "pending" | "cancelled";
  date?: string;
}

export interface RevisionRequest {
  id: string;
  reason: string;
  requestedBy: "employer" | "freelancer";
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  currentStatus: WorkFlowStatus;
  quote?: Quote;
  revisions: RevisionRequest[];
  createdAt: string;
  updatedAt: string;
}

export type QuotationAttachment = {
  name: string;
  url: string;
  size?: number;    // bytes
  type?: string;    // mime
};

export type QuotationMilestone = {
  id?: string;
  title: string;
  amount: number;
  dueDate?: string; // ISO
  status?: "pending" | "done" | "paid";
};

export type QuotationParty = {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: string;
  taxId?: string;
};

export type WorkFlowStatusDetail =
  | "QuotationPending"
  | "OrderApproved"
  | "InProgress"
  | "PendingEmployerReview"
  | "Completed"
  | "Cancelled";

export type QuotationDetail = {
  id: string;
  code?: string;
  serviceTitle: string;
  description?: string;

  currency: string;         
  amount: number;            
  discountAmount?: number;   
  discountPct?: number;      
  taxPct?: number;           
  fees?: number;             
  netAmount?: number;        

  createdAt?: string;        
  issueDate?: string;        
  paymentDueDate?: string;   
  startDate?: string;        
  estimatedDays?: number;
  deliveryDate?: string;     

  escrow?: boolean;
  status?: WorkFlowStatus;
  buyer?: QuotationParty;
  seller?: QuotationParty;
  milestones?: QuotationMilestone[];
  attachments?: QuotationAttachment[];
  notes?: string;
  terms?: string;
};
