import type { PersonId } from "./PersonId";
import type { ChatRoomId } from "./ChatRoomId";
import type { PostId } from "./PostId";

// Request body for POST /chat/rooms (create_chat_room)
// Uses camelCase field names to match API expectations
export type CreateChatRoomRequest = {
  partnerPersonId: PersonId;
  roomId?: ChatRoomId;
  postId?: PostId;
};
