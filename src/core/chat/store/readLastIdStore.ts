
import { create } from 'zustand';
import {normRoom} from "@/utils/helpers";

interface ReadStoreState {
    lastReadAtMap: Record<string, string>;        // [roomId:userId] -> createdAt
    peerLastReadAtMap: Record<string, string>;    // [roomId:userId] -> createdAt

    // set / get สำหรับฝั่งเราเอง
    setLastReadAt: (roomId: string, userId: string, at: string) => void;
    getLastReadAt: (roomId: string, userId: string) => string | undefined;

    // set / get สำหรับฝั่งคู่สนทนา (peer)
    setPeerLastReadAt: (roomId: string, userId: string | number, at: string) => void;
    getPeerLastReadAt: (roomId: string, userId: string | number) => string | undefined;

    // ล้าง cache เฉพาะห้องหรือทั้งหมด
    clearRoom: (roomId: string) => void;
    clearAll: () => void;
}

export const useReadLastIdStore = create<ReadStoreState>((set, get) => ({
    lastReadAtMap: {},
    peerLastReadAtMap: {},

    setLastReadAt: (roomId, userId, at) => {
        const key = `${normRoom(roomId)}:${userId}`;
        set((s) => ({
            lastReadAtMap: { ...s.lastReadAtMap, [key]: String(at) },
        }));
    },

    getLastReadAt: (roomId, userId) => {
        const key = `${normRoom(roomId)}:${userId}`;
        return get().lastReadAtMap[key];
    },

    setPeerLastReadAt: (roomId, userId, at) => {
        const key = `${normRoom(roomId)}:${String(userId)}`;
        set((s) => ({
            peerLastReadAtMap: { ...s.peerLastReadAtMap, [key]: String(at) },
        }));
    },

    getPeerLastReadAt: (roomId, userId) => {
        const key = `${normRoom(roomId)}:${String(userId)}`;
        return get().peerLastReadAtMap[key];
    },

    clearRoom: (roomId) => {
        const rk = normRoom(roomId);
        set((s) => {
            const next1 = { ...s.lastReadAtMap };
            const next2 = { ...s.peerLastReadAtMap };
            for (const k of Object.keys(next1))
                if (k.startsWith(`${rk}:`)) delete next1[k];
            for (const k of Object.keys(next2))
                if (k.startsWith(`${rk}:`)) delete next2[k];
            return { lastReadAtMap: next1, peerLastReadAtMap: next2 };
        });
    },

    clearAll: () => set({ lastReadAtMap: {}, peerLastReadAtMap: {} }),
}));

/**
 * Prune read-last maps to only keep entries for rooms that still exist.
 * Call this from roomsStore when the rooms list changes.
 */
export function pruneReadLastByRooms(rooms: Array<{ id: string | number }>) {
    const allowed = new Set<string>(Array.isArray(rooms) ? rooms.map((r: any) => String(normRoom(r?.id ?? ''))) : []);
    const st = useReadLastIdStore.getState();

    const pruneMap = (m: Record<string, string>) => {
        const next: Record<string, string> = {};
        let changed = false;
        for (const [k, v] of Object.entries(m)) {
            const [rk] = k.split(":");
            if (allowed.has(String(rk))) {
                next[k] = v;
            } else {
                changed = true;
            }
        }
        return { next, changed } as const;
    };

    const { next: next1, changed: c1 } = pruneMap(st.lastReadAtMap);
    const { next: next2, changed: c2 } = pruneMap(st.peerLastReadAtMap);

    if (!c1 && !c2) return;

    useReadLastIdStore.setState((s) => ({
        ...s,
        lastReadAtMap: next1,
        peerLastReadAtMap: next2,
    }));
}