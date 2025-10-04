import {ORDER, UiFlowStatus, useStateMachineStore} from '@/store/stateMachineStore';

// A stepper-friendly hook that mirrors the issue description API
export type StepperEvents = { type: 'NEXT' } | { type: 'BACK' } | { type: 'RESET' } | { type: 'CANCEL' };
export type UseWorkflowStepper = {
    state: { name: UiFlowStatus };
    statusBeforeCancel?: UiFlowStatus;
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
    const statusBeforeCancel = useStateMachineStore((s) => s.statusBeforeCancel);
    const idx = useStateMachineStore((s) => s.stepIndex);
    const next = useStateMachineStore((s) => s.next);
    const back = useStateMachineStore((s) => s.back);
    const reset = useStateMachineStore((s) => s.reset);
    const sendEvent = useStateMachineStore((s) => s.send);
    const cancelStore = useStateMachineStore((s) => s.cancel);

    const canNext = idx < ORDER.length - 1;
    const canBack = idx > 0;
    const canCancel = state !== 'Completed' && state !== 'Cancelled';
    const canGo = (to: UiFlowStatus) => {
        const toIdx = ORDER.indexOf(to);
        if (toIdx < 0) return false;
        return toIdx === idx || Math.abs(toIdx - idx) === 1;
    };

    const send = (e: StepperEvents) => {
        console.log('useWorkflowStepper send:', { event: e, state, statusBeforeCancel });
        if (e.type === 'NEXT') return next();
        if (e.type === 'BACK') return back();
        if (e.type === 'RESET') return reset();
        if (e.type === 'CANCEL') {
            if (!canCancel) {
                console.warn('useWorkflowStepper: Cannot cancel from state', { state });
                return;
            }
            sendEvent({ type: 'CANCEL' } as any);
        }
    };

    const cancel = () => {
        if (!canCancel) {
            console.warn('useWorkflowStepper cancel: Cannot cancel from state', { state });
            return;
        }
        console.log('useWorkflowStepper cancel:', { state, statusBeforeCancel });
        cancelStore();
    };

    return {
        state: { name: state },
        statusBeforeCancel,
        ORDER,
        idx,
        canNext,
        canBack,
        canCancel,
        canGo,
        send,
        cancel,
    };
};