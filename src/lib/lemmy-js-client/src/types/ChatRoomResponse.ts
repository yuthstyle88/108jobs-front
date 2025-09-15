import {ChatRoom} from "./ChatRoom";
import {ChatParticipant} from "./ChatParticipant";
import {LastMessage} from "./LastMessage";
import {WorkflowStatus} from "./WorkflowStatus";
import { PostId } from "./PostId";

export type ChatRoomResponse = {
    room: ChatRoom,
    participants: ChatParticipant[],
    lastMessage?: LastMessage,
    // Workflow state can also be present at the wrapper level depending on API
    workflowStatus?: WorkflowStatus;
    postId?: PostId;
}