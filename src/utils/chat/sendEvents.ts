import {UserService} from "@/services";
import {ensureSharedKeyForRoom, importAesKey} from "@/utils";
import {encrypt} from "@/lib/web-crypto";

export type PhoenixEvent =
    | "phx_join"
    | "phx_leave"
    | "phx_reply"
    | "phx_error"
    | "phx_close"
    | "new_message" // custom
    | "typing:start"
    | "typing:stop"
    | "chat:read"
    | "room:update";

export interface ChatMessage {
    id: string;
    content: string;
    createdAt: Date;
}

// generic payload (ChatMessage, error, หรืออื่นๆ)
export interface PhoenixPacket<T = any> {
    event: PhoenixEvent;
    payload?: T;
}

// ฟังก์ชันกลาง สำหรับสร้าง event
export function createEvent<T>(
    event: PhoenixEvent,
    payload?: T
): PhoenixPacket<T> {
    return {event, payload};
}

// ฟังก์ชันย่อย สำหรับสร้าง new_message event โดยเฉพาะ
export function createMessage(content: string, id?: string): PhoenixPacket<ChatMessage> {
    if(!content || content.trim().length === 0) {
        throw new Error("Message content is required");
    }

    const message: ChatMessage = {
        id: id ?? crypto.randomUUID(),
        content,
        createdAt: new Date(),
    };

    return createEvent("new_message", message);
}

export interface SendMessageDeps {
    isE2EMock: boolean;
    roomId: string;
    localUserId: number;
    peerPublicKeyHex?: string;
    sentSet: Set<string>;
    onAfterSend?: () => void; // ใช้เคลียร์ typing flag ที่ provider
    socket: any;
}

export interface SendMessagePayload {
    message: string;
    id?: string
}

// --- Generic event-deps for socket sends ---
export interface SendEventDeps {
    roomId: string;
    localUserId: number;
    socket: any;
}

// Safe JSON send over WebSocket
function wsSend(socket: any, obj: any) {
    if(!socket || socket.readyState !== WebSocket.OPEN) return false;
    try {
        socket.send(JSON.stringify(obj));
        return true;
    } catch {
        return false;
    }
}

// --- Typing events ---
export function sendTyping(deps: SendEventDeps, typing: boolean) {
    const {roomId, localUserId, socket} = deps;
    const packet = createEvent(
        typing ? "typing:start" : "typing:stop",
        {typing},
    );
    wsSend(socket, packet);
}

export const sendTypingStart = (deps: SendEventDeps) => sendTyping(deps, true);
export const sendTypingStop = (deps: SendEventDeps) => sendTyping(deps, false);

// --- Read receipt ---
export function sendReadReceipt(deps: SendEventDeps, lastMessageId: string) {
    const {roomId, localUserId, socket} = deps;
    const packet = createEvent(
        "chat:read",
        {last_read_message_id: String(lastMessageId || "")},
    );
    wsSend(socket, packet);
}

// --- Room update ---
export function sendRoomUpdateEvent(
    deps: SendEventDeps,
    update: Record<string, any>
) {
    const {roomId, localUserId, socket} = deps;
    const packet = createEvent(
        "room:update",
        {...update},
    );
    wsSend(socket, packet);
}

/** Centralized send-message flow used by PhoenixSocketProvider */
export async function sendChatMessage(deps: SendMessageDeps, data: SendMessagePayload) {
    const {roomId, localUserId, peerPublicKeyHex, socket} = deps;

    try {
        const messageId = crypto.randomUUID(); // It would take over 100 trillion years to reach even a tiny chance of collision.
        const token = UserService.Instance.auth();

        // 1. Ensure we have a shared key for this room
        if(token && !UserService.Instance.authInfo?.sharedKey) {
            try {
                await ensureSharedKeyForRoom(roomId, peerPublicKeyHex);
            } catch (ex) {
                console.warn(
                    `sendMessage: Could not derive shared key for room, sending plaintext`,
                    ex
                );
            }
        }
        const sharedKeyHex = UserService.Instance.authInfo?.sharedKey;
        const shouldEncrypt = token && sharedKeyHex && data.message && data.message.trim();

        let finalContent = data.message;

        if(shouldEncrypt) {
            try {
                const aesKey = await importAesKey(sharedKeyHex!, "encrypt");
                finalContent = await encrypt(data.message, aesKey);
            } catch (err) {
                console.warn(
                    `sendMessage: Encryption failed, falling back to plaintext`,
                    err
                );
            }
        }
        const packet = createMessage(finalContent, String(messageId));
        wsSend(socket, packet);
    } catch (ignored) {
    }
    return;

}
