import {ChatRoom} from "./ChatRoom";
import {ChatParticipant} from "./ChatParticipant";
import {LastMessage} from "./LastMessage";

export type ChatRoomWithParticipants = {
    room: ChatRoom,
    participants: ChatParticipant[],
    lastMessage?: LastMessage,
}