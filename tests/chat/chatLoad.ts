// Polyfill WebSocket for Node test run
try { (globalThis as any).WebSocket = (globalThis as any).WebSocket || require('ws'); } catch {}

import { getChannelAdapter } from "@/modules/chat/services/PhoenixSocketService";

const TOTAL = Number(process.env.LOAD_TOTAL ?? "300");
const TOPIC = process.env.CHAT_TOPIC ?? "room:1";
const ROOM  = process.env.CHAT_ROOM  ?? "1";
const TOKEN = process.env.CHAT_TOKEN ?? "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMSIsImlzcyI6ImFwaS1zdGFnaW5nLjEwOGpvYnMuY29tIiwiaWF0IjoxNzYxMzY5NDU5LCJleHAiOjE3NjU2ODk0NTksInNlc3Npb24iOiI0ZDU5NzFmNmJlMDI0MWU4OTFhZjRjMTI2ODQ5MjNjZCIsImVtYWlsIjoiaWJyb3dlMTA4QGdtYWlsLmNvbSIsImxhbmciOiJlbiIsImFjY2VwdGVkVGVybXMiOnRydWV9.7sWK12eSpQ3tLqEZ2yypce6oYjSTPG5IlPJ4sOCOxgw";
const BASE  = Number(process.env.SENDER_BASE ?? "1000"); // กันชน senderId

let open = 0, closed = 0, errs = 0;
const conns: any[] = [];

for (let i = 0; i < TOTAL; i++) {
  setTimeout(() => {
    const topic = `room:${i}`;
    const ch = getChannelAdapter(TOKEN, topic, ROOM, BASE + i);
    conns.push(ch);

    ch.onopen = () => {
      open++;
      if (open % 50 === 0) console.log("OPEN:", open);
    };

    ch.onerror = (e?: any) => {
      errs++;
      if (errs % 10 === 0) console.log("ERR :", errs, e ?? "");
    };

    ch.onmessage = (ev: any) => {
      try {
        const data = typeof ev?.data === 'string' ? ev.data : '';
        if (data) {
          const msg = JSON.parse(data);
          if (msg?.event === 'error' || msg?.payload?.error) {
            console.log('[chan:error]', msg.payload?.error || msg);
          }
        }
      } catch {}
    };

    ch.onclose = () => {
      closed++;
      if (closed % 50 === 0) console.log("CLOSE:", closed);
    };
  }, i * 15);
}

// ปิดทั้งหมดหลัง 30s
setTimeout(() => conns.forEach(c => c.close()), 30_000);