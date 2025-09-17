/**
 * Resolves the workflow id from available sources while preserving existing behavior.
 *
 * Priority order (first non-nullish wins):
 *  1) workflowIdState
 *  2) roomData.room.workflow.id
 *  3) roomData.workflow.id
 *  4) roomData.room.workflowId
 *  5) roomData.workflowId
 *
 * The chosen candidate is then coerced with Number(). If the result is falsy or NaN,
 * undefined is returned. This intentionally treats 0 as invalid (falsy), matching
 * the current implementation.
 */
export function resolveWorkflowId(roomData: any, workflowIdState: any): number | undefined {
  const candidate = (workflowIdState as any)
    ?? (roomData as any)?.room?.workflow?.id
    ?? (roomData as any)?.workflow?.id
    ?? (roomData as any)?.room?.workflowId
    ?? (roomData as any)?.workflowId;

  const num = Number(candidate);
  const workflowId = num && !Number.isNaN(num) ? num : undefined;
  return workflowId;
}
