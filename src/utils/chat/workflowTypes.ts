import type { StatusKey } from '@/components/FreelanceChatFlow';

// Unified mapping for structured message type -> UI workflow status
export const TYPES_TO_STATUS: Record<string, StatusKey> = {
  'proposed-quote': 'QuotationPending',
  'employer-assigned': 'OrderApproved',
  'start-work': 'InProgress',
  'submit-delivery': 'PendingEmployerReview',
  'cancel-job': 'Cancelled',
  'delivery-accepted': 'Completed',
  'request-revision': 'InProgress',
} as const;
