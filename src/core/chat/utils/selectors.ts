// src/core/chat/utils/selectors.ts
import memoizeOne from 'memoize-one';
import type { ChatMessage } from 'lemmy-js-client';

const cmpMsg = (a: ChatMessage, b: ChatMessage) => {
    const ta = a.createdAt ? Date.parse(a.createdAt) : 0;
    const tb = b.createdAt ? Date.parse(b.createdAt) : 0;
    if (ta !== tb) return ta - tb;                 // เก่า -> ใหม่ (ล่างสุดคือรายการล่าสุด)
    return String(a.id).localeCompare(String(b.id)); // fallback ให้ sort คงที่
};

// รวม messages + pendingMessages แล้ว “กันซ้ำ” โดยให้ตัวที่ status ไม่ใช่ pending ชนะ
function mergeRoomLists(
  base: ChatMessage[],
  pend: ChatMessage[],
  roomId: string
): ChatMessage[] {
    const filteredBase = (base ?? []).filter(m => String(m.roomId) === String(roomId));
    const filteredPend = (pend ?? []).filter(m => String(m.roomId) === String(roomId));

    const byId = new Map<string, ChatMessage>();
    for (const m of filteredBase) byId.set(String(m.id), m);

    for (const p of filteredPend) {
        const k = String(p.id);
        const prev = byId.get(k);
        // ถ้ามีตัว pending และมีตัวที่ถูกยืนยัน (sent/delivered/etc.) เข้ามา ให้ตัวที่ไม่ pending ชนะ
        if (!prev) byId.set(k, p);
        else if ((prev as any).status === 'pending' && (p as any).status !== 'pending') {
            byId.set(k, { ...prev, ...p });
        }
    }

    const out = Array.from(byId.values());
    out.sort(cmpMsg);
    return out;
}

// === Memoized selector (สร้างอาเรย์ใหม่เฉพาะเมื่อ input เปลี่ยนจริง ๆ) ===
export const selectRoomMessages = (() => {
    const memo = memoizeOne(mergeRoomLists);
    return (state: { messages: ChatMessage[] }, roomId: string) =>
      memo(state.messages, [], roomId);
})();