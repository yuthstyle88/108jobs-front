// hooks/useRoomPresence.ts
// Fetch initial presence snapshot via HTTP only. Realtime diffs are handled elsewhere.

import {useEffect} from 'react';
import {usePresenceStore} from '@/modules/chat/store/presenceStore';
import {HttpService} from "@/services";
import {ChatRoomId, LocalUserId} from "lemmy-js-client";
import {REQUEST_STATE} from "@/services/HttpService";
import {dbg} from "@/modules/chat/utils";

export function useRoomPresence(roomId: ChatRoomId, peerId: LocalUserId, readerId?: LocalUserId) {
  const { setSnapshot } = usePresenceStore.getState();

  // Helper: fetch & update presence snapshot once
  const fetchPeerStatusOnce = async (reason: string) => {
    try {
      const res = await HttpService.client.getPeerStatus({ roomId, peerId, readerId } as any);
      if (res.state === REQUEST_STATE.SUCCESS) {
        const payload: any = res.data;
        dbg('[useRoomPresence] getPeerStatus', { reason, roomId, peerId, readerId, payload });
        const online: boolean = payload?.online ?? payload?.data?.online;
        if (online) {
          setSnapshot([{ userId: Number(peerId), lastSeenAt: Date.now() }]);
        } else if (!online) {
          setSnapshot([]);
        }
      }
    } catch (e) {
      // keep phase=unknown; UI may show “checking…”
      dbg('[useRoomPresence] getPeerStatus error', { reason, roomId, peerId, readerId, e });
    }
  };

  // 1) Fetch snapshot via HTTP on mount/param change
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!roomId || peerId == null) return;
      if (cancelled) return;
      await fetchPeerStatusOnce('mount');
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, peerId, readerId]);

  // 2) Re-check when tab becomes visible, window focuses, page shows from bfcache, or network comes online
  useEffect(() => {
    if (!roomId || peerId == null) return;

    let timer: ReturnType<typeof setTimeout> | null = null;
    const debounced = (reason: string) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        if (
          typeof document !== 'undefined' &&
          document.visibilityState === 'visible' &&
          document.hasFocus?.()
        ) {
          fetchPeerStatusOnce(reason);
        }
      }, 120);
    };

    const onFocus = () => debounced('focus');
    const onVisibility = () => debounced('visibilitychange');
    const onPageShow = () => debounced('pageshow');
    const onOnline = () => debounced('online');

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pageshow', onPageShow);
    window.addEventListener('online', onOnline);

    // Fire once if already visible and focused
    debounced('init-visibility');

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pageshow', onPageShow);
      window.removeEventListener('online', onOnline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, peerId, readerId]);
}