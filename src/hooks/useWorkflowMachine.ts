import {ORDER, UiFlowStatus, useStateMachineStore} from "@/stores/stateMachineStore";

// A stepper-friendly hook that mirrors the issue description API
export type StepperEvents = { type: 'NEXT' } | { type: 'BACK' } | { type: 'RESET' } | { type: 'CANCEL' };
export type UseWorkflowStepper = {
  state: { name: UiFlowStatus };
  ORDER: readonly UiFlowStatus[];
  idx: number;
  canNext: boolean;
  canBack: boolean;
  canCancel: boolean;
  canGo: (to: UiFlowStatus) => boolean;
  send: (e: StepperEvents) => void;
  cancel: () => void;
};

export const useWorkflowStepper = (): UseWorkflowStepper => {
  const state = useStateMachineStore((s) => s.state);
  const idx = useStateMachineStore((s) => s.stepIndex);
  const next = useStateMachineStore((s) => s.next);
  const back = useStateMachineStore((s) => s.back);
  const reset = useStateMachineStore((s) => s.reset);
  const sendEvent = useStateMachineStore((s) => s.send);

  const canNext = idx < ORDER.length - 1;
  const canBack = idx > 0;
  const canCancel = state !== "Completed" && state !== "Cancelled";
  const canGo = (to: UiFlowStatus) => {
    const toIdx = ORDER.indexOf(to as typeof ORDER[number]);
    if (toIdx < 0) return false;
    return toIdx === idx || Math.abs(toIdx - idx) === 1;
  };
  const send = (e: StepperEvents) => {
    if (e.type === 'NEXT') return next();
    if (e.type === 'BACK') return back();
    if (e.type === 'RESET') return reset();
    if (e.type === 'CANCEL') return sendEvent({ type: 'CANCEL' } as any);
  };
  const cancel = () => {
    if (!canCancel) return;
    sendEvent({ type: 'CANCEL' } as any);
  };
  return { state: { name: state }, ORDER, idx, canNext, canBack, canCancel, canGo, send, cancel };
};
