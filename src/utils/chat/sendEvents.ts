import { UserService } from "@/services";
import { encrypt } from "@/lib/web-crypto";
import { ensureSharedKeyForRoom, importAesKey } from "@/utils";
import {
    addOnce,
    getReceiverIdFromRoom,
    isValidOutgoingChatPayload,
    broadcastToListeners,
} from "@/utils/chat";
import {emitChatNewMessage} from "@/chat";

export interface SendMessageDeps {
    isE2EMock: boolean;
    roomId: string;
    localUserId: number;
    socket: any;
    peerPublicKeyHex?: string;
    sentSet: Set<string>;
    onAfterSend?: () => void; // ใช้เคลียร์ typing flag ที่ provider
}

export interface SendMessagePayload { message: string; id?: string }

// --- Generic event-deps for socket sends ---
export interface SendEventDeps {
  roomId: string;
  localUserId: number;
  socket: any;
}

// Safe JSON send over WebSocket
function wsSend(socket: any, obj: any) {
  if (!socket || socket.readyState !== WebSocket.OPEN) return false;
  try { socket.send(JSON.stringify(obj)); return true; } catch { return false; }
}

// --- Typing events ---
export function sendTyping(deps: SendEventDeps, typing: boolean) {
  const { roomId, localUserId, socket } = deps;
  const payload = { event: typing ? 'typing:start' : 'typing:stop', room_id: roomId, sender_id: Number(localUserId) || 0, typing };
  // Try phoenix-style emit if present (noop if not supported)
  try { (socket as any)?.emit?.(payload.event, payload); } catch {}
  wsSend(socket, payload);
}
export const sendTypingStart = (deps: SendEventDeps) => sendTyping(deps, true);
export const sendTypingStop  = (deps: SendEventDeps) => sendTyping(deps, false);

// --- Read receipt ---
export function sendReadReceipt(deps: SendEventDeps, lastMessageId: string) {
  const { roomId, localUserId, socket } = deps;
  const payload = { event: 'chat:read', room_id: roomId, last_read_message_id: String(lastMessageId || ''), reader_id: Number(localUserId) || 0 };
  try { (socket as any)?.emit?.('chat:read', payload); } catch {}
  wsSend(socket, payload);
}
// --- Room update ---
export function sendRoomUpdateEvent(
    deps: SendEventDeps,
    update: Record<string, any>
) {
    const { roomId, localUserId, socket } = deps;
    const payload = { room_id: roomId, sender_id: Number(localUserId) || 0, ...update };
    try { (socket as any)?.emit?.('room:update', payload); } catch {}
    // เผื่อ backend รองรับอ่านผ่านข้อความ JSON ธรรมดา
    wsSend(socket, { event: 'room:update', ...payload });
}

/** Centralized send-message flow used by PhoenixSocketProvider */
export async function sendChatMessage(deps: SendMessageDeps, data: SendMessagePayload) {
    const { isE2EMock, roomId, localUserId, socket, peerPublicKeyHex, sentSet, onAfterSend } = deps;

    // mock mode: ส่งในแอปอย่างเดียว
    if (isE2EMock) {
        const messageId = data.id || `msg_${crypto?.randomUUID?.() || Math.random().toString(36).slice(2)}`;
        const mockMessage = {
            id: messageId,
            senderId: Number(localUserId) || 0,
            receiverId: getReceiverIdFromRoom(roomId),
            roomId,
            content: data.message,
            createdAt: new Date().toISOString(),
            status: 1,
            isOwner: true,
        };
        broadcastToListeners(mockMessage);
        try {
            const detail = {
                id: String(messageId),
                roomId,
                content: data.message,
                senderId: Number(localUserId) || 0,
                receiverId: getReceiverIdFromRoom(roomId),
                timestamp: (mockMessage as any).createdAt,
                unread: false,
            };
            emitChatNewMessage(detail);
        } catch {}
        return;
    }

    // ข้อความว่าง ไม่ส่ง
    if (!data.message?.trim()) return;

    const messageId = data.id || (crypto?.randomUUID?.() || Math.random().toString(36).slice(2));
    if (!addOnce(sentSet, messageId)) return; // กันส่งซ้ำ

    const apiPayload: any = {
        sender_id: Number(localUserId) || 0,
        room_id: roomId,
        content: data.message,
        id: messageId,
        createdAt: new Date().toISOString(),
    };

    let payload = apiPayload;
    try {
        const token = UserService.Instance.auth();
        if (token && !UserService.Instance.authInfo?.sharedKey) {
            try {
                await ensureSharedKeyForRoom(roomId, peerPublicKeyHex);
            } catch (ex) {
                console.warn(`sendMessage: Could not derive shared key for room, sending plaintext`, ex);
            }
        }
        const sharedKeyHex = UserService.Instance.authInfo?.sharedKey;
        const shouldEncrypt = !!(token && sharedKeyHex && data.message && data.message.trim());
        if (shouldEncrypt) {
            const aesKey = await importAesKey(sharedKeyHex!, "encrypt");
            const encrypted = await encrypt(data.message, aesKey, token);
            payload = { ...apiPayload, content: encrypted };
        }
    } catch {}

    if (!isValidOutgoingChatPayload(payload)) {
        console.warn("sendMessage: Invalid outgoing payload. Message not sent.", payload);
        return;
    }

    if (socket?.readyState === WebSocket.OPEN) {
        try { socket.send(JSON.stringify(payload)); } catch {}
        // best-effort: stop typing after sending a message
        try {
            (socket as any)?.emit?.("typing:stop", {
                room_id: roomId,
                sender_id: Number(localUserId) || 0,
                typing: false,
            });
        } catch {}
        try { onAfterSend?.(); } catch {}
    } else {
        console.warn(`sendMessage: WebSocket not ready, state: ${socket?.readyState}`);
    }
}