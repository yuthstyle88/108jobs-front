import type {ChatRoomId} from "./ChatRoomId";
import {ChatStatus} from "./ChatStatus";
import {LocalUserId} from "./LocalUserId";

// Basic chat message entity from server
export type ChatMessage = {
  id: string;
  roomId: ChatRoomId;
  senderId: LocalUserId;
  content: string;
  status: ChatStatus;
  createdAt: string;
  // UI-only field to help rendering; not required from server
  isOwner?: boolean;
};
