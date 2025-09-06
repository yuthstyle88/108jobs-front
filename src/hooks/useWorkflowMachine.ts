import { useStateMachineStore, ORDER, UiFlowStatus } from "@/stores/stateMachineStore";

// A stepper-friendly hook that mirrors the issue description API
export type StepperEvents = { type: 'NEXT' } | { type: 'BACK' } | { type: 'RESET' };
export type UseWorkflowStepper = {
  state: { name: UiFlowStatus };
  ORDER: readonly UiFlowStatus[];
  idx: number;
  canNext: boolean;
  canBack: boolean;
  canGo: (to: UiFlowStatus) => boolean;
  send: (e: StepperEvents) => void;
};

export const useWorkflowStepper = (): UseWorkflowStepper => {
  const state = useStateMachineStore((s) => s.state);
  const idx = useStateMachineStore((s) => s.stepIndex);
  const next = useStateMachineStore((s) => s.next);
  const back = useStateMachineStore((s) => s.back);
  const reset = useStateMachineStore((s) => s.reset);

  const canNext = idx < ORDER.length - 1;
  const canBack = idx > 0;
  const canGo = (to: UiFlowStatus) => {
    const toIdx = ORDER.indexOf(to);
    return toIdx === idx || Math.abs(toIdx - idx) === 1;
  };
  const send = (e: StepperEvents) => {
    if (e.type === 'NEXT') return next();
    if (e.type === 'BACK') return back();
    if (e.type === 'RESET') return reset();
  };
  return { state: { name: state }, ORDER, idx, canNext, canBack, canGo, send };
};
