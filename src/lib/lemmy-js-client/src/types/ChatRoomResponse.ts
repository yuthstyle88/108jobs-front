import type { ChatRoomView } from "./ChatRoomView";
import type { LastMessage } from "./LastMessage";
import type { WorkflowStatus } from "./WorkflowStatus";

// Matches backend ChatRoomResponse with camelCase fields
export type ChatRoomResponse = {
    room: ChatRoomView;
    lastMessage?: LastMessage;
    workflowStatus?: WorkflowStatus;
};