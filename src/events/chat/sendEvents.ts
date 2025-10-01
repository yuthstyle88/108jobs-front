import type { ChatMessage } from "lemmy-js-client";
import {UserService} from "@/services";
import {ensureSharedKeyForRoom, importAesKey} from "@/utils";
import {encrypt} from "@/lib/web-crypto";
import { emitChatNewMessage } from "@/events/chat";

export type PhoenixEvent =
    | "phx_join"
    | "phx_leave"
    | "phx_reply"
    | "phx_error"
    | "phx_close"
    | "new_message" // custom
    | "chat:typing" // unified typing
    | "chat:read"
    | "room:update";

// generic payload (ChatMessage, error, หรืออื่นๆ)
export interface PhoenixPacket<T = any> {
    event: PhoenixEvent;
    payload?: T;
}

// ฟังก์ชันกลาง สำหรับสร้าง event (รองรับ meta + ลบ key undefined)
export function createEvent<T>(
    event: PhoenixEvent,
    payload?: T,
): PhoenixPacket<T> & {
    room_id?: string;
    timestamp: string;
} {
    const packet: any = {
        event,
        payload,
    };
    Object.keys(packet).forEach((k) => {
        if (packet[k] === undefined) delete packet[k];
    });
    return packet;
}

// ฟังก์ชันย่อย สำหรับสร้าง new_message event โดยเฉพาะ
export function createMessage(
    content: string,
    id?: string,
): PhoenixPacket<ChatMessage> {
    if (!content || content.trim().length === 0) {
        throw new Error("Message content is required");
    }

    const message: ChatMessage = {
        id: id ?? crypto.randomUUID(),
        content,
        status: "pending",
        createdAt: new Date().toISOString(),
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

// Wait for server ACK for a specific message id
async function waitForAck(socket: any, id: string, timeoutMs = 8000): Promise<boolean> {
    return new Promise((resolve) => {
        let done = false;
        function onMessage(ev: MessageEvent) {
            try {
                const data = JSON.parse(ev.data);
                // Accept either a Phoenix-style reply or a custom ack shape
                const isReply = data?.event === "phx_reply" && (data?.payload?.in_reply_to === id || data?.payload?.id === id);
                const isAck = (data?.event === "ack:new_message" || data?.event === "ack") && (data?.payload?.in_reply_to === id || data?.payload?.id === id);
                if (isReply || isAck) {
                    if (!done) {
                        done = true;
                        clearTimeout(timer);
                        socket.removeEventListener?.("message", onMessage as any);
                        resolve(true);
                    }
                }
            } catch {
                // ignore non-JSON frames
            }
        }
        const timer = setTimeout(() => {
            if (!done) {
                done = true;
                socket.removeEventListener?.("message", onMessage as any);
                resolve(false);
            }
        }, timeoutMs);

        socket.addEventListener?.("message", onMessage as any);
    });
}

// --- Typing events ---
export function sendTyping(deps: SendEventDeps, typing: boolean) {
    const { socket } = deps;
    const unified = createEvent("chat:typing", { typing });
    wsSend(socket, unified);
}

export const sendTypingStart = (deps: SendEventDeps) => sendTyping(deps, true);
export const sendTypingStop = (deps: SendEventDeps) => sendTyping(deps, false);

// --- Read receipt ---
export function sendReadReceipt(deps: SendEventDeps, lastMessageId: string) {
    const { socket } = deps;
    const packet = createEvent(
        "chat:read",
        { last_read_message_id: String(lastMessageId || "") },
    );
    wsSend(socket, packet);
}

// --- Room update ---
export function sendRoomUpdateEvent(
    deps: SendEventDeps,
    update: Record<string, any>
) {
    const { socket } = deps;
    const packet = createEvent(
        "room:update",
        { ...update },
    );
    wsSend(socket, packet);
}

/** Centralized send-message flow used by PhoenixSocketProvider */
export async function sendChatMessage(deps: SendMessageDeps, data: SendMessagePayload) {
    const {roomId, peerPublicKeyHex, socket} = deps;

    try {
        const token = UserService.Instance.auth();

        // Create once (plaintext) and optimistically update UI
        const packet = createMessage(
            data.message,
            data.id,
        );
        const p = packet.payload as ChatMessage;
        if (p) p.status = "pending";
        emitChatNewMessage({
            roomId,
            id: p.id,
            content: p.content,
            createdAt: p.createdAt,
            status: p.status,
        });
        const messageId = p.id;

        // 1. Ensure we have a shared key for this room
        if (token && peerPublicKeyHex && !UserService.Instance.authInfo?.sharedKey) {
            try {
                await ensureSharedKeyForRoom(roomId, peerPublicKeyHex);
            } catch (ex) {
                if (process.env.NODE_ENV !== 'production') {
                    console.warn(
                        `sendMessage: Could not derive shared key for room, sending plaintext`,
                        ex
                    );
                }
            }
        }
        const sharedKeyHex = UserService.Instance.authInfo?.sharedKey;
        const shouldEncrypt = token && peerPublicKeyHex && sharedKeyHex && data.message && data.message.trim();

        let finalContent = data.message;

        if(shouldEncrypt) {
            try {
                const aesKey = await importAesKey(sharedKeyHex!, "encrypt");
                finalContent = await encrypt(data.message, aesKey);
            } catch (err) {
                if (process.env.NODE_ENV !== 'production') {
                    console.warn(
                        `sendMessage: Encryption failed, falling back to plaintext`,
                        err
                    );
                }
            }
        }
        // If encrypted content differs, mutate the single packet before sending
        if (finalContent !== data.message && p) {
            p.content = finalContent;
        }
        const sent = wsSend(socket, packet);
        let acked = false;
        if (sent) {
            try { acked = await waitForAck(socket, String(messageId)); } catch {}
        }
        // Notify UI of final status (sent/failed)
        try {
            const updated = { ...p };
            updated.status = sent && acked ? "sent" : "failed";
            emitChatNewMessage({
                roomId,
                id: updated.id,
                content: updated.content,
                createdAt: p.createdAt,
                status: updated.status,
            });
        } catch {}
    } catch (ignored) {
    }
    return;

}
