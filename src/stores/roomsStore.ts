import { create } from 'zustand';

// Each Room represents a 1-to-1 conversation, so it has exactly one participant besides the current user.
export type Room = {
    id: string;
    name: string;
    participant: { id: number; name: string }; // exactly one participant (the other person in the room)
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
