import {create} from "zustand";
import type {WorkflowStatus} from "lemmy-js-client";

// Generic, reusable finite state machine store with typed states and events
export type StateKey = string | number | symbol;

export type TransitionMap<S extends StateKey, E extends string> = Record<S, Partial<Record<E, S>>>;

export interface GenericMachineStore<S extends StateKey, E extends string> {
  state: S;
  stepIndex: number;
  set: (state: S) => void;
  send: (event: { type: E } | { type: "SET"; state: S }) => void;
  // Stepper-style helpers
  next: () => void;
  back: () => void;
  reset: () => void;
}

export const createMachineStore = <S extends StateKey, E extends string>(
  order: readonly S[],
  transitions: TransitionMap<S, E>,
  initial: S
) => {
  const idx = (s: S) => Math.max(0, order.indexOf(s));
  return create<GenericMachineStore<S, E>>((set, get) => ({
    state: initial,
    stepIndex: idx(initial),
    set: (state) => set({ state, stepIndex: idx(state) }),
    send: (event) => {
      if (event.type === "SET") {
        set({ state: (event as any).state, stepIndex: idx((event as any).state) });
        return;
      }
      const current = get().state;
      const next = transitions[current]?.[event.type as E];
      if (next) {
        set({ state: next, stepIndex: idx(next) });
      }
    },
    next: () => {
      const current = get().state;
      const i = order.indexOf(current);
      if (i >= 0 && i < order.length - 1) {
        const ns = order[i + 1];
        set({ state: ns, stepIndex: idx(ns) });
      }
    },
    back: () => {
      const current = get().state;
      const i = order.indexOf(current);
      if (i > 0) {
        const ns = order[i - 1];
        set({ state: ns, stepIndex: idx(ns) });
      }
    },
    reset: () => set({ state: initial, stepIndex: idx(initial) }),
  }));
};

// Concrete workflow implementation using the generic machine per issue description
export type UiFlowStatus =
  | "QuotationPending"
  | "OrderApproved"
  | "InProgress"
  | "PendingEmployerReview"
  | "Completed"
  | "Cancelled";

export const ORDER = [
  "QuotationPending",
  "OrderApproved",
  "InProgress",
  "PendingEmployerReview",
  "Completed",
  "Cancelled",
] as const satisfies readonly UiFlowStatus[];
// Events reflect real transitions; no "chat" state
export type WorkflowEvent =
  | { type: "QUOTE_PROPOSED" }
  | { type: "APPROVE_ORDER" }
  | { type: "START_WORK" }
  | { type: "SUBMIT_DELIVERY" }
  | { type: "REQUEST_REVISION" }
  | { type: "RELEASE_PAYMENT" }
  | { type: "CANCEL" }
  | { type: "SET"; state: UiFlowStatus };

const WORKFLOW_TRANSITIONS: TransitionMap<UiFlowStatus, Exclude<WorkflowEvent["type"], "SET">> = {
  QuotationPending: { APPROVE_ORDER: "OrderApproved", CANCEL: "Cancelled" },
  OrderApproved: { START_WORK: "InProgress", CANCEL: "Cancelled" },
  InProgress: { SUBMIT_DELIVERY: "PendingEmployerReview", CANCEL: "Cancelled" },
  PendingEmployerReview: { REQUEST_REVISION: "InProgress", RELEASE_PAYMENT: "Completed", CANCEL: "Cancelled" },
  Completed: {},
  Cancelled: {},
};

export const useStateMachineStore = createMachineStore<UiFlowStatus, Exclude<WorkflowEvent["type"], "SET">>(
  ORDER,
  WORKFLOW_TRANSITIONS,
  "QuotationPending"
);

// Helper mapping functions bridging API <-> UI (identity mapping)
export const apiToUiStatus = (s: WorkflowStatus | null | undefined): UiFlowStatus =>
  (s as UiFlowStatus) ?? "QuotationPending";
