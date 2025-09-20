import {Socket as PhoenixSocket} from "phoenix";
import {buildPhoenixUrl} from "@/utils/realtime";

// WebSocket-like interface used by RealtimeChatContext
export interface WsLike {
    readyState: number;
    onopen?: () => void;
    onmessage?: (event: { data: any }) => void;
    onclose?: (event: { code?: number; reason?: string }) => void;
    onerror?: (event?: any) => void;
    send: (data: string) => void;
    close: () => void;
}

// Singleton Phoenix Socket per token
class PhoenixSocketManager {
    private static instance: PhoenixSocketManager | null = null;

    static getInstance() {
        if (!this.instance) this.instance = new PhoenixSocketManager();
        return this.instance;
    }

    private socketByToken: Map<string, PhoenixSocket> = new Map();
    private refCountByToken: Map<string, number> = new Map();
    private channelsByKey: Map<string, any> = new Map();

    /** Returns a Phoenix Socket for given token; creates if missing */
    getSocket(token: string, room_id: string): PhoenixSocket {
        let sock = this.socketByToken.get(token);
        if (!sock) {
            const url = buildPhoenixUrl();
            sock = new PhoenixSocket(url, {
                params: {
                    token,
                    room_id
                } as any
            });
            sock.connect();
            this.socketByToken.set(token, sock);
            this.refCountByToken.set(token, 0);
        }
        // inc global ref count so we can disconnect when zero
        this.refCountByToken.set(token, (this.refCountByToken.get(token) || 0) + 1);
        return sock;
    }

    /** Decrease token socket ref count and disconnect when zero */
    releaseSocket(token: string) {
        const cur = (this.refCountByToken.get(token) || 1) - 1;
        if (cur <= 0) {
            const sock = this.socketByToken.get(token) as any;
            try {
                sock?.disconnect?.(() => undefined, 1000, "idle");
            } catch {
            }
            this.socketByToken.delete(token);
            this.refCountByToken.delete(token);
            // also cleanup any channels left for this token
            for (const key of Array.from(this.channelsByKey.keys())) {
                if (key.startsWith(token + ":")) this.channelsByKey.delete(key);
            }
        } else {
            this.refCountByToken.set(token, cur);
        }
    }

    /** Get or join a channel for token+roomId */
    getOrJoinChannel(token: string, roomId: string) {
        const key = `${token}:${roomId}`;
        const existing = this.channelsByKey.get(key);
        if (existing) return existing;

        const socket = this.getSocket(token, roomId);
        const topic = `room:${roomId}`;
        const channel = socket.channel(topic, {});
        this.channelsByKey.set(key, channel);
        return channel;
    }

    leaveChannel(token: string, roomId: string) {
        const key = `${token}:${roomId}`;
        const ch = this.channelsByKey.get(key);
        if (ch) {
            try {
                ch.leave();
            } catch {
            }
            this.channelsByKey.delete(key);
        }
        this.releaseSocket(token);
    }
}

/**
 * Returns a WebSocket-like adapter that uses a singleton Phoenix Socket under the hood
 */
export function getPhoenixChannelSocket(token: string, roomId: string): WsLike {
    const manager = PhoenixSocketManager.getInstance();
    const channel = manager.getOrJoinChannel(token, roomId);

    let readyState = 0; // 0 connecting, 1 open, 2 closing, 3 closed
    const listeners: { [ev: string]: Array<(payload: any) => void> } = {};

    const adapter: WsLike = {
        get readyState() {
            return readyState;
        },
        set readyState(v: number) {
            readyState = v;
        },
        onopen: undefined,
        onmessage: undefined,
        onclose: undefined,
        onerror: undefined,
        send(data: string) {
            try {
                const parsed = JSON.parse(data);
                const events = ['send_message', 'message', 'new_msg'];
                let pushed = false;
                for (const ev of events) {
                    try {
                        (channel as any).push(ev, parsed);
                        pushed = true;
                        break;
                    } catch {
                    }
                }
                if (!pushed) {
                    try {
                        (channel as any).push('message', parsed);
                    } catch {
                    }
                }
            } catch (e) {
                adapter.onerror?.(e);
            }
        },
        close() {
            readyState = 2;
            manager.leaveChannel(token, roomId);
            readyState = 3;
            adapter.onclose?.({code: 1000, reason: 'client closed'});
        },
    } as WsLike;

    // Join and wire events
    (channel as any).join()
        .receive('ok', () => {
            readyState = 1;
            adapter.onopen?.();
        })
        .receive('error', () => {
            readyState = 3;
            adapter.onclose?.({code: 1008, reason: 'phoenix join error'});
        });

    const forward = (payload: any) => {
        adapter.onmessage?.({data: JSON.stringify(payload)});
    };
    for (const ev of ['new_msg', 'message', 'msg', 'chat:new', 'broadcast']) {
        try {
            (channel as any).on(ev, forward);
        } catch {
        }
    }

    return adapter;
}
