// --- Node WebSocket polyfill (for Phoenix client on Node) ---
try { (globalThis as any).WebSocket = (globalThis as any).WebSocket || require('ws'); } catch {}

import { getChannelAdapter } from "@/modules/chat/services/PhoenixSocketService";

// ===== Config via ENV =====
const TOTAL          = Number(process.env.LOAD_TOTAL ?? "300");         // จำนวนการเชื่อมต่อ
const MODE           = (process.env.CHAT_MODE ?? "same").toLowerCase();  // "same" | "multi"
const TOPIC_FIXED    = process.env.CHAT_TOPIC ?? "room:1";               // ใช้เมื่อ MODE = "same"
const ROOM           = process.env.CHAT_ROOM  ?? "1";                    // roomId สำหรับ payload
const TOKEN          = process.env.CHAT_TOKEN ?? "";                     // JWT/Token จริง
const SPREAD_MS      = Number(process.env.CHAT_SPREAD_MS ?? "15");       // เวลาห่างระหว่างเปิดแต่ละ conn
const DURATION_MS    = Number(process.env.CHAT_DURATION_MS ?? "30000");  // ระยะเวลารันก่อนปิดทั้งหมด

// ===== State =====
let open = 0, closed = 0, errs = 0, msgs = 0;
const conns: { close?: () => void }[] = [];

function topicFor(i: number): string {
  if (MODE === "multi") {
    // multi-room: room:1, room:2, ... room:TOTAL
    return `room:${i + 1}`;
  }
  // same-room: ทุกคนเข้า TOPIC_FIXED
  return TOPIC_FIXED;
}

for (let i = 0; i < TOTAL; i++) {
  setTimeout(() => {
    const topic = topicFor(i);
    const sender = Number(process.env.SENDER_BASE ?? "1000") + i; // กันชน senderId
    const ch: any = getChannelAdapter(TOKEN, topic, ROOM, sender);
    conns.push(ch);

    ch.onopen = () => {
      open++;
      if (open % 50 === 0) console.log("OPEN:", open);
    };

    ch.onerror = (e?: any) => {
      errs++;
      if (errs % 10 === 0) console.log("ERR :", errs, e ?? "");
    };

    ch.onmessage = (ev?: any) => {
      try {
        const s = typeof ev?.data === "string" ? ev.data : "";
        if (!s) return;
        msgs++;
        if (msgs % 200 === 0) console.log("MSG sample:", s.slice(0, 160));
      } catch {}
    };

    ch.onclose = (reason?: any) => {
      closed++;
      if (closed % 50 === 0) console.log("CLOSE:", closed, reason ?? "");
    };

    if ((i + 1) % 200 === 0) {
      console.log(`[batch] created: ${i + 1}/${TOTAL} | mode=${MODE} topic=${topic}`);
    }
  }, i * SPREAD_MS);
}

// ปิดทั้งหมดเมื่อครบเวลา
setTimeout(() => {
  console.log("\n==> stopping...\n");
  for (const c of conns) {
    try { c?.close?.(); } catch {}
  }
  // รายงานสรุปหลังหน่วงสั้น ๆ
  setTimeout(() => {
    console.log(`SUMMARY => open:${open} closed:${closed} errs:${errs} msgs:${msgs} total:${TOTAL} mode:${MODE}`);
    process.exit(0);
  }, 1500);
}, DURATION_MS);