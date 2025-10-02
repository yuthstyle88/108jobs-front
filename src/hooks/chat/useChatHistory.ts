import {useCallback, useEffect, useRef, useState} from 'react';
import {fetchHistoryPage} from '@/utils/chat/chat-socket-utils';

export type UseChatHistoryOptions = {
  roomId: string;
  pageSize?: number;
  isE2EMock?: boolean;
  localUserId: number;
  receivedSet: Set<string>;
  broadcast: (m: any) => void;
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
  const { roomId, pageSize = 20, isE2EMock = false, localUserId, receivedSet, broadcast } = opts;

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
      const { prev, next } = await fetchHistoryPage(
        { roomId, cursor: pageCursor, limit: pageSize },
        {
          localUserId,
          receivedSet,
          broadcast,
        },
      );

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
    state: { pageCursor, hasMore, isFetching },
    actions: { fetchHistory, reset },
  };
}