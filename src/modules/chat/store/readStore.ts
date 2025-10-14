import { create } from 'zustand'
import { ChatRoomId, LocalUserId } from "lemmy-js-client";

// Helper to normalize room id (string/number)
function normRoom(roomId: string | number): string {
    return String(roomId);
}

interface ReadStoreState {
    /** Unified map: key = `${roomId}:${userId}` */
    byRoomUser: Record<string, { lastReadAt?: string; lastReadMsgId?: string; updatedAt?: number | null }>;

    // self-side (legacy API kept)
    setLastReadAt: (roomId: ChatRoomId, userId: LocalUserId, at: string | null | undefined) => void;
    getLastReadAt: (roomId: ChatRoomId, userId: LocalUserId) => string | undefined;

    // peer-side (use same map)
    setPeerLastReadAt: (roomId: ChatRoomId, userId: LocalUserId | number, at: string | null | undefined) => void;
    getPeerLastReadAt: (roomId: ChatRoomId, userId: LocalUserId | number) => string | undefined;

    // optional: last-read message id API (unified)
    setLastReadMsgId: (roomId: ChatRoomId, userId: LocalUserId | number, msgId: string | null | undefined, updatedAt?: string | number | null) => void;
    getLastReadMsgId: (roomId: ChatRoomId, userId: LocalUserId | number) => string | undefined;

    // clear helpers
    clearRoom: (roomId: string) => void;
    clearAll: () => void;
}

export const useReadLastIdStore = create<ReadStoreState>((set, get) => ({
    byRoomUser: {},

    setLastReadAt: (roomId, userId, at) => {
        const k = `${normRoom(roomId)}:${String(userId)}`;
        const val = (at == null ? undefined : String(at));
        set((s) => ({
            byRoomUser: { ...s.byRoomUser, [k]: { ...s.byRoomUser[k], lastReadAt: val } },
        }));
    },

    getLastReadAt: (roomId, userId) => {
        const k = `${normRoom(roomId)}:${String(userId)}`;
        return get().byRoomUser[k]?.lastReadAt;
    },

    setPeerLastReadAt: (roomId, userId, at) => {
        const k = `${normRoom(roomId)}:${String(userId)}`;
        const val = (at == null ? undefined : String(at));
        set((s) => ({
            byRoomUser: { ...s.byRoomUser, [k]: { ...s.byRoomUser[k], lastReadAt: val } },
        }));
    },

    getPeerLastReadAt: (roomId, userId) => {
        const k = `${normRoom(roomId)}:${String(userId)}`;
        return get().byRoomUser[k]?.lastReadAt;
    },

    setLastReadMsgId: (roomId, userId, msgId, updatedAt) => {
        const k = `${normRoom(roomId)}:${String(userId)}`;
        const val = (msgId == null ? undefined : String(msgId));
        const ts = (updatedAt == null ? null : (typeof updatedAt === 'number' ? updatedAt : Number(updatedAt)));
        set((s) => ({
            byRoomUser: { ...s.byRoomUser, [k]: { ...s.byRoomUser[k], lastReadMsgId: val, updatedAt: ts ?? s.byRoomUser[k]?.updatedAt ?? null } },
        }));
    },

    getLastReadMsgId: (roomId, userId) => {
        const k = `${normRoom(roomId)}:${String(userId)}`;
        return get().byRoomUser[k]?.lastReadMsgId;
    },

    clearRoom: (roomId) => {
        const rk = String(normRoom(roomId));
        set((s) => {
            const next = { ...s.byRoomUser };
            for (const k of Object.keys(next)) if (k.startsWith(`${rk}:`)) delete next[k];
            return { byRoomUser: next };
        });
    },

    clearAll: () => set({ byRoomUser: {} }),
}));

export function pruneReadLastByRooms(rooms: Array<{ id: string | number }>) {
    const allowed = new Set<string>(Array.isArray(rooms) ? rooms.map((r: any) => String(normRoom(r?.id ?? ''))) : []);
    const st = useReadLastIdStore.getState();

    const next: Record<string, { lastReadAt?: string; lastReadMsgId?: string; updatedAt?: number | null }> = {};
    let changed = false;

    for (const [k, v] of Object.entries(st.byRoomUser)) {
        const [rk] = k.split(":");
        if (allowed.has(String(rk))) next[k] = v; else changed = true;
    }

    if (changed) useReadLastIdStore.setState({ byRoomUser: next });
}