
import { create } from 'zustand';
import {normRoom} from "@/utils/helpers";

interface ReadStoreState {
    lastReadAtMap: Record<string, string>;        // [roomId:userId] -> createdAt
    peerLastReadAtMap: Record<string, string>;    // [roomId:userId] -> createdAt

    // set / get สำหรับฝั่งเราเอง
    setLastReadAt: (roomId: string, userId: string, at: string) => void;
    getLastReadAt: (roomId: string, userId: string) => string | undefined;

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