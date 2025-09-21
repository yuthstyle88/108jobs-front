import { create } from "zustand";
import { isBrowser } from "@/utils/browser";

// Lightweight unread store with persistence and batching
export type UnreadState = {
  perRoom: Record<string, number>;
  pending: Record<string, number>; // deltas to flush
  lastFlushAt?: number;
  // selectors
  total: number;
  // UI context
  activeRoomId?: string | null;
  // actions
  inc: (roomId: string, by?: number) => void;
  reset: (roomId: string) => void;
  hydrate: (snapshot: Record<string, number>) => void;
  clearAll: () => void;
  markSeen: (roomId: string) => void;
  setActiveRoomId: (roomId: string | null) => void;
};

const STORAGE_KEY = "chat_unread_v1";

function loadPersisted(): Pick<UnreadState, "perRoom" | "pending" | "lastFlushAt"> {
  if (!isBrowser()) return { perRoom: {}, pending: {}, lastFlushAt: undefined };
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
  if (!isBrowser()) return;
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
    activeRoomId: null,
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
        return { perRoom: {}, pending: {}, lastFlushAt: Date.now(), total: 0, activeRoomId: null } as any;
      });
    },
    markSeen: (roomId: string) => {
      get().reset(roomId);
    },
    setActiveRoomId: (roomId: string | null) => {
      set((s) => ({ ...s, activeRoomId: roomId }));
    },
  };
});

// Background flusher: best-effort demo using window timers and online events
let flushTimer: number | null = null;
async function flushPending() {
  try {
    const { pending } = useUnreadStore.getState();
    const entries = Object.entries(pending).filter(([, d]) => d !== 0);
    if (entries.length === 0) return;
    // TODO: replace with real API endpoint if available
    // For now, we just simulate success and clear pending deltas
    // await axiosPrivate.post('/messages/unread/flush', { deltas: pending })
    useUnreadStore.setState((s) => {
      const cleared = { ...s.pending };
      for (const [k] of entries) cleared[k] = 0;
      const ns = { perRoom: s.perRoom, pending: cleared, lastFlushAt: Date.now() } as const;
      persist(ns);
      return { ...s, pending: cleared, lastFlushAt: Date.now() };
    });
  } catch (e) {
    // keep pending for retry
    // exponential backoff could be implemented if needed
  }
}

function ensureFlushLoop() {
  if (!isBrowser()) return;
  if (flushTimer != null) return;
  // every 5 minutes
  flushTimer = window.setInterval(() => {
    if (navigator.onLine) flushPending();
  }, 5 * 60 * 1000);
  window.addEventListener("online", () => flushPending());
  window.addEventListener("ws:reconnected" as any, () => flushPending());
}

if (isBrowser()) {
  ensureFlushLoop();
  try {
    // chat:new-message increments are now handled within ChatRoomsContext to ensure ordering before UI updates
    window.addEventListener('chat:new-message' as any, (_e: any) => {
      // no-op: keep listener to avoid breaking external expectations
    });
  } catch {}
}
