import { getChannelAdapter } from "@/modules/chat/services/PhoenixSocketService";

const TOTAL = Number(process.env.LOAD_TOTAL ?? "300");
const TOPIC = process.env.CHAT_TOPIC ?? "room:1";
const ROOM  = process.env.CHAT_ROOM  ?? "1";
const TOKEN = process.env.CHAT_TOKEN ?? "";
const BASE  = Number(process.env.SENDER_BASE ?? "1000"); // กันชน senderId

let open = 0, closed = 0, errs = 0;
const conns: any[] = [];

for (let i = 0; i < TOTAL; i++) {
    const ch = getChannelAdapter(TOKEN, TOPIC, ROOM, BASE + i);
    conns.push(ch);
    ch.onopen  = () => { open++;  if (open % 50 === 0)  console.log("OPEN:", open); };
    ch.onerror = () => { errs++;  if (errs % 10 === 0)  console.log("ERR :", errs); };
    ch.onclose = () => { closed++; if (closed % 50 === 0) console.log("CLOSE:", closed); };
    awaitSleep(15); // ค่อย ๆ รันพ์
}

// ปิดทั้งหมดหลัง 30s
setTimeout(() => conns.forEach(c => c.close()), 30_000);

function awaitSleep(ms: number) {
    return new Promise(r => setTimeout(r, ms));
}