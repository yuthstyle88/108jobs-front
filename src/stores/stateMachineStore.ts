import { create } from "zustand";

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

// Concrete workflow implementation using the generic machine
export type WorkflowState = "new" | "queue" | "assign" | "accept" | "chat" | "review" | "pay";
export type WorkflowEvent =
  | { type: "QUOTE_PROPOSED"; by: "freelancer" | "employer" }
  | { type: "JOB_ASSIGNED" }
  | { type: "JOB_ACCEPTED" }
  | { type: "START_CHAT" }
  | { type: "SUBMIT_DELIVERY" }
  | { type: "REQUEST_REVISION" }
  | { type: "RELEASE_PAYMENT" }
  | { type: "SET"; state: WorkflowState };

export const ORDER = ["new", "queue", "assign", "accept", "chat", "review", "pay"] as const;

const WORKFLOW_TRANSITIONS: TransitionMap<typeof ORDER[number], Exclude<WorkflowEvent["type"], "SET">> = {
  new: { QUOTE_PROPOSED: "queue" },
  queue: { JOB_ASSIGNED: "assign" },
  assign: { JOB_ACCEPTED: "accept" },
  accept: { START_CHAT: "chat" },
  chat: { SUBMIT_DELIVERY: "review" },
  review: { RELEASE_PAYMENT: "pay", REQUEST_REVISION: "chat" },
  pay: {},
};

export const useStateMachineStore = createMachineStore(ORDER, WORKFLOW_TRANSITIONS, "new");

// Helper mapping functions for existing UI
export const statusToIndex = (s: WorkflowState): number => Math.max(0, ORDER.indexOf(s));
export const indexToStatus = (i: number): WorkflowState => ORDER[i] ?? "new";
