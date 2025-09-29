import type {LocalUserId} from "./LocalUserId";
import type {ChatRoomId} from "./ChatRoomId";

// Basic chat message entity from server
export type ChatMessage = {
  id: number | string;
  roomId: ChatRoomId;
  senderId: LocalUserId;
  receiverId: LocalUserId;
  content: string;
  status: number;
  createdAt: string;
  // UI-only field to help rendering; not required from server
  isOwner?: boolean;
};
