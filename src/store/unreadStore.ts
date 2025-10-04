import { create } from "zustand";
import { isBrowser } from "@/utils/browser";

// Lightweight unread store with persistence and batching
export type UnreadState = {
  perRoom: Record<string, number>;
  // selectors
  total: number;
  // UI context
  activeRoomId: string | null;
  /** Token representing the current owner of the active room claim (for race-free unmount). */
  activeOwnerToken?: string | null;
  // actions (public)
  reset: (roomId: string) => void;
  clearAll: () => void;
  markSeen: (roomId: string) => void;
  setActiveRoomId: (roomId: string | null) => void;
  /** Remove a room entry entirely and adjust total accordingly. */
  removeRoom: (roomId: string) => void;
  /** Acquire exclusive ownership of active room; returns a token to release later. */
  acquireActive: (roomId: string) => string;
  /** Release active room only if the token still owns it (prevents cross-unmount races). */
  releaseActive: (token: string) => void;
  // internal/private (not part of public API)
  _inc: (roomId: string, by?: number) => void;
  _hydrate: (snapshot: Record<string, number>) => void;
  _setCount: (roomId: string, count: number) => void;
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

// In-memory per-room message-id dedupe (prevents double counting when multiple listeners fire)
const __seenIdsQueueByRoom: Record<string, string[]> = {};
const __seenIdsSetByRoom: Record<string, Set<string>> = {};
const SEEN_CAP = 200; // keep last N message ids per room

function seenAlready(roomId: string, id?: string | number | null): boolean {
  if (id === undefined || id === null) return false;
  const key = String(id);
  const r = String(roomId);
  let set = __seenIdsSetByRoom[r];
  if (!set) {
    set = new Set<string>();
    __seenIdsSetByRoom[r] = set;
    __seenIdsQueueByRoom[r] = [];
  }
  if (set.has(key)) return true;
  // remember and enforce LRU capacity
  set.add(key);
  const q = __seenIdsQueueByRoom[r]!;
  q.push(key);
  if (q.length > SEEN_CAP) {
    const old = q.shift();
    if (old) set.delete(old);
  }
  return false;
}

export const useUnreadStore = create<UnreadState>((set, get) => {
  const initial = loadPersisted();
  const totalInitial = Object.values(initial.perRoom).reduce((a, b) => a + (b || 0), 0);
  return {
    perRoom: initial.perRoom,
    total: totalInitial,
    activeRoomId: null,
    activeOwnerToken: null,
    _inc: (roomId: string, by: number = 1) => {
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
    _hydrate: (snapshot: Record<string, number>) => {
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
      set((s) => {
        try { console.debug('[unread] setActiveRoomId', { from: s.activeRoomId, to: roomId }); } catch {}
        return { ...s, activeRoomId: roomId };
      });
    },
    _setCount: (roomId: string, count: number) => {
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
      try { console.debug('[unread] acquireActive', { roomId, token }); } catch {}
      return token;
    },
    releaseActive: (token: string) => {
      set((s) => {
        try { console.debug('[unread] releaseActive:attempt', { token, owner: s.activeOwnerToken, roomId: s.activeRoomId }); } catch {}
        // only clear if the same owner still holds the claim
        if (!token || s.activeOwnerToken !== token) return s;
        try { console.debug('[unread] releaseActive:do', { token, roomId: s.activeRoomId }); } catch {}
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
 * Increment unread for an incoming message, respecting active-room policy.
 * By default, it will NOT increment if the active room matches (focus is ignored).
 */
export function incrementForIncoming(
    roomId: string,
    opts: { windowFocused?: boolean; activeRoomId?: string | null; messageId?: string | number } = {}
) {
    const state = useUnreadStore.getState();
    try {
        console.log('[unread] incIncoming:enter', {
            roomId,
            opts,
            activeInStore: state.activeRoomId,
            focusedNow: computeWindowFocused(),
            visibility: typeof document !== 'undefined' ? document.visibilityState : 'n/a',
        });
    } catch {}

    // Per-message dedupe: if this message id for this room was already processed, skip
    if (seenAlready(roomId, opts.messageId ?? null)) {
        try { console.log('[unread] incIncoming:skip:dedupe', { roomId, messageId: opts.messageId }); } catch {}
        return;
    }

    // Normalize ids to strings to avoid type-mismatch issues (e.g., number vs string)
    const activeRaw = opts.activeRoomId === undefined ? state.activeRoomId : opts.activeRoomId;
    const activeStr = activeRaw == null ? null : String(activeRaw);
    const roomStr = String(roomId);

    // Determine focus using override or live window state
    const focused = opts.windowFocused === undefined ? computeWindowFocused() : !!opts.windowFocused;

    try {
        console.log('[unread] incIncoming:policy', {
            roomId: roomStr,
            activeRaw,
            activeStr,
            focused,
            mode: 'skip-if-active',
        });
    } catch {}

    // If this room is active (regardless of focus), don't increment
    if (activeStr !== null && activeStr === roomStr) {
        try { console.log('[unread] incIncoming:skip:active', { roomId: roomStr, activeStr, focused }); } catch {}
        return;
    }

    try { console.log('[unread] incIncoming:DO:inc', { roomId: roomStr }); } catch {}
    state._inc(roomId);
}


/** Mark the given room as seen (resets its unread counter to 0). */
export function markRoomSeen(roomId: string) {
  useUnreadStore.getState().markSeen(roomId);
}

/**
 * Set the active room in UI using the tokenized API under the hood.
 * This avoids races where another component acquires active ownership after us.
 */
let __activeHelperToken: string | null = null;
export function setActiveRoom(roomId: string | null) {
  const s = useUnreadStore.getState();
  // No-op if value is unchanged
  const current = s.activeRoomId == null ? null : String(s.activeRoomId);
  const next = roomId == null ? null : String(roomId);
  if (current === next) return;

  // Release previous token if any
  if (__activeHelperToken) {
    try { s.releaseActive(__activeHelperToken); } catch {}
    __activeHelperToken = null;
  }

  if (next == null) {
    // Explicitly clear active id; nothing else to do
    try { s.setActiveRoomId(null); } catch {}
    return;
  }

  // Acquire new ownership; this also resets unread for the room
  try {
    __activeHelperToken = s.acquireActive(next);
  } catch {
    // Fallback to legacy behavior if acquire fails
    s.setActiveRoomId(next);
    s.reset(next);
  }
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
  useUnreadStore.getState()._hydrate(snapshot);
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
    let prevActive = useUnreadStore.getState().activeRoomId;
    useUnreadStore.subscribe((s) => {
      if (s.activeRoomId === prevActive) return;
      try { console.debug('[unread] activeRoomId:changed', { from: prevActive, to: s.activeRoomId }); } catch {}
      prevActive = s.activeRoomId;
      try {
        window.dispatchEvent(new CustomEvent('chat:active-room-changed', { detail: { activeRoomId: s.activeRoomId } }));
      } catch {}
    });

    // --- Integrate with roomsStore: prune counters for rooms that no longer exist ---
    (async () => {
      try {
        const mod = await import("@/store/roomsStore");
        const useRoomsStore = (mod as any).useRoomsStore as { getState: () => any; subscribe: (cb: (s: any) => void) => () => void };
        if (!useRoomsStore) return;

        let prevRooms = useRoomsStore.getState().rooms;
        useRoomsStore.subscribe((s: any) => {
          const rooms = s.rooms;
          if (rooms === prevRooms) return;
          prevRooms = rooms;

          // Build set of valid room ids
          const allowed = new Set<string>(Array.isArray(rooms) ? rooms.map((r: any) => String(r?.id ?? '')) : []);

          // Prune perRoom entries that are no longer present in rooms
          const st = useUnreadStore.getState();
          const before = st.perRoom || {};
          let changed = false;
          const filtered: Record<string, number> = {};
          let total = 0;
          for (const [id, val] of Object.entries(before)) {
            if (allowed.has(String(id))) {
              const v = Math.max(0, Number(val) || 0);
              filtered[id] = v;
              total += v;
            } else {
              changed = true; // dropped unknown room id
            }
          }

          // If active room no longer exists, clear it
          let nextActive: string | null | undefined = st.activeRoomId ?? null;
          if (nextActive && !allowed.has(String(nextActive))) {
            nextActive = null;
            changed = true;
          }

          if (!changed) return;

          // Apply pruned state atomically
          useUnreadStore.setState((s) => ({
            ...s,
            perRoom: filtered,
            total,
            activeRoomId: nextActive,
          }));
          try { persist({ perRoom: filtered }); } catch {}
        });
      } catch {}
    })();
  } catch {}
}
