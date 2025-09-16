import type { ChatRoom } from "./ChatRoom";
import type { ChatParticipant } from "./ChatParticipant";
import type { Post } from "./Post";

/**
 * A chat room view, including its participants and an optional linked post.
 * Matches backend camelCase fields.
 */
export type ChatRoomView = {
  room: ChatRoom;
  participants: ChatParticipant[];
  post?: Post;
};
