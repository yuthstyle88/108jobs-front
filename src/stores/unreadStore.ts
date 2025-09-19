import { create } from "zustand";

// Lightweight unread store with persistence and batching
export type UnreadState = {
  perRoom: Record<string, number>;
  pending: Record<string, number>; // deltas to flush
  lastFlushAt?: number;
  // selectors
  total: number;
  // actions
  inc: (roomId: string, by?: number) => void;
  reset: (roomId: string) => void;
  hydrate: (snapshot: Record<string, number>) => void;
  clearAll: () => void;
  markSeen: (roomId: string) => void;
};

const STORAGE_KEY = "chat_unread_v1";

function loadPersisted(): Pick<UnreadState, "perRoom" | "pending" | "lastFlushAt"> {
  if (typeof window === "undefined") return { perRoom: {}, pending: {}, lastFlushAt: undefined };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { perRoom: {}, pending: {}, lastFlushAt: undefined };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return { perRoom: {}, pending: {}, lastFlushAt: undefined };
    return {
      perRoom: parsed.perRoom || {},
      pending: parsed.pending || {},
      lastFlushAt: parsed.lastFlushAt || undefined,
    };
  } catch {
    return { perRoom: {}, pending: {}, lastFlushAt: undefined };
  }
}

function persist(state: Pick<UnreadState, "perRoom" | "pending" | "lastFlushAt">) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export const useUnreadStore = create<UnreadState>((set, get) => {
  const initial = loadPersisted();
  const totalInitial = Object.values(initial.perRoom).reduce((a, b) => a + (b || 0), 0);
  return {
    perRoom: initial.perRoom,
    pending: initial.pending,
    lastFlushAt: initial.lastFlushAt,
    total: totalInitial,
    inc: (roomId: string, by: number = 1) => {
      set((s) => {
        const cur = s.perRoom[roomId] || 0;
        const nextPerRoom = { ...s.perRoom, [roomId]: cur + by };
        const pend = s.pending[roomId] || 0;
        const nextPending = { ...s.pending, [roomId]: pend + by };
        const total = s.total + by;
        const ns = { perRoom: nextPerRoom, pending: nextPending, lastFlushAt: s.lastFlushAt } as const;
        persist(ns);
        return { ...s, perRoom: nextPerRoom, pending: nextPending, total };
      });
    },
    reset: (roomId: string) => {
      set((s) => {
        const cur = s.perRoom[roomId] || 0;
        if (cur === 0) return s;
        const nextPerRoom = { ...s.perRoom, [roomId]: 0 };
        // pending delta becomes negative of cur (mark as read)
        const pend = s.pending[roomId] || 0;
        const nextPending = { ...s.pending, [roomId]: pend - cur };
        const total = Math.max(0, s.total - cur);
        const ns = { perRoom: nextPerRoom, pending: nextPending, lastFlushAt: s.lastFlushAt } as const;
        persist(ns);
        return { ...s, perRoom: nextPerRoom, pending: nextPending, total };
      });
    },
    hydrate: (snapshot: Record<string, number>) => {
      set((s) => {
        const perRoom = { ...s.perRoom };
        let total = 0;
        for (const [k, v] of Object.entries(snapshot)) {
          perRoom[k] = Math.max(0, Number(v) || 0);
          total += perRoom[k];
        }
        const ns = { perRoom, pending: s.pending, lastFlushAt: s.lastFlushAt } as const;
        persist(ns);
        return { ...s, perRoom, total };
      });
    },
    clearAll: () => {
      set(() => {
        const ns = { perRoom: {}, pending: {}, lastFlushAt: Date.now() } as const;
        persist(ns);
        return { perRoom: {}, pending: {}, lastFlushAt: Date.now(), total: 0 } as any;
      });
    },
    markSeen: (roomId: string) => {
      get().reset(roomId);
    },
  };
});