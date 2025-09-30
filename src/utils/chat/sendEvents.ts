import {UserService} from "@/services";
import {ensureSharedKeyForRoom, importAesKey} from "@/utils";
import {
    getReceiverIdFromRoom,
} from "@/utils/chat";
import {emitChatNewMessage} from "@/chat";
import {encrypt} from "@/lib/web-crypto";

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
    if (!socket || socket.readyState !== WebSocket.OPEN) return false;
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
    const payload = {
        event: typing ? 'typing:start' : 'typing:stop',
        room_id: roomId,
        sender_id: Number(localUserId) || 0,
        typing
    };
    wsSend(socket, payload);
}

export const sendTypingStart = (deps: SendEventDeps) => sendTyping(deps, true);
export const sendTypingStop = (deps: SendEventDeps) => sendTyping(deps, false);

// --- Read receipt ---
export function sendReadReceipt(deps: SendEventDeps, lastMessageId: string) {
    const {roomId, localUserId, socket} = deps;
    const payload = {
        event: 'chat:read',
        room_id: roomId,
        last_read_message_id: String(lastMessageId || ''),
        reader_id: Number(localUserId) || 0
    };
    wsSend(socket, payload);
}

// --- Room update ---
export function sendRoomUpdateEvent(
    deps: SendEventDeps,
    update: Record<string, any>
) {
    const {roomId, localUserId, socket} = deps;
    const payload = {room_id: roomId, sender_id: Number(localUserId) || 0, ...update};
    // เผื่อ backend รองรับอ่านผ่านข้อความ JSON ธรรมดา
    wsSend(socket, {event: 'room:update', ...payload});
}

/** Centralized send-message flow used by PhoenixSocketProvider */
export async function sendChatMessage(deps: SendMessageDeps, data: SendMessagePayload) {
    const {roomId, localUserId, peerPublicKeyHex, socket} = deps;

    try {
        const messageId = crypto.randomUUID(); // It would take over 100 trillion years to reach even a tiny chance of collision.
        const token = UserService.Instance.auth();

        // 1. Ensure we have a shared key for this room
        if (token && !UserService.Instance.authInfo?.sharedKey) {
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

        if (shouldEncrypt) {
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
        const detail = {
            id: String(messageId),
            roomId,
            content: finalContent,
            senderId: Number(localUserId) || 0,
            receiverId: getReceiverIdFromRoom(roomId),
            timestamp: new Date().toISOString(),
            unread: false,
        };
        wsSend(socket, detail);
    } catch (ignored) {
    }
    return;

}
