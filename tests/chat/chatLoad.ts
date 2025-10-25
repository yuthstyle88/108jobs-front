// Node WebSocket polyfill for Phoenix
try { (globalThis as any).WebSocket = (globalThis as any).WebSocket || require('ws'); } catch {}

import { getChannelAdapter } from "@/modules/chat/services/PhoenixSocketService";

type Mode = 'same' | 'multi' | 'pair';

// ===== Config via ENV =====
const TOTAL          = Number(process.env.LOAD_TOTAL ?? '300');          // จำนวน connections
const MODE           = (process.env.CHAT_MODE ?? 'pair').toLowerCase() as Mode; // 'pair' = 2 คน/ห้อง
const TOPIC_FIXED    = process.env.CHAT_TOPIC ?? 'room:1';               // ใช้เมื่อ MODE='same'
const ROOM           = process.env.CHAT_ROOM  ?? '1';                    // roomId ใน payload
const TOKEN          = process.env.CHAT_TOKEN ?? '';                     // ต้องใส่ token จริงถ้า server ต้อง auth
const SPREAD_MS      = Number(process.env.CHAT_SPREAD_MS ?? '5');        // หน่วงเปิดแต่ละ conn
const DURATION_MS    = Number(process.env.CHAT_DURATION_MS ?? '180000'); // เวลารวมก่อนปิดทั้งหมด
const SENDER_BASE    = Number(process.env.SENDER_BASE ?? '1000');

if (!TOKEN) {
    console.error('[FATAL] CHAT_TOKEN is empty. Provide a valid token to join.');
    process.exit(2);
}

let open = 0, closed = 0, errs = 0, msgs = 0;
const conns: { close?: () => void }[] = [];
const closedSet = new WeakSet<any>();
const samples: { err: any[]; msg: any[] } = { err: [], msg: [] };

function topicFor(i: number): string {
    if (MODE === 'multi') return `room:${i + 1}`;                 // room:1..TOTAL
    if (MODE === 'pair')  return `room:${Math.floor(i / 2) + 1}`; // 2 connections / room
    return TOPIC_FIXED;                                           // same
}

for (let i = 0; i < TOTAL; i++) {
    setTimeout(() => {
        const topic = topicFor(i);
        const sender = SENDER_BASE + i;
        const ch: any = getChannelAdapter(TOKEN, topic, ROOM, sender);
        conns.push(ch);

        // onopen = join ok (PhoenixSocketService ควรยิงตอน receive("ok"))
        ch.onopen = (resp?: any) => {
            open++;
            if (open % 50 === 0) console.log('OPEN:', open, '| topic:', topic);
            if (samples.msg.length < 3 && resp) samples.msg.push({ type: 'join_ok', topic, resp });
        };

        ch.onerror = (e?: any) => {
            errs++;
            if (errs % 10 === 0) console.log('ERR :', errs, e ?? '');
            if (samples.err.length < 5) samples.err.push({ topic, e });
        };

        ch.onmessage = (ev?: any) => {
            try {
                const s = typeof ev?.data === 'string' ? ev.data : '';
                if (!s) return;
                msgs++;
                if (samples.msg.length < 5) samples.msg.push({ topic, data: s.slice(0, 240) });
                if (msgs % 200 === 0) console.log('MSG sample:', s.slice(0, 160));
            } catch {}
        };

        ch.onclose = (reason?: any) => {
            if (!closedSet.has(ch)) {
                closedSet.add(ch);
                closed++;
                if (closed % 50 === 0) console.log('CLOSE:', closed, reason ?? '');
            }
        };

        if ((i + 1) % 200 === 0) {
            console.log(`[batch] created: ${i + 1}/${TOTAL} | mode=${MODE} topic=${topic}`);
        }
    }, i * SPREAD_MS);
}

// ปิดทั้งหมดเมื่อครบเวลา
setTimeout(() => {
    console.log('\n==> stopping...\n');
    for (const c of conns) {
        try { c?.close?.(); } catch {}
    }
    setTimeout(() => {
        console.log('SAMPLES.err:', JSON.stringify(samples.err, null, 2));
        console.log('SAMPLES.msg:', JSON.stringify(samples.msg, null, 2));
        console.log(`SUMMARY => open:${open} closed:${closed} errs:${errs} msgs:${msgs} total:${TOTAL} mode:${MODE}`);
        process.exit(0);
    }, 1500);
}, DURATION_MS);