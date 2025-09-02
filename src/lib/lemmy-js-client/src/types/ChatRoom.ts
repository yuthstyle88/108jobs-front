import {ChatRoomId} from "./ChatRoomId";

export type ChatRoom = {
    id: ChatRoomId;
    room_name: string;
    created_at: string;
    updated_at?: string;
}