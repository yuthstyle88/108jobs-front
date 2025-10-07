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
import {isBrowser} from "@/utils/browser";
import {useUnreadStore} from "@/core/chat/store/unreadStore";
import {useRoomsStore} from "@/core/chat/store/roomsStore";
import {disableBackgroundUnread, enableBackgroundUnread} from "@/core/chat/utils/backgroundUnreadWatcher";
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

    // Use unreadStore as single source of truth for active room
    const storeActiveRoomId = useUnreadStore(s => s.activeRoomId);
    const acquireActive = useUnreadStore(s => s.acquireActive);
    const releaseActive = useUnreadStore(s => s.releaseActive);
    const directSetActive = useUnreadStore(s => s.setActiveRoomId);
    const [activeToken, setActiveToken] = useState<string | null>(null);
    const markSeen = useUnreadStore(s => s.markSeen);

    const activeRoomId = storeActiveRoomId;
    const setActiveRoomId = useCallback((roomId: string | null) => {
        const current = storeActiveRoomId == null ? null : String(storeActiveRoomId);
        const next = roomId == null ? null : String(roomId);
        // No-op if no change
        if (current === next) return;

        if (next === null) {
            try { if (activeToken) releaseActive(activeToken); } catch {}
            setActiveToken(null);
            try { directSetActive(null); } catch {}
            return;
        }
        // switch ownership token only when id actually changes
        try { if (activeToken) releaseActive(activeToken); } catch {}
        const token = acquireActive(next);
        setActiveToken(token);
        // Clear unread immediately at the origin where active is set
        try { markSeen(next); } catch {}
    }, [storeActiveRoomId, activeToken, acquireActive, releaseActive, directSetActive, markSeen]);

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

    // Enable background unread counting for non-active rooms ONLY.
    // This provider DOES NOT perform any unread increments itself.
    // Incrementing happens via:
    //   - BackgroundUnreadWatcher (joins non-active rooms) → incrementForIncoming(roomId)
    //   - (Optional) Realtime layer for rooms not currently active (if present)
    // Here we only synchronize per-room unread numbers from the store to the UI list.
    useEffect(() => {
        const tokenGetter = () => {
            try { return UserService.Instance.auth() || null; } catch { return null; }
        };
        const userIdGetter = () => (localUser?.id ?? null);
        enableBackgroundUnread(tokenGetter, userIdGetter);
        return () => { disableBackgroundUnread(); };
    }, [localUser?.id]);

    const refresh = useCallback(() => {
        execute();
    }, [execute]);

    // Refetch when WS reconnects (event dispatched from RealtimeChatContext)
    useEffect(() => {
        const off = (async () => {
            const { onWsReconnected } = await import("@/core/chat/events");
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
            const { markSeen } = (await import("@/core/chat/store/unreadStore")).useUnreadStore.getState();
            markSeen(roomId);
        } catch {}
        // If server endpoint exists, call it here
        // await axiosPrivate.post(`/messages/rooms/${roomId}/read`)
    }, []);

    // Expose a helper to move a room to the top when a new message arrives
    const bumpRoomToTop = useCallback((roomId: string, updatedAt?: string) => {
        setState((prev) => {
            // Check if the room exists in the current list
            const idx = prev.rooms.findIndex((r) => r.id === roomId);
            if (idx === -1) {
                // Log for debugging; consider fetching the room if it's new
                console.warn(`Room ${roomId} not found in current rooms list`);
                return prev;
            }

            const newUpdatedAt = updatedAt || new Date().toISOString();
            // Persist timestamp override
            activityOverridesRef.current[roomId] = newUpdatedAt;
            try {
                saveOverrides();
            } catch (e) {
                console.error('Failed to save activity overrides:', e);
            }

            // Reorder rooms: move the specified room to the top
            const room = prev.rooms[idx];
            const remaining = prev.rooms.filter((_, i) => i !== idx);
            const nextRooms = [{ ...room, updatedAt: newUpdatedAt }, ...remaining];

            return { ...prev, rooms: nextRooms };
        });
    }, [saveOverrides]);


    // Listen for global chat:new-message events for UI ordering ONLY (no unread increments here)
    useEffect(() => {
        let unsubscribe: (() => void) | null = null;
        (async () => {
            try {
                const { onChatNewMessage } = await import("@/core/chat/events");
                unsubscribe = onChatNewMessage((detail) => {
                    console.log('New message event received:', detail); // Debug log
                    if (!detail || !detail.roomId) {
                        console.warn('Invalid chat:new-message event:', detail);
                        return;
                    }

                    // Only reorder list here; unread counting handled by realtime + background watcher
                    bumpRoomToTop(detail.roomId, detail.createdAt);
                });
            } catch (e) {
                console.error('Failed to set up chat:new-message listener:', e);
            }
        })();
        return () => {
            try {
                unsubscribe?.();
            } catch (e) {
                console.error('Failed to unsubscribe from chat:new-message:', e);
            }
        };
    }, [bumpRoomToTop]);

    // === Unread Sync Layer (Display Only) ===
    // This effect mirrors the global unread store into the left room list.
    // DO NOT increment unread here. All counting must happen in the store via incrementForIncoming.
    // Rationale:
    //   - Single source of truth: useUnreadStore handles active-room policy & dedupe
    //   - Avoids double counting from multiple listeners/providers
    useEffect(() => {
        let unsub: undefined | (() => void);
        let cancelled = false;
        (async () => {
            try {
                const { useUnreadStore } = await import("@/core/chat/store/unreadStore");
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

    // Sync current rooms into the global rooms store so background watchers can observe them
    useEffect(() => {
        try {
            const setRooms = (useRoomsStore as any).getState?.().setRooms;
            if (typeof setRooms === 'function') {
                // Keep only the minimal fields the watchers need; preserve id and name for potential UI use
                const slim = state.rooms.map((r: any) => {
                    const otherId = Array.isArray(r.participants)
                        ? r.participants.find((pid: any) => String(pid) !== String(localUser?.id))
                        : r.participant?.id ?? r.peerId ?? undefined;

                    const participant = {
                        id: otherId != null ? Number(otherId) : 0,
                        // Try known fields first; fallback to room name if we don't have a dedicated profile field
                        name: r.participant?.name ?? r.participantName ?? r.profileName ?? r.peerName ?? r.name ?? 'Unknown',
                    };

                    return {
                        id: String(r.id),
                        name: r.name ?? undefined,
                        participant,
                    };
                });
                setRooms(slim);
            } else {
                // Fallback: if no setter, try to mutate a known key carefully
                const store = (useRoomsStore as any).getState?.();
                if (store && 'rooms' in store) {
                    store.rooms = state.rooms.map((r: any) => {
                        const otherId = Array.isArray(r.participants)
                            ? r.participants.find((pid: any) => String(pid) !== String(localUser?.id))
                            : r.participant?.id ?? r.peerId ?? undefined;

                        const participant = {
                            id: otherId != null ? Number(otherId) : 0,
                            name: r.participant?.name ?? r.participantName ?? r.profileName ?? r.peerName ?? r.name ?? 'Unknown',
                        };

                        return {
                            id: String(r.id),
                            name: r.name ?? undefined,
                            participant,
                        };
                    });
                }
            }
        } catch (e) {
            console.warn('[rooms-store] failed to sync rooms:', e);
        }
        // Re-run when the set of room ids changes
    }, [state.rooms.map?.(r => r.id).join('|')]);

    useEffect(() => {
        return () => {
            try { if (activeToken) releaseActive(activeToken); } catch {}
        };
    }, [activeToken, releaseActive]);

    const value = useMemo<ChatRoomsContextValue>(() => ({
        ...state,
        refresh,
        loadMore,
        markRoomRead,
        bumpRoomToTop,
        activeRoomId,
        setActiveRoomId,
    }), [state, refresh, loadMore, markRoomRead, bumpRoomToTop, activeRoomId, setActiveRoomId]);

    return (
        <ChatRoomsContext.Provider value={value}>
            {children}
        </ChatRoomsContext.Provider>
    );
};

export const useChatRoomsContext = (): ChatRoomsContextValue => {
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
