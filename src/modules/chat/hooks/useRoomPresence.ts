// hooks/useRoomPresence.ts
// Fetch initial presence snapshot via HTTP only. Realtime diffs are handled elsewhere.

import {useEffect} from 'react';
import {usePresenceStore} from '@/modules/chat/store/presenceStore';
import {HttpService} from "@/services";
import {ChatRoomId, LocalUserId} from "lemmy-js-client";
import {REQUEST_STATE} from "@/services/HttpService";
import {dbg} from "@/modules/chat/utils";

export function useRoomPresence(roomId: ChatRoomId, peerId: LocalUserId) {
    const { setSnapshot } = usePresenceStore.getState();

    // 1) Fetch snapshot via HTTP on mount
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await HttpService.client.getPeerStatus({ roomId, peerId });
                // normalize payload – support both `{ data: { online: bool } }` and raw `{ online: bool }`
                if(res.state === REQUEST_STATE.SUCCESS) {
                    let payload: any = res.data;
                    dbg('[useRoomPresence] getPeerStatus', {roomId, peerId, payload});
                    const online: boolean = payload.online ?? payload.data?.online;
                    if(!cancelled && online !== undefined) {
                        if(online) {
                            dbg('[useRoomPresence] peer online', {roomId, peerId});
                            // mark peer online with current timestamp
                            setSnapshot([{userId: Number(peerId), lastSeenAt: Date.now()}]);
                        } else {
                            // peer offline → empty snapshot for this room (no online peers)
                            setSnapshot([]);
                        }
                    }
                }
            } catch (_e) {
                // keep phase=unknown; UI may show “checking…”
            }
        })();
        return () => { cancelled = true; };
    }, [roomId, peerId, setSnapshot]);
}