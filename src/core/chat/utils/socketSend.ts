import {dbg} from "@/core/chat/utils/helpers";
import {SendMessageDeps} from "@/core/chat/types";

export function wsSend(socket: any, obj: any) {
    if (!socket) return false;
    const event = obj?.event ?? obj?.type ?? 'message';
    const payload = obj?.payload ?? obj;
    try {
        // 1) Phoenix Channel API (channel.push(event, payload))
        if (typeof socket.push === 'function') {
            dbg('send via phoenix.push', { event, payload });
            socket.push(event, payload);
            return true;
        }
        // 2) Adapter with emit(event, payload)
        if (typeof socket.emit === 'function') {
            dbg('send via adapter.emit', { event, payload });
            socket.emit(event, payload);
            return true;
        }
        // 3) Raw WebSocket API
        if (typeof socket.send === 'function') {
            const canCheckReady = typeof (globalThis as any).WebSocket !== 'undefined' && typeof socket.readyState === 'number';
            if (canCheckReady && socket.readyState !== (globalThis as any).WebSocket.OPEN) {
                dbg('raw ws not open', { readyState: socket.readyState });
                return false;
            }
            dbg('send via raw WebSocket', { event });
            socket.send(JSON.stringify({ event, payload }));
            return true;
        }
        dbg('no send method found');
        return false;
    } catch {
        return false;
    }
}

// Wait for server ACK for a specific message id (adapter-only version)
export async function waitForAck(adapter: SendMessageDeps['adapter'] | undefined, id: string, timeoutMs = 8000): Promise<boolean> {
    if (!adapter) return false;
    return new Promise((resolve) => {
        const idToMatch = String(id);
        let done = false;
        const finish = (ok: boolean) => { if (done) return; done = true; try { unsub?.(); } catch {} resolve(ok); };

        const matchesId = (obj: any): boolean => {
            if (!obj) return false;
            const inner = obj.event === 'forward' ? (obj.payload ?? obj) : obj;
            const payload = inner?.payload ?? inner;
            if (inner?.event !== 'chat:message') return false;
            const mid = payload?.id ?? payload?.payload?.id ?? payload?.message?.id;
            return mid != null && String(mid) === idToMatch;
        };

        let unsub: (() => void) | undefined;
        if (typeof adapter.onMessage === 'function') {
            unsub = adapter.onMessage((packet: any) => { if (matchesId(packet)) finish(true); });
        } else if (typeof adapter.onAny === 'function') {
            unsub = adapter.onAny((evt: string, payload: any) => { if (evt === 'chat:message' && matchesId(payload)) finish(true); });
        } else {
            // no listener API -> cannot wait for ack via adapter
            return resolve(false);
        }
        setTimeout(() => finish(false), timeoutMs);
    });
}