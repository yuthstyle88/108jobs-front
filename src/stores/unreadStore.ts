import { create } from "zustand";
import { isBrowser } from "@/utils/browser";

// Lightweight unread store with persistence and batching
export type UnreadState = {
  perRoom: Record<string, number>;
  // selectors
  total: number;
  // UI context
  activeRoomId?: string | null;
  /** Token representing the current owner of the active room claim (for race-free unmount). */
  activeOwnerToken?: string | null;
  // actions
  inc: (roomId: string, by?: number) => void;
  reset: (roomId: string) => void;
  hydrate: (snapshot: Record<string, number>) => void;
  clearAll: () => void;
  markSeen: (roomId: string) => void;
  setActiveRoomId: (roomId: string | null) => void;
  /** Directly set a room's unread count (sanitized to a non-negative integer). */
  setCount: (roomId: string, count: number) => void;
  /** Remove a room entry entirely and adjust total accordingly. */
  removeRoom: (roomId: string) => void;
  /** Acquire exclusive ownership of active room; returns a token to release later. */
  acquireActive: (roomId: string) => string;
  /** Release active room only if the token still owns it (prevents cross-unmount races). */
  releaseActive: (token: string) => void;
};

const STORAGE_KEY = "chat_unread_v1";

// Note: All persistence only runs in the browser (guarded by isBrowser()).
// On the server/SSR, the store starts empty and will hydrate on the client.

function uid(): string {
  try { return crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`; } catch { return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`; }
}

function loadPersisted(): Pick<UnreadState, "perRoom"> {
  if (!isBrowser()) return { perRoom: {} };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { perRoom: {} };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return { perRoom: {} };
    return { perRoom: parsed.perRoom || {} };
  } catch {
    return { perRoom: {} };
  }
}

function persist(state: Pick<UnreadState, "perRoom">) {
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
    total: totalInitial,
    activeRoomId: null,
    activeOwnerToken: null,
    inc: (roomId: string, by: number = 1) => {
      set((s) => {
        const step = Number.isFinite(by) ? Math.floor(by) : 1;
        const delta = Math.max(1, step);
        const cur = Math.max(0, Number(s.perRoom[roomId]) || 0);
        const nextVal = cur + delta;
        const nextPerRoom = { ...s.perRoom, [roomId]: nextVal };
        const total = Math.max(0, s.total + delta);
        persist({ perRoom: nextPerRoom });
        return { ...s, perRoom: nextPerRoom, total };
      });
    },
    reset: (roomId: string) => {
      set((s) => {
        const cur = Math.max(0, Number(s.perRoom[roomId]) || 0);
        if (cur === 0) return s;
        const nextPerRoom = { ...s.perRoom, [roomId]: 0 };
        const total = Math.max(0, s.total - cur);
        persist({ perRoom: nextPerRoom });
        return { ...s, perRoom: nextPerRoom, total };
      });
    },
    hydrate: (snapshot: Record<string, number>) => {
      set((s) => {
        const perRoom: Record<string, number> = {};
        let total = 0;
        for (const [k, v] of Object.entries(snapshot)) {
          const num = Number(v);
          const val = Number.isFinite(num) ? Math.max(0, Math.floor(num)) : 0;
          perRoom[k] = val;
          total += val;
        }
        persist({ perRoom });
        return { ...s, perRoom, total };
      });
    },
    clearAll: () => {
      set(() => {
        persist({ perRoom: {} });
        return { perRoom: {}, total: 0, activeRoomId: null } as any;
      });
    },
    markSeen: (roomId: string) => {
      get().reset(roomId);
    },
    setActiveRoomId: (roomId: string | null) => {
      set((s) => ({ ...s, activeRoomId: roomId }));
    },
    setCount: (roomId: string, count: number) => {
      set((s) => {
        const num = Number(count);
        const val = Number.isFinite(num) ? Math.max(0, Math.floor(num)) : 0;
        const cur = Math.max(0, Number(s.perRoom[roomId]) || 0);
        const delta = val - cur;
        const nextPerRoom = { ...s.perRoom, [roomId]: val };
        const total = Math.max(0, s.total + delta);
        persist({ perRoom: nextPerRoom });
        return { ...s, perRoom: nextPerRoom, total };
      });
    },
    removeRoom: (roomId: string) => {
      set((s) => {
        if (!(roomId in s.perRoom)) return s;
        const cur = Math.max(0, Number(s.perRoom[roomId]) || 0);
        const nextPerRoom = { ...s.perRoom };
        delete nextPerRoom[roomId];
        const total = Math.max(0, s.total - cur);
        persist({ perRoom: nextPerRoom });
        return { ...s, perRoom: nextPerRoom, total };
      });
    },
    acquireActive: (roomId: string) => {
      const token = uid();
      set((s) => ({ ...s, activeRoomId: roomId, activeOwnerToken: token }));
      // when a room becomes active, consider it read immediately
      get().reset(roomId);
      return token;
    },
    releaseActive: (token: string) => {
      set((s) => {
        // only clear if the same owner still holds the claim
        if (!token || s.activeOwnerToken !== token) return s;
        return { ...s, activeRoomId: null, activeOwnerToken: null };
      });
    },
  };
});

