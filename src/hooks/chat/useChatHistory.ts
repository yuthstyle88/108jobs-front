import React, {useCallback, useEffect, useRef, useState} from 'react';
import {fetchHistoryPage} from '@/utils/chat/chatSocketUtils';
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

    // Reset cursor/state when room changes
    useEffect(() => {
        setPageCursor(null);
        setHasMore(true);
        fetchingRef.current = false;
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

            if (items && Array.isArray(items)) {
                const mapped = mapMessagesViewToChatMessages(items, localUserId);

                setMessages((prevList) => {
                    const existingIds = new Set(prevList.map((m) => m.id));
                    const filtered = mapped.filter((m) => !existingIds.has(m.id));
                    return [...prevList, ...filtered]; // append or prepend based on your order
                });
            }

            // For backfill pagination, server returns { prev, next }.
            // We should use `prev` as the next cursor to continue going backward.
            if (typeof prev === 'string' && prev.length > 0) {
                setPageCursor(prev); // FIX: previously set to `next`, which was wrong for backfill
                setHasMore(true);
            } else {
                setPageCursor(null);
                setHasMore(false);
            }
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

function mapMessagesViewToChatMessages(
    messageView: any[],
    localUserId: number
): ChatMessage[] {
    return messageView.map((item) => {
        const m = item.message;
        return {
            id: m.msgRefId,
            roomId: m.roomId,
            senderId: m.senderId,
            content: m.content,
            status: m.status,
            createdAt: m.createdAt,
            isOwner: m.senderId === localUserId,
        };
    });
}
