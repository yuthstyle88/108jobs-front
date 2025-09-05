import { useStateMachineStore, indexToStatus, type GenericMachineStore, type StateKey } from "@/stores/stateMachineStore";
import type { WorkflowState, WorkflowEvent } from "@/stores/stateMachineStore";

// Generic hook factory for any machine created via createMachineStore
export const createUseMachineHook = <S extends StateKey, E extends string>(
  useStore: () => GenericMachineStore<S, E>,
  indexToState: (i: number) => S
) => {
  return () => {
    // useStore() is itself a hook from zustand; select slices to avoid re-renders
    const state = (useStore() as any).state as S;
    const stepIndex = (useStore() as any).stepIndex as number;
    const set = (useStore() as any).set as (s: S) => void;
    const send = (useStore() as any).send as (e: { type: E } | { type: "SET"; state: S }) => void;
    const reset = (useStore() as any).reset as () => void;

    const setState = (s: S) => set(s);
    const setStepIndex = (i: number) => set(indexToState(i));

    return { state, currentStatus: state, stepIndex, setState, setStepIndex, send, reset } as const;
  };
};

// Backward-compatible workflow-specific hook
export type UseWorkflowMachine = {
  state: WorkflowState;
  currentStatus: WorkflowState;
  stepIndex: number;
  setState: (s: WorkflowState) => void;
  setStepIndex: (i: number) => void;
  send: (event: WorkflowEvent) => void;
  reset: () => void;
};

export const useWorkflowMachine = (): UseWorkflowMachine => {
  const state = useStateMachineStore((s) => s.state);
  const stepIndex = useStateMachineStore((s) => s.stepIndex);
  const set = useStateMachineStore((s) => s.set);
  const send = useStateMachineStore((s) => s.send);
  const reset = useStateMachineStore((s) => s.reset);

  const setState = (s: WorkflowState) => set(s);
  const setStepIndex = (i: number) => set(indexToStatus(i));

  return {
    state,
    currentStatus: state,
    stepIndex,
    setState,
    setStepIndex,
    send,
    reset,
  };
};
