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
const MODE        = process.env.CHAT_MODE ?? 'multi'; // 'multi' | 'pair'
const TOPIC_FIXED = process.env.TOPIC_FIXED;          // e.g. 'room:1' (ถ้าต้องยิงห้องเดียว)

if (!TOKEN) {
  console.error('[FATAL] CHAT_TOKEN is empty. Provide a valid token to join.');
  process.exit(2);
}

console.log('==> Config:', { TOTAL, ROOM, TOKEN: TOKEN.slice(0, 24) + '…', SPREAD_MS, DURATION_MS, SENDER_BASE });

function topicFor(i: number): string {
  if (TOPIC_FIXED) return TOPIC_FIXED;                 // บังคับยิงห้องเดียว
  if (MODE === 'pair') return `room:${Math.floor(i / 2) + 1}`; // 2 คน/ห้อง
  return `room:${i + 1}`;                              // หลายห้อง (ค่าเริ่มต้น)
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
    const joinWatch = setTimeout(() => {
      console.error('JOIN WATCHDOG TIMEOUT ->', topic, 'sender:', sender, '(no onopen within 5s)');
    }, 5000);

    ch.onopen = (resp?: any) => {
      clearTimeout(joinWatch);
      console.log('OPEN ->', topic, 'sender:', sender, resp ? JSON.stringify(resp) : '');
    };

    ch.onerror = (e?: any) => {
      try {
        const out = e && (e.reason || e.message) ? (e.reason || e.message) : e;
        console.error('ERR ->', topic, 'sender:', sender, out ? JSON.stringify(out) : '(undefined)');
      } catch {
        console.error('ERR ->', topic, 'sender:', sender, '(unserializable)');
      }
    };

    ch.onclose = (reason?: any) => {
      try {
        console.warn('CLOSE ->', topic, 'sender:', sender, reason ? JSON.stringify(reason) : '');
      } catch {
        console.warn('CLOSE ->', topic, 'sender:', sender);
      }
    };

    ch.onmessage = (e: any) => {
      // keep minimal to avoid console flood
      if (!e) return;
      const msg = typeof e?.data === 'string' ? e.data : '';
      if (msg) console.log('MSG ->', topic, 'sender:', sender, msg.slice(0, 160));
    };

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