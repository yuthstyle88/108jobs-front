// hooks/useRoomPresence.ts
// Fetch initial presence snapshot via HTTP only. Realtime diffs are handled elsewhere.

import {useEffect} from 'react';
import {usePresenceStore} from '@/modules/chat/store/presenceStore';
import {HttpService} from "@/services";
import {ChatRoomId, LocalUserId} from "@/lib/lemmy-js-client/src";

export function useRoomPresence(roomId: ChatRoomId, peerId: LocalUserId) {
    const { setSnapshot } = usePresenceStore.getState();

    // 1) Fetch snapshot via HTTP on mount
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await HttpService.client.getPeerStatus({ localUserId: peerId });
                console.log("res", res)
                // Support either `res.json()` or direct data depending on client impl
                const data = Array.isArray((res as any)?.peers)
                  ? (res as any).peers
                  : (typeof (res as any)?.json === 'function'
                      ? await (res as any).json()
                      : (res as any));
                if (!cancelled && Array.isArray(data)) {
                    setSnapshot(data as { userId: number; lastSeenAt: number }[]);
                }
            } catch (_e) {
                // keep phase=unknown; UI may show “checking…”
            }
        })();
        return () => { cancelled = true; };
    }, [roomId, peerId, setSnapshot]);
}