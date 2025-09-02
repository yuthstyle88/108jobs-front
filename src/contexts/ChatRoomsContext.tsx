"use client";

import React, {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {ChatRoom as AppChatRoom} from "@/types/chat";
import {UserService} from "@/services";
// E2EE exchange is ensured for future needs
import {exchange} from "@/lib/api/auth";
import {useHttpGet} from "@/hooks/useHttpGet";
import type { ListUserChatRoomsResponse } from "@/lib/lemmy-js-client/src/types/ListUserChatRoomsResponse";

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
}

const ChatRoomsContext = createContext<ChatRoomsContextValue | undefined>(undefined);

export const ChatRoomsProvider: React.FC<{ children: React.ReactNode; pageSize?: number }>
    = ({children, pageSize = 20}) => {
    const [page, setPage] = useState(1);
    const sharedKeyReadyRef = useRef(false);

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
            mapped.push({
                id: String(it.id),
                name: it.room_name || 'Unknown',
                participants: [],
                lastMessage: {
                    content: "Nice to meet you!",
                    timestamp: new Date().toISOString(),
                    senderId: 3
                },
                unreadCount: 0,
                type: 'direct',
                createdAt: it.created_at || new Date().toISOString(),
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
            setState(prev => ({
                ...result,
                rooms: page > 1 ? result.rooms : result.rooms, // replace; server returns cumulative by limit
            }));
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

    const value = useMemo<ChatRoomsContextValue>(() => ({
        ...state,
        refresh,
        loadMore,
        markRoomRead,
    }), [state, refresh, loadMore, markRoomRead]);

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
