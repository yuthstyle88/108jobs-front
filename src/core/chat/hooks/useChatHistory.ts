import React, {useCallback, useEffect, useRef, useState} from 'react';
import {fetchHistoryPage} from '@/core/chat/utils/chatSocketUtils';
import {ChatMessage} from "lemmy-js-client";

export type UseChatHistoryOptions = {
    roomId: string;
    pageSize?: number;
    isE2EMock?: boolean;
    localUserId: number;
    receivedSet: Set<string>;
    broadcast: (m: any) => void;
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
};

export type UseChatHistoryResult = {
    state: {
        pageCursor: string | null;
        hasMore: boolean;
        isFetching: boolean;
    };
    actions: {
        fetchHistory: () => Promise<void>;
        reset: () => void;
    };
};

export function useChatHistory(opts: UseChatHistoryOptions): UseChatHistoryResult {
    const {roomId, pageSize = 20, isE2EMock = false, localUserId, receivedSet, broadcast, setMessages} = opts;

    const [pageCursor, setPageCursor] = useState<string | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const fetchingRef = useRef(false);
    const lastCursorRef = useRef<string | null>(null);
    const lastTotalRef = useRef<number>(0);

    // Reset cursor/state when room changes
    useEffect(() => {
        setPageCursor(null);
        setHasMore(true);
        fetchingRef.current = false;
        lastCursorRef.current = null;
        lastTotalRef.current = 0;
        console.debug('[useChatHistory] reset for room', roomId);
    }, [roomId]);

    const fetchHistory = useCallback(async () => {
        if (isE2EMock || fetchingRef.current || !hasMore) return;
        fetchingRef.current = true;
        setIsFetching(true);
        try {
            const {prev, next, items} = await fetchHistoryPage(
                {roomId, cursor: pageCursor, limit: pageSize},
                {
                    localUserId,
                    receivedSet,
                    broadcast,
                },
            );

            let filteredCount = 0;
            if (items && Array.isArray(items)) {
                setMessages((prevList) => {
                    const existingIds = new Set(prevList.map((m) => m.id));
                    // NOTE: server may return newest->oldest for backfill. If needed, reverse here.
                    const incoming = items; // or: [...items].reverse()
                    const filtered = incoming.filter((m) => !existingIds.has(m.id));
                    filteredCount = filtered.length;
                    if (filteredCount === 0) return prevList;
                    // Backfill older messages should be PREPENDED to keep overall order oldest->newest
                    const next = [...filtered, ...prevList];
                    lastTotalRef.current = next.length;
                    return next;
                });
            }

            // For backfill, use `prev` to continue going backward
            const prevCursor = (typeof prev === 'string' && prev.length > 0) ? prev : null;
            const sameCursor = prevCursor !== null && prevCursor === lastCursorRef.current;
            if (filteredCount === 0 && sameCursor) {
                console.debug('[useChatHistory] stop: no new items & cursor unchanged');
                setPageCursor(null);
                setHasMore(false);
            } else if (prevCursor) {
                lastCursorRef.current = prevCursor;
                setPageCursor(prevCursor);
                setHasMore(true);
                console.debug('[useChatHistory] next prev-cursor =', prevCursor);
            } else {
                console.debug('[useChatHistory] end reached: hasMore=false');
                setPageCursor(null);
                setHasMore(false);
            }

            console.debug('[useChatHistory] page done', { filteredCount, hasMoreCandidate: (typeof prev === 'string' && prev.length > 0) });
        } catch (e) {
            console.error('[useChatHistory] fetchHistory failed', e);
        } finally {
            fetchingRef.current = false;
            setIsFetching(false);
        }
    }, [isE2EMock, roomId, pageCursor, pageSize, localUserId, receivedSet, broadcast, hasMore]);

    const reset = useCallback(() => {
        setPageCursor(null);
        setHasMore(true);
        setIsFetching(false);
        fetchingRef.current = false;
    }, []);

    return {
        state: {pageCursor, hasMore, isFetching},
        actions: {fetchHistory, reset},
    };
}
