import type { PostId } from "./PostId";
import type { ChatRoomId } from "./ChatRoomId";

// Matches backend StartWorkflow with camelCase fields
export type StartWorkflow = {
  postId: PostId;
  seqNumber: number; // i16 backend
  roomId: ChatRoomId;
};
