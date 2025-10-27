import { getChannelAdapter } from "@/modules/chat/services/PhoenixSocketService";

async function main() {
    const token    = process.env.CHAT_TOKEN ?? "";
    const topic    = process.env.CHAT_TOPIC ?? "room:1";
    const roomId   = process.env.CHAT_ROOM  ?? "1";
    const senderId = Number(process.env.CHAT_SENDER_ID ?? "123");

    const ch = getChannelAdapter(token, topic, roomId, senderId);

    ch.onopen    = () => console.log("OPEN");
    ch.onmessage = (e) => console.log("MSG", e.data);
    ch.onerror   = (e) => console.log("ERR", e);
    ch.onclose   = (e) => console.log("CLOSE", e);

    // รอสักครู่ให้รับ event
    await new Promise(r => setTimeout(r, 8000));
    ch.close();
}

main().catch(console.error);