import type {ChatMessage} from '@/lib/lemmy-js-client/src';
import {wsSend} from "@/modules/chat/utils/socketSend";
import {dbg} from "@/modules/chat/utils";

/**
 * PhoenixSenderAdapter
 * - Attempts to send via channel.push first (to capture server reply/id), else falls back to wsSend.
 * - Emits a single optimistic `emitChatNewMessage` (adapter is the single source of this emit).
 * - Waits for an ack (best-effort) to flip status from 'pending' → 'sent' when possible.
 * - Returns the server message id if the backend replies with one; otherwise returns the client-generated id.
 */

// ข้อมูลขั้นต่ำที่ต้องใช้ในการส่งข้อความ  (ไม่ผูกกับชนิดจาก SDK ภายนอก)
export type SendDraft = ChatMessage;

export interface ChatSenderAdapter {
    /**
     * ส่งข้อความไปยัง backend
     * @returns server message id (string) เมื่อสำเร็จ, หรือ false เมื่อไม่สำเร็จ
     */
    sendMessage(event: string, draft: SendDraft): Promise<string | false>;
}

/**
 * Phoenix Channel Minimal Shape
 * รองรับการฉีด channel ที่มี method push ซึ่งคืน Promise ของผลลัพธ์
 */
export type PhoenixChannel = {
    /** ส่ง event พร้อม payload และรับผลลัพธ์แบบ promise */
    push: (event: string, payload: unknown) => Promise<unknown> | unknown;
};

/**
 * ตัวอย่าง implementation สำหรับ Phoenix channel
 * - ไม่ผูกกับโครงสร้าง response ที่ตายตัว พยายามดึง id อย่างยืดหยุ่น
 * - ไม่ throw exception ออกไปข้างนอก คืน false แทน เพื่อให้ ResendManager ตัดสินใจ retry
 */
/** Called when an outbound send fails so ResendManager can schedule retry */

export class PhoenixSenderAdapter implements ChatSenderAdapter {
    constructor(
      private socket: PhoenixChannel | WebSocket,
    ) {}

    async sendMessage(event: string, payload: SendDraft): Promise<string | false> {
        try {
            let delivered = false;
            let serverId: string | undefined;

            // Prefer Phoenix channel push for a proper server response (id)
            const maybePush = (this.socket as any)?.push;
            if (typeof maybePush === 'function') {
                try {
                    const res: any = await maybePush.call(this.socket, event, payload);
                    // Try to extract id from common phoenix/phx_reply shapes
                    serverId =
                        res?.response?.id ??
                        res?.payload?.response?.id ??
                        res?.payload?.id ??
                        res?.id ??
                        undefined;
                    delivered = true;
                    if (serverId) return String(serverId);
                } catch (e) {
                    dbg('[PhoenixSenderAdapter] push failed, fallback to wsSend', { id: (payload as any)?.id, e });
                }
            }

            // Fallback: raw ws send (boolean only)
            if (!delivered) {
                const sent = wsSend(this.socket as any, { event, payload });
                dbg('[PhoenixSenderAdapter] wsSend', { id: (payload as any)?.id, sent });
                if (!sent) throw new Error('socket send failed');
                // No server id in this path → return client-side id if present
                const clientId = (payload as any)?.id ?? (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now()));
                return String(clientId);
            }

            // Delivered via push but no id found → fall back to client id
            const clientId = (payload as any)?.id ?? (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now()));
            return String(clientId);
        } catch (err) {
            dbg('[PhoenixSenderAdapter] send failed', { id: (payload as any)?.id, err });
            return false;
        }
    }
}
