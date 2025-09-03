import {ChatRoomId} from "./ChatRoomId";

export type ChatRoom = {
    id: ChatRoomId;
    roomName: string;
    createdAt: string;
    updatedAt?: string;
}