// -----------------------------
// Selectors & React-friendly hooks
// -----------------------------
export const selectUnreadCount = (roomId: string) => (s: UnreadState) => s.perRoom[roomId] ?? 0;
export const selectTotalUnread = (s: UnreadState) => s.total;

export const useUnreadCount = (roomId: string) =>
  useUnreadStore((s) => s.perRoom[roomId] ?? 0);

export const useTotalUnread = () =>
  useUnreadStore((s) => s.total);

// -----------------------------
// Helper methods for imperative usage (service / adapters can call these)
// -----------------------------
function computeWindowFocused(): boolean {
  try {
    const visible = typeof document !== 'undefined' ? document.visibilityState === 'visible' : true;
    const hasFocus = typeof window !== 'undefined' && typeof window.document?.hasFocus === 'function' ? window.document.hasFocus() : true;
    return visible && hasFocus;
  } catch {
    return true;
  }
}

/**
 * Increment unread for an incoming message, respecting focus/active-room policy.
 * By default, it will NOT increment if the active room matches and the window is focused.
 */
export function incrementForIncoming(
  roomId: string,
  opts: { fromSelf?: boolean; windowFocused?: boolean; activeRoomId?: string | null } = {}
) {
  const state = useUnreadStore.getState();
  const fromSelf = !!opts.fromSelf;
  if (fromSelf) return; // never count our own message

  const active = opts.activeRoomId === undefined ? state.activeRoomId : opts.activeRoomId;
  const focused = opts.windowFocused === undefined ? computeWindowFocused() : !!opts.windowFocused;

  // If user is actively viewing this room and window focused, don't increment
  if (active === roomId && focused) return;

  state.inc(roomId);
}

/** Mark the given room as seen (resets its unread counter to 0). */
export function markRoomSeen(roomId: string) {
  useUnreadStore.getState().markSeen(roomId);
}

/** Set the active room in UI; also clears unread for that room immediately. */
export function setActiveRoom(roomId: string | null) {
  const s = useUnreadStore.getState();
  s.setActiveRoomId(roomId);
  if (roomId) s.reset(roomId);
}

/**
 * Scoped activation helper: call at mount to mark a room active and receive a disposer
 * that safely releases the claim on unmount. Prevents the classic race where Room A unmounts
 * after Room B has already become active and accidentally clears the active room.
 */
export function setActiveRoomScoped(roomId: string) {
  const token = useUnreadStore.getState().acquireActive(roomId);
  return () => useUnreadStore.getState().releaseActive(token);
}

/** Replace current counters with a snapshot (e.g., after fetching from backend). */
export function hydrateUnread(snapshot: Record<string, number>) {
  useUnreadStore.getState().hydrate(snapshot);
}

/** Clear everything (useful on logout). */
export function clearAllUnread() {
  useUnreadStore.getState().clearAll();
}

// -----------------------------
// Broadcast DOM event on changes (for non-React consumers / badges)
// -----------------------------
if (isBrowser()) {
  try {
    let prevTotal = useUnreadStore.getState().total;
    let prevPerRoom = useUnreadStore.getState().perRoom;
    useUnreadStore.subscribe((s) => {
      const changed = s.total !== prevTotal || s.perRoom !== prevPerRoom;
      prevTotal = s.total;
      prevPerRoom = s.perRoom;
      if (!changed) return;
      try {
        window.dispatchEvent(
          new CustomEvent('chat:unread-changed', {
            detail: { perRoom: s.perRoom, total: s.total },
          })
        );
      } catch {}
    });
  } catch {}
}
