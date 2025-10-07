import type { ChatMessage } from 'lemmy-js-client';

/**
 * Transport-agnostic message sending adapter
 * ==========================================
 * - UI / services ควรคุยกับ Adapter ตัวนี้เท่านั้น ไม่ผูกกับ Phoenix/HTTP โดยตรง
 * - คืนค่าเป็น server id ของข้อความ (string) เมื่อส่งสำเร็จ
 * - คืนค่า false เมื่อส่งล้มเหลว (เงียบ ๆ ให้ ResendManager ตัดสินใจ retry)
 */

// ข้อมูลขั้นต่ำที่ต้องใช้ในการส่งข้อความ  (ไม่ผูกกับชนิดจาก SDK ภายนอก)
export type SendDraft = ChatMessage;

export interface ChatSenderAdapter {
  /**
   * ส่งข้อความไปยัง backend
   * @returns server message id (string) เมื่อสำเร็จ, หรือ false เมื่อไม่สำเร็จ
   */
  send(draft: SendDraft): Promise<string | false>;
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
type OnSendFailure = (serverId: string) => void;

export class PhoenixSenderAdapter implements ChatSenderAdapter {
  constructor(private channel: PhoenixChannel, private onSendFailure?: OnSendFailure) {}

  async send(draft: SendDraft): Promise<string | false> {
    try {
      const payload = {
        id: draft.id,
        roomId: draft.roomId,
        senderId: draft.senderId,
        content: draft.content,
        createdAt: draft.createdAt,
        status: draft.status,
      } as const;

      const res = await Promise.resolve(this.channel.push('chat:message', payload));

      // พยายามดึง message id อย่างยืดหยุ่นที่สุด
      const id = extractId(res);
      if (id) return id;
      // ไม่มี id กลับมา ถือว่าไม่สำเร็จ → แจ้ง ResendManager ให้ตั้ง retry meta
      this.onSendFailure?.(draft.id);
      return false;
    } catch {
      this.onSendFailure?.(draft.id);
      return false;
    }
  }
}

/**
 * ดึง id อย่างยืดหยุ่นจาก response ที่ไม่แน่นอน
 * รองรับรูปแบบที่พบบ่อย: { id }, { messageId }, { data: { id } }, { payload: { id } },
 * หรือ phoenix reply ทั่วไป: { status: 'ok', response: { id: '...' } }
 */
function extractId(res: unknown): string | null {
  if (!res || typeof res !== 'object') return null;
  const obj = res as Record<string, unknown>;

  const tryGet = (o: any): string | null => {
    if (!o || typeof o !== 'object') return null;
    const candidates = ['id', 'messageId', 'msgId'];
    for (const k of candidates) {
      const v = o[k];
      if (typeof v === 'string' && v.length > 0) return v;
    }
    return null;
  };

  // phoenix reply: { status: 'ok', response: {...} }
  if (obj['response']) {
    const id = tryGet(obj['response']);
    if (id) return id;
  }

  // common shapes
  let id = tryGet(obj);
  if (id) return id;

  if (obj['data']) {
    id = tryGet(obj['data']);
    if (id) return id;
  }
  if (obj['payload']) {
    id = tryGet(obj['payload']);
    if (id) return id;
  }

  return null;
}