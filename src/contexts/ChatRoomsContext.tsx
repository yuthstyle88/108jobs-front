"use client";

import React, {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {ChatRoom as AppChatRoom} from "@/types/chat";
import {HttpService, UserService} from "@/services";
// E2EE exchange is ensured for future needs
import {exchange} from "@/lib/api/auth";
import {useHttpGet} from "@/hooks/useHttpGet";
import type { ListUserChatRoomsResponse } from "@/lib/lemmy-js-client/src/types/ListUserChatRoomsResponse";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {REQUEST_STATE} from "@/services/HttpService";

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
    updateRoomLastMessage: (roomId: string, content: string, senderId: number, timestamp?: string) => void;
}

const ChatRoomsContext = createContext<ChatRoomsContextValue | undefined>(undefined);

export const ChatRoomsProvider: React.FC<{ children: React.ReactNode; pageSize?: number }>
    = ({children, pageSize = 20}) => {
    const [page, setPage] = useState(1);
    const sharedKeyReadyRef = useRef(false);
    const { localUser } = useMyUser();

    const { state: reqState, data, isMutating: isLoading, execute } = useHttpGet("listChatRooms", { limit: page * pageSize });
    const error = reqState.state === "failed" ? (reqState as any).err : null;

    // Ensure shared key once for decrypting previews
    useEffect(() => {
        (async () => {
            if (sharedKeyReadyRef.current) return;
            try {
                const token = UserService.Instance.auth();
                if (!token) return;
                const stored = UserService.Instance.authInfo?.sharedKey || (typeof window !== 'undefined' ? localStorage.getItem('sharedKey_global') : null);
                if (!stored) {
                    const derived = await exchange();
                    UserService.Instance.authInfo = {
                        ...(UserService.Instance.authInfo || {auth: token}),
                        sharedKey: derived,
                        claims: UserService.Instance.authInfo?.claims,
                    };
                    if (typeof window !== 'undefined') localStorage.setItem('sharedKey_global', derived);
                }
                sharedKeyReadyRef.current = true;
            } catch {
                // best-effort, previews may remain encrypted
            }
        })();
    }, []);


    const mapToRooms = useCallback(async (input?: ListUserChatRoomsResponse): Promise<RoomsState> => {
        const items = input?.rooms || [];
        const totalLoaded = items.length;
        const hasMore = totalLoaded >= page * pageSize;
        const mapped: AppChatRoom[] = [];
        for (const it of items as any[]) {
            const other = it.participants.find(
                (p: any) => String(p.memberId) !== String(localUser?.id)
            );

            const res = await HttpService.client.visitProfile(String(other.memberId));
            const profile = res.state === REQUEST_STATE.SUCCESS ? res?.data.profile : { name: "Unknown" };

            mapped.push({
                id: String(it.room.id),
                name: profile.name,
                participants: it.participants.map((p: any) => String(p.memberId)),
                lastMessage: {
                    content: it.lastMessage?.content,
                    timestamp: it.lastMessage?.timestamp,
                    senderId: it.lastMessage?.senderId,
                },
                unreadCount: 0,
            });
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
                        (r.lastMessage?.content || '') === (n.lastMessage?.content || '') &&
                        (r.lastMessage?.timestamp || '') === (n.lastMessage?.timestamp || '') &&
                        (r.lastMessage?.senderId || 0) === (n.lastMessage?.senderId || 0) &&
                        r.unreadCount === n.unreadCount;
                });
                if (isSame) {
                    return { ...prev, isLoading: isLoading, error } as any;
                }
                return {
                    ...prev,
                    isLoading: isLoading,
                    error,
                    page: result.page,
                    pageSize: result.pageSize,
                    hasMore: result.hasMore,
                    rooms: mergedRooms as any,
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

    const loadMore = useCallback(() => {
        if (state.hasMore && !isLoading) setPage(p => p + 1);
    }, [state.hasMore, isLoading]);

    const markRoomRead = useCallback(async (roomId: string) => {
        // Optimistically zero out unread count for UX; integrate API when available
        setState(prev => ({...prev, rooms: prev.rooms.map(r => r.id === roomId ? {...r, unreadCount: 0} : r)}));
        // If server endpoint exists, call it here
        // await axiosPrivate.post(`/messages/rooms/${roomId}/read`)
    }, []);

    // Expose a helper to move a room to the top when a new message arrives
    const bumpRoomToTop = useCallback((roomId: string, updatedAt?: string) => {
        setState(prev => {
            const idx = prev.rooms.findIndex(r => r.id === roomId);
            if (idx === -1) return prev;
            const room = prev.rooms[idx] as any;
            const newUpdatedAt = updatedAt || new Date().toISOString();
            const updatedRoom = { ...room, lastMessage: { ...(room.lastMessage || {}), timestamp: newUpdatedAt } };
            const remaining = prev.rooms.filter((_, i) => i !== idx);
            const nextRooms = [updatedRoom as any, ...remaining];
            return { ...prev, rooms: nextRooms } as any;
        });
    }, []);

    const updateRoomLastMessage = useCallback((roomId: string, content: string, senderId: number, timestamp?: string) => {
        setState(prev => {
            const idx = prev.rooms.findIndex(r => r.id === roomId);
            if (idx === -1) return prev;
            const room = prev.rooms[idx] as any;
            const ts = timestamp || new Date().toISOString();
            const updatedRoom = {
                ...room,
                lastMessage: {
                    content,
                    timestamp: ts,
                    senderId,
                },
            };
            const remaining = prev.rooms.filter((_, i) => i !== idx);
            const nextRooms = [updatedRoom as any, ...remaining];
            return { ...prev, rooms: nextRooms } as any;
        });
    }, []);

    // Listen for global chat:new-message events to immediately update the left list
    useEffect(() => {
        const handler = (e: Event) => {
            const detail = (e as CustomEvent).detail as { roomId: string; content: string; senderId: number; timestamp?: string };
            if (!detail || !detail.roomId) return;
            updateRoomLastMessage(detail.roomId, detail.content, detail.senderId, detail.timestamp);
        };
        window.addEventListener('chat:new-message' as any, handler as any);
        return () => window.removeEventListener('chat:new-message' as any, handler as any);
    }, [updateRoomLastMessage]);

    const value = useMemo<ChatRoomsContextValue>(() => ({
        ...state,
        refresh,
        loadMore,
        markRoomRead,
        bumpRoomToTop,
        updateRoomLastMessage,
    }), [state, refresh, loadMore, markRoomRead, bumpRoomToTop, updateRoomLastMessage]);

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
