import { create } from 'zustand';

export type Room = {
    id: string;
    name: string;
    // other metadata if needed
};

export type RoomsState = {
    rooms: Room[];
    setRooms: (rooms: Room[]) => void;
    addRoom: (room: Room) => void;
    removeRoom: (roomId: string) => void;
};

export const useRoomsStore = create<RoomsState>((set) => ({
    rooms: [],
    setRooms: (rooms) => set({ rooms }),
    addRoom: (room) => set((s) => ({ rooms: [...s.rooms, room] })),
    removeRoom: (roomId) => set((s) => ({ rooms: s.rooms.filter(r => r.id !== roomId) })),
}));
