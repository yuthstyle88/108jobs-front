// Node WebSocket polyfill for Phoenix
try { (globalThis as any).WebSocket = (globalThis as any).WebSocket || require('ws'); } catch {}

import { getChannelAdapter } from "@/modules/chat/services/PhoenixSocketService";

// ===== Config =====
const TOTAL       = Number(process.env.LOAD_TOTAL ?? '300');       // จำนวน connections
const ROOM        = process.env.CHAT_ROOM ?? '1';                  // roomId ใน payload
const TOKEN       = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMSIsImlzcyI6ImFwaS1zdGFnaW5nLjEwOGpvYnMuY29tIiwiaWF0IjoxNzYxMzY5NDU5LCJleHAiOjE3NjU2ODk0NTksInNlc3Npb24iOiI0ZDU5NzFmNmJlMDI0MWU4OTFhZjRjMTI2ODQ5MjNjZCIsImVtYWlsIjoiaWJyb3dlMTA4QGdtYWlsLmNvbSIsImxhbmciOiJlbiIsImFjY2VwdGVkVGVybXMiOnRydWV9.7sWK12eSpQ3tLqEZ2yypce6oYjSTPG5IlPJ4sOCOxgw'; // ใช้ token คงที่เพื่อทดสอบ
const SPREAD_MS   = Number(process.env.CHAT_SPREAD_MS ?? '25');     // เว้นช่วงเปิดแต่ละ conn (กัน burst)
const DURATION_MS = Number(process.env.CHAT_DURATION_MS ?? '180000');
const SENDER_BASE = Number(process.env.SENDER_BASE ?? '1000');

if (!TOKEN) {
  console.error('[FATAL] CHAT_TOKEN is empty. Provide a valid token to join.');
  process.exit(2);
}

console.log('==> Config:', { TOTAL, ROOM, TOKEN: TOKEN.slice(0, 24) + '…', SPREAD_MS, DURATION_MS, SENDER_BASE });

function topicFor(i: number): string {
  // ทดสอบแบบหลายห้อง: room:1..TOTAL (คงเดิม)
  return `room:${i + 1}`;
}

function s(v: any) {
  try { return typeof v === 'string' ? v : JSON.stringify(v); } catch { return String(v); }
}

for (let i = 0; i < TOTAL; i++) {
  setTimeout(() => {
    const topic = topicFor(i);
    if (!/^room:\d+$/.test(topic)) {
      console.error('[FATAL] Bad topic format =>', topic);
      process.exit(3);
    }
    const sender = SENDER_BASE + i;
    console.log('JOIN ->', topic, 'sender:', sender);

    const ch: any = getChannelAdapter(TOKEN, topic, ROOM, sender);
    ch.onopen = () => {
        console.log('OPEN ->', topic, 'sender:', sender);
    }
    ch.onmessage = (e: any) => {    }

    if ((i + 1) % 200 === 0) {
      console.log(`[batch] created: ${i + 1}/${TOTAL} | topic=${topic}`);
    }
  }, i * SPREAD_MS);
}

// ปิดทั้งหมดเมื่อครบเวลา
setTimeout(() => {
  console.log('\n==> stopping...\n');

  setTimeout(() => {
    process.exit(0);
  }, 1500);
}, DURATION_MS);