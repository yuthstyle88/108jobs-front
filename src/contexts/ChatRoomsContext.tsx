"use client";

import React, {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {ChatRoom as AppChatRoom} from "@/types/chat";
import {HttpService, UserService} from "@/services";
// E2EE exchange is ensured for future needs
import {exchange} from "@/lib/api/auth";
import {useHttpGet} from "@/hooks/useHttpGet";
import type {ListUserChatRoomsResponse} from "lemmy-js-client";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {REQUEST_STATE} from "@/services/HttpService";
import { isBrowser } from "@/utils/browser";

// Context state for listing chat rooms with pagination and E2EE-aware lastMessage preview

type RoomsState = {
    rooms: AppChatRoom[];
    isLoading: boolean;
    error: unknown;
    page: number;
    pageSize: number;
    hasMore: boolean;
};

interface ChatRoomsContextValue extends RoomsState {
    refresh: () => void;
    loadMore: () => void;
    markRoomRead: (roomId: string) => Promise<void>;
    bumpRoomToTop: (roomId: string, updatedAt?: string) => void;
    activeRoomId: string | null;
    setActiveRoomId: (roomId: string | null) => void;
}

const ChatRoomsContext = createContext<ChatRoomsContextValue | undefined>(undefined);

export const ChatRoomsProvider: React.FC<{ children: React.ReactNode; pageSize?: number }>
    = ({children, pageSize = 20}) => {
    const [page, setPage] = useState(1);
    const sharedKeyReadyRef = useRef(false);
    const { localUser } = useMyUser();
    // Persist client-known last-activity timestamps to keep room order stable across reloads
    const LOCAL_ACTIVITY_KEY = 'chat_last_activity_overrides';
    const activityOverridesRef = useRef<Record<string, string>>({});
    const saveOverrides = useCallback(() => {
        try {
            if (isBrowser()) {
                localStorage.setItem(LOCAL_ACTIVITY_KEY, JSON.stringify(activityOverridesRef.current));
            }
        } catch {}
    }, []);
    // Load persisted overrides once
    useEffect(() => {
        try {
            if (isBrowser()) {
                const raw = localStorage.getItem(LOCAL_ACTIVITY_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (parsed && typeof parsed === 'object') activityOverridesRef.current = parsed;
                }
            }
        } catch {}
        // After loading, re-sort current rooms using effective timestamps
        setState(prev => {
            const sorted = [...prev.rooms].sort((a: any, b: any) => {
                const ao = activityOverridesRef.current[a.id];
                const bo = activityOverridesRef.current[b.id];
                const aet = ao ? new Date(ao).getTime() : 0;
                const bet = bo ? new Date(bo).getTime() : 0;
                return bet - aet;
            });
            return { ...prev, rooms: sorted } as any;
        });
    }, []);

    const { state: reqState, data, isMutating: isLoading, execute } = useHttpGet("listChatRooms", { limit: page * pageSize });
    const error = reqState.state === "failed" ? (reqState as any).err : null;

    // Publish identity public key once (idempotent). No global shared key.
    useEffect(() => {
        (async () => {
            if (sharedKeyReadyRef.current) return;
            try {
                const token = UserService.Instance.auth();
                if (!token) return;
                await exchange();
            } catch {
                // best-effort; not fatal for room list
            } finally {
                sharedKeyReadyRef.current = true;
            }
        })();
    }, []);


    const mapToRooms = useCallback(async (input?: ListUserChatRoomsResponse): Promise<RoomsState> => {
        const items = input?.rooms || [];
        const totalLoaded = items.length;
        // Prefer cursor-based hasMore if provided by API, otherwise fall back to count-based heuristic
        const hasMore = typeof (input as any)?.nextPage !== 'undefined' ? !!(input as any).nextPage : totalLoaded >= page * pageSize;
        const mapped: AppChatRoom[] = [];
        for (const it of items as any[]) {
            // Normalize item shape to ChatRoomView whether input is ChatRoomResponse or ChatRoomView
            const roomView = (it as any)?.room?.room ? (it as any).room : (it as any);
            const rawId = roomView?.room?.id ?? roomView?.id ?? (it as any)?.roomId ?? (it as any)?.id;
            if (!rawId) {
                // Skip invalid entries with no id to avoid "undefined"
                continue;
            }

            const participantsArr = (roomView?.participants ?? (it as any)?.participants ?? []) as any[];
            const other = participantsArr.find(
                (p: any) => String(p.memberId) !== String(localUser?.id)
            );

            let profileName = "Unknown";
            if (other?.memberId != null) {
                try {
                    const res = await HttpService.client.visitProfile(String(other.memberId));
                    profileName = res.state === REQUEST_STATE.SUCCESS ? (res as any)?.data?.profile?.name ?? "Unknown" : "Unknown";
                } catch {}
            }

            let roomName = roomView?.room?.roomName;
            if (rawId === roomName) {
                roomName = profileName;
            } else {
                roomName = `${profileName}:Job ${roomName}`;
            }

            mapped.push({
                id: String(rawId),
                name: roomName,
                participants: participantsArr.map((p: any) => String(p.memberId)) as any,
                unreadCount: 0,
                postId: roomView?.room?.postId ?? roomView?.post?.id ?? (it as any)?.postId,
            } as any);
        }

        return {
            rooms: mapped,
            isLoading,
            error,
            page,
            pageSize,
            hasMore,
        };
    }, [error, isLoading, page, pageSize]);

    const [state, setState] = useState<RoomsState>({
        rooms: [],
        isLoading: true,
        error: null,
        page,
        pageSize,
        hasMore: true
    } as any);

    // Track which room is currently open/active in the UI
    const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;
        (async () => {
            const result = await mapToRooms(data || undefined);
            if (!alive) return;
            // Merge new result into existing state without re-sorting to preserve stable order across pagination
            setState(prev => {
                // Build a map of existing rooms to preserve their order
                const existingOrder = prev.rooms.map(r => r.id);
                const nextById = new Map<string, any>();
                // Start with previous rooms in their current order
                prev.rooms.forEach(r => nextById.set(r.id, r));
                // Upsert incoming rooms (update fields if exist, append later if brand new)
                (result.rooms as any[]).forEach(r => {
                    const old = nextById.get(r.id);
                    nextById.set(r.id, old ? { ...old, ...r } : r);
                });
                // Reconstruct list: keep prior order first, then append any brand-new ids at the end
                const kept = existingOrder.map(id => nextById.get(id)).filter(Boolean);
                const appended = Array.from(nextById.keys())
                    .filter(id => !existingOrder.includes(id))
                    .map(id => nextById.get(id));
                const mergedRooms = [...kept, ...appended] as any[];

                // If nothing changed besides loading/error flags, avoid re-render
                const sameLength = prev.rooms.length === mergedRooms.length;
                const isSame = sameLength && prev.rooms.every((r, i) => {
                    const n = mergedRooms[i];
                    return r.id === n.id &&
                        r.name === n.name &&
                        r.unreadCount === n.unreadCount;
                });
                if (isSame) {
                    return { ...prev, isLoading: isLoading, error } as any;
                }
                const sortedRooms = [...mergedRooms].sort((a: any, b: any) => {
                    const ao = activityOverridesRef.current[a.id];
                    const bo = activityOverridesRef.current[b.id];
                    const aet = ao ? new Date(ao).getTime() : 0;
                    const bet = bo ? new Date(bo).getTime() : 0;
                    return bet - aet;
                });
                return {
                    ...prev,
                    isLoading: isLoading,
                    error,
                    page: result.page,
                    pageSize: result.pageSize,
                    hasMore: result.hasMore,
                    rooms: sortedRooms as any,
                } as any;
            });
        })();
        return () => {
            alive = false;
        };
    }, [data, mapToRooms, page]);

    const refresh = useCallback(() => {
        execute();
    }, [execute]);

    // Refetch when WS reconnects (event dispatched from RealtimeChatContext)
    useEffect(() => {
        const off = (async () => {
            const { onWsReconnected } = await import("@/chat");
            const unsubscribe = onWsReconnected(() => {
                try { execute(); } catch {}
            });
            return unsubscribe;
        })();
        let unsub: (() => void) | null = null;
        off.then((u) => { unsub = u as any; }).catch(() => {});
        return () => { try { unsub?.(); } catch {} };
    }, [execute]);

    const loadMore = useCallback(() => {
        if (state.hasMore && !isLoading) setPage(p => p + 1);
    }, [state.hasMore, isLoading]);

    const markRoomRead = useCallback(async (roomId: string) => {
        // Optimistically zero out unread count for UX; integrate API when available
        setState(prev => ({...prev, rooms: prev.rooms.map(r => r.id === roomId ? {...r, unreadCount: 0} : r)}));
        try {
            // Keep global unread badge in sync
            const { markSeen } = (await import("@/stores/unreadStore")).useUnreadStore.getState();
            markSeen(roomId);
        } catch {}
        // If server endpoint exists, call it here
        // await axiosPrivate.post(`/messages/rooms/${roomId}/read`)
    }, []);

    // Expose a helper to move a room to the top when a new message arrives
    const bumpRoomToTop = useCallback((roomId: string, updatedAt?: string) => {
        setState(prev => {
            const idx = prev.rooms.findIndex(r => r.id === roomId);
            if (idx === -1) return prev;
            const newUpdatedAt = updatedAt || new Date().toISOString();
            // persist override for stability across reloads
            activityOverridesRef.current[roomId] = newUpdatedAt;
            saveOverrides();
            const remaining = prev.rooms.filter((_, i) => i !== idx);
            const room = prev.rooms[idx];
            const nextRooms = [room, ...remaining];
            return { ...prev, rooms: nextRooms } as any;
        });
    }, [saveOverrides]);


    // Listen for global chat:new-message events to immediately update the left list
    useEffect(() => {
        let unsubscribe: (() => void) | null = null;
        (async () => {
            const { onChatNewMessage } = await import("@/chat");
            unsubscribe = onChatNewMessage((detail) => {
                if (!detail || !detail.roomId) return;
                // First, update unread counters in the global store to ensure counts are ready before UI updates
                if (detail.unread === true && detail.roomId !== activeRoomId) {
                    try { (require as any)("@/stores/unreadStore").useUnreadStore.getState().inc(detail.roomId, 1); } catch {}
                }
                // Then bump room to top for immediate UX feedback
                setState(prev => {
                    const idx = prev.rooms.findIndex(r => r.id === detail.roomId);
                    if (idx === -1) return prev;

                    // Persist/refresh activity timestamp override
                    const tsStr = detail.timestamp || new Date().toISOString();
                    activityOverridesRef.current[detail.roomId] = tsStr;
                    try { saveOverrides(); } catch {}

                    // Clone rooms (unreadCount will be synced from store via dedicated effect)
                    let nextRooms: any[] = prev.rooms.slice();
                    const updatedRoom = nextRooms[idx];

                    // Remove from current position and insert at front
                    nextRooms.splice(idx, 1);
                    nextRooms = [updatedRoom, ...nextRooms];

                    return { ...prev, rooms: nextRooms } as any;
                });
            });
        })();
        return () => { try { unsubscribe?.(); } catch {} };
    }, [activeRoomId, saveOverrides]);

    // Sync activeRoomId to global unread store so global listener can avoid double-counting
    useEffect(() => {
        (async () => {
            try {
                const { useUnreadStore } = await import("@/stores/unreadStore");
                useUnreadStore.getState().setActiveRoomId(activeRoomId);
            } catch {}
        })();
        return () => {
            // On unmount, clear the active room
            (async () => {
                try {
                    const { useUnreadStore } = await import("@/stores/unreadStore");
                    useUnreadStore.getState().setActiveRoomId(null);
                } catch {}
            })();
        };
    }, [activeRoomId]);

    // Hydrate and sync unread counts per room from the global unread store
    useEffect(() => {
        let unsub: undefined | (() => void);
        let cancelled = false;
        (async () => {
            try {
                const { useUnreadStore } = await import("@/stores/unreadStore");
                const applyPerRoom = (perRoom: Record<string, number>) => {
                    if (cancelled) return;
                    setState(prev => {
                        if (!prev.rooms || prev.rooms.length === 0) return prev as any;
                        const nextRooms = prev.rooms.map((r: any) => {
                            const cnt = perRoom?.[r.id] || 0;
                            return cnt === r.unreadCount ? r : { ...r, unreadCount: cnt };
                        });
                        return { ...prev, rooms: nextRooms } as any;
                    });
                };
                // initial apply
                applyPerRoom(useUnreadStore.getState().perRoom);
                // subscribe for future changes
                // store doesn't use subscribeWithSelector; listen to full state and react when perRoom reference changes
                unsub = useUnreadStore.subscribe((s, prev) => {
                    if (s.perRoom !== prev?.perRoom) applyPerRoom(s.perRoom);
                });
            } catch {}
        })();
        return () => { cancelled = true; try { unsub?.(); } catch {} };
        // Re-run when room list identity changes (ids), so unread can be applied to new rooms
    }, [state.rooms.map?.(r => r.id).join("|")]);

    const value = useMemo<ChatRoomsContextValue>(() => ({
        ...state,
        refresh,
        loadMore,
        markRoomRead,
        bumpRoomToTop,
        activeRoomId,
        setActiveRoomId,
    }), [state, refresh, loadMore, markRoomRead, bumpRoomToTop, activeRoomId]);

    return (
        <ChatRoomsContext.Provider value={value}>
            {children}
        </ChatRoomsContext.Provider>
    );
};

export const useChatRooms = (): ChatRoomsContextValue => {
    const ctx = useContext(ChatRoomsContext);
    if (!ctx) throw new Error('useChatRooms must be used within ChatRoomsProvider');
    return ctx;
};

// Optional hook variant for components that may render outside provider (returns undefined instead of throwing)
export const useOptionalChatRooms = (): ChatRoomsContextValue | undefined => {
    try {
        return useContext(ChatRoomsContext);
    } catch {
        return undefined;
    }
};
