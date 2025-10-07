import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useRoomsStore } from "@/core/chat/store/roomsStore";
import { UserService } from "@/services/UserService";

export type ReadLastIdOptions = {
  /** initial value when the room mounts (e.g. from server room object) */
  initial?: string | null | undefined;
  /** called whenever the value changes (persist to store/server) */
  onChange?: (roomId: string, lastReadId: string | null) => void;
};

export type UseReadLastId = {
  /** the current last-read id for this room (null = never read) */
  lastReadId: string | null;
  /** set explicitly; fires onChange once debounced */
  setLastReadId: (id: string | null) => void;
  /** convenience: mark the given message id and anything older as read */
  markAsReadUpTo: (id: string) => void;
  /** convenience: mark the newest message in the list as read */
  markNewestRead: (messageIds: string[]) => void;
};

/**
 * Manage per-room last-read id, with an optional onChange callback for persistence.
 *
 * This hook is intentionally decoupled from any specific store so it can be
 * reused in SSR/CSR contexts. If you want to persist into a store, pass `onChange`.
 */
export function useReadLastId(roomId: string, opts: ReadLastIdOptions = {}): UseReadLastId {
  const [lastReadId, _set] = useState<string | null>(opts.initial ?? null);
  const pendingRef = useRef<string | null>(opts.initial ?? null);
  const roomRef = useRef(roomId);
  roomRef.current = roomId;

  // Debounce persist calls slightly to avoid spamming when scrolling
  const debouncedPersist = useMemo(() => {
    let t: any; // NodeJS.Timeout | number
    return (id: string | null) => {
      if (t) clearTimeout(t);
      t = setTimeout(() => {
        if (typeof opts.onChange === "function") {
          try { opts.onChange(roomRef.current, id); } catch {}
        }
      }, 250);
    };
  }, [opts.onChange]);

  const setLastReadId = useCallback((id: string | null) => {
    _set((prev) => {
      const next = id ?? null;
      if (prev === next) return prev;
      pendingRef.current = next;
      return next;
    });
    debouncedPersist(id ?? null);
  }, [debouncedPersist]);

  const markAsReadUpTo = useCallback((id: string) => {
    if (!id) return;
    setLastReadId(String(id));
  }, [setLastReadId]);

  const markNewestRead = useCallback((messageIds: string[]) => {
    if (!Array.isArray(messageIds) || messageIds.length === 0) return;
    // Assume array may be newest-first; pick the first element as newest
    const newest = String(messageIds[0]);
    if (newest) setLastReadId(newest);
  }, [setLastReadId]);

  // If the `initial` option changes (e.g., room switched), adopt it once
  useEffect(() => {
    if (typeof opts.initial === "undefined") return;
    _set((prev) => (prev == null ? (opts.initial ?? null) : prev));
    // do not put opts.initial in deps; we only want to seed on first mount/switch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  return { lastReadId, setLastReadId, markAsReadUpTo, markNewestRead };
}

/**
 * useRoomReadLastId: system-level hook that wires last-read id to roomsStore and UserService.
 * - Seeds initial from roomsStore, then UserService (local persisted), else null.
 * - Persists every change to both roomsStore (for UI) and UserService (for reloads).
 */
export function useRoomReadLastId(roomId: string): UseReadLastId {
  // Select the room and actions from the rooms store
  const room = useRoomsStore((s) => s.rooms.find((r) => String(r.id) === String(roomId)));
  const updateReadLastId = useRoomsStore((s) => s.updateReadLastId);

  // Seed priority: roomsStore.readLastId → UserService cache → null
  const initial = useMemo(() => {
    const fromStore = room?.readLastId ?? null;
    if (fromStore != null) return fromStore;
    try {
      return UserService?.Instance?.getReadLastId?.(roomId) ?? null;
    } catch {
      return null;
    }
  }, [room?.readLastId, roomId]);

  // Compose the decoupled hook with a persistence side-effect
  const api = useReadLastId(roomId, {
    initial,
    onChange: (rid, id) => {
      try { updateReadLastId?.(rid, id ?? null); } catch {}
      try { UserService?.Instance?.setReadLastId?.(rid, id ?? null); } catch {}
    },
  });

  // Back-fill roomsStore when only UserService had a cached value
  useEffect(() => {
    if (!room?.readLastId && initial) {
      try { updateReadLastId?.(roomId, initial); } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  return api;
}