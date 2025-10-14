// hooks/useRoomPresence.ts
// Wires HTTP/WS flows: fetch initial snapshot, then apply diffs.
// Call this once per room page.

import { useEffect } from 'react';
import { usePresenceStore } from '@/modules/chat/store/presenceStore';

type PhoenixChannel = {
    push: (event: string, payload?: any) => any;
    on: (event: string, cb: (payload: any) => void) => () => void; // returns off()
};

export function useRoomPresence(roomId: string, channel?: PhoenixChannel) {
    const { setSnapshot, applyDiff, setSubscribed } = usePresenceStore.getState();

    // 1) Fetch snapshot via HTTP on mount
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                //TODO change to Lemmy client
                const res = await fetch(`/api/presence/rooms/${encodeURIComponent(roomId)}`, { cache: 'no-store' });
                const data: { userId: number; lastSeenAt: number }[] = await res.json();
                if (!cancelled) setSnapshot(data);
            } catch (_) {
                // keep phase=unknown; UI should show "checking…" instead of false
            }
        })();
        return () => { cancelled = true; };
    }, [roomId]);

    // 2) Join WS, request snapshot again (fast path), then diffs
    useEffect(() => {
        if (!channel) return;

        // Ask WS for a snapshot immediately after join (optional but fast)
        channel.push('presence:get_snapshot', { roomId });

        const offSnap = channel.on('presence:snapshot', (payload: { peers: { userId: number; lastSeenAt: number }[] }) => {
            setSnapshot(payload.peers);
        });

        const offJoin = channel.on('presence:join', (p: { userId: number; lastSeenAt: number }) => {
            applyDiff({ upserts: [p] });
        });

        const offLeave = channel.on('presence:leave', (p: { userId: number }) => {
            applyDiff({ removes: [p.userId] });
        });

        const offHeartbeat = channel.on('presence:heartbeat', (p: { userId: number; lastSeenAt: number }) => {
            applyDiff({ upserts: [p] });
        });

        // Mark that WS is active (optional: helps your UI logic)
        setSubscribed();

        return () => { offSnap(); offJoin(); offLeave(); offHeartbeat(); };
    }, [channel, roomId]);
}