// ฟังก์ชันย่อย สำหรับสร้าง chat:message event โดยเฉพาะ
import type {ChatMessage, ChatRoomId, ChatStatus, LocalUserId} from "lemmy-js-client";

export function createMessage(
  content: string,
  roomId: ChatRoomId,
  senderId: LocalUserId,
  id?: string,
): ChatMessage {
    if (!content || content.trim().length === 0) {
        throw new Error("Message content is required");
    }
    return {
        id: id ?? crypto.randomUUID(),
        roomId,
        senderId,
        content,
        status: "pending" as ChatStatus,
        createdAt: new Date().toISOString(),
    };
}