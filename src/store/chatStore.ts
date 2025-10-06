// src/store/chatStore.ts
import {create} from "zustand";
import {nanoid} from "nanoid";
import {ChatMessage} from "lemmy-js-client";

// SenderFn should return the authoritative message id (string) when send is accepted by transport.
// Return falsey (false | '' | null | undefined) when the send did not go out.
type SenderFn = (draft: Omit<ChatMessage, "id" | "status"> & Partial<Pick<ChatMessage, "status">>) => Promise<string | false | "" | null | undefined> | (string | false | "" | null | undefined);

interface ChatState {
    messages: ChatMessage[];
    pendingMessages: ChatMessage[];

    // selectors
    getMessages: (roomId: string) => ChatMessage[];
    getPending: (roomId: string) => ChatMessage[];
    getMessageById: (roomId: string, id: string) => ChatMessage | undefined;

    // mutations
    addMessage: (roomId: string, senderId: number, content: string) => Promise<ChatMessage>;
    markMessageSent: (id: string) => void;
    markMessageFailed: (id: string) => void;
    retryMessage: (id: string) => void;
    commitStatus: (roomId: string, id: string, status: ChatMessage['status'], patch?: Partial<ChatMessage>) => void;
    removeMessage: (id: string) => void;
    sendMessage: (roomId: string, content: string, senderId?: number) => Promise<ChatMessage>;

    // network + resend
    isOnline: boolean;
    sender: SenderFn | null;
    retryMeta: Record<string, { retry: number; next: number }>;

    setSender: (fn: SenderFn) => void;
    setOnline: (online: boolean) => void;
    sendOrQueue: (roomId: string, senderId: number, content: string) => Promise<ChatMessage>;
    flushPending: () => Promise<void>;
    ackMessage: (roomId: string, id: string, hint?: { clientId?: string; serverId?: string; createdAt?: string; content?: string }) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    messages: [],
    pendingMessages: [],

    // selectors
    getMessages: (roomId) => get().messages.filter((m) => String(m.roomId) === String(roomId)),
    getPending: (roomId) => get().pendingMessages.filter((m) => String(m.roomId) === String(roomId)),
    getMessageById: (roomId, id) => {
        const rid = String(roomId);
        const mid = String(id);
        return (
            get().messages.find((m) => String(m.roomId) === rid && String(m.id) === mid) ||
            get().pendingMessages.find((m) => String(m.roomId) === rid && String(m.id) === mid)
        );
    },

    isOnline: typeof window !== 'undefined' ? navigator.onLine : true,
    sender: null,
    retryMeta: {},

    addMessage: async (roomId, senderId, content) => {
        // Delegate so that id is the one assigned by the transport/sender (when online).
        return await get().sendOrQueue(roomId, senderId, content);
    },

    markMessageSent: (id) =>
      set((state) => {
          const msg = state.pendingMessages.find((m) => m.id === id);
          if (!msg) return state;

          return {
              pendingMessages: state.pendingMessages.filter((m) => m.id !== id),
              messages: [...state.messages, { ...msg, status: "sent" }],
          };
      }),

    markMessageFailed: (id) =>
      set((state) => ({
          pendingMessages: state.pendingMessages.map((m) =>
            m.id === id ? { ...m, status: "failed" } : m
          ),
      })),

    retryMessage: (id) => {
        const { pendingMessages, retryMeta } = get();
        const msg = pendingMessages.find((m) => m.id === id);
        if (!msg) return;
        // schedule immediate retry (next = now) and bump retry count softly
        const prev = retryMeta[id]?.retry ?? 0;
        set((state) => ({
            retryMeta: {
                ...state.retryMeta,
                [id]: { retry: prev + 1, next: Date.now() },
            },
        }));
        void get().flushPending();
    },

    setSender: (fn) => set({ sender: fn }),

    setOnline: (online) => {

        set({ isOnline: online });
        if (online) {
            // Resend immediately when network is back
            void get().flushPending();
        }
    },

    sendOrQueue: async (roomId, senderId, content) => {
        const createdAt = new Date().toISOString();
        const draft: Omit<ChatMessage, "id"> & { status: ChatMessage["status"] } = {
            roomId,
            senderId,
            content,
            createdAt,
            status: "pending",
        };

        const trySend = async (): Promise<string | null> => {
            const fn = get().sender;
            if (!fn) return null;
            try {
                const id = await fn(draft);
                return (typeof id === "string" && id.length > 0) ? id : null;
            } catch {
                return null;
            }
        };

        let id: string | null = null;
        if (get().isOnline) {
            id = await trySend();
        }

        const msg: ChatMessage = {
            id: id ?? nanoid(), // prefer transport id; fallback to client id if offline or send failed
            ...draft,
        };

        // Put into outbox immediately so UI shows pending (with the best-known id)
        set((state) => ({
            pendingMessages: [...state.pendingMessages, msg],
        }));

        // If we didn't get an id (offline or send failed), schedule retry metadata
        if (!id) {
            set((state) => ({
                retryMeta: {
                    ...state.retryMeta,
                    [msg.id]: { retry: get().isOnline ? 1 : 0, next: get().isOnline ? Date.now() + 1500 : 0 },
                },
            }));
        } else {
            // We got a transport id and send was accepted; clear any retry meta for this id
            set((state) => {
                const r = { ...state.retryMeta };
                delete r[msg.id];
                return { retryMeta: r };
            });
        }

        return msg;
    },

    flushPending: async () => {
        const { pendingMessages, retryMeta, isOnline, sender } = get();
        if (!isOnline || !sender) return;
        const now = Date.now();
        // Send only those that are due
        const due = pendingMessages.filter((m) => {
            const meta = retryMeta[m.id];
            return !meta || meta.next <= now;
        });
        for (const m of due) {
            // skip messages that are already marked failed or already scheduled far in the future
            if ((m as any).status === "failed") continue;
            try {
                const sentId = await sender({
                    roomId: m.roomId,
                    senderId: m.senderId as any,
                    content: m.content as any,
                    createdAt: m.createdAt as any,
                    status: m.status as any,
                });
                const ok = typeof sentId === "string" && sentId.length > 0;
                if (!ok) {
                    // update backoff
                    set((state) => {
                        const prev = state.retryMeta[m.id]?.retry ?? 0;
                        const nextRetry = Math.min(10_000, 1500 * Math.pow(2, prev));
                        return {
                            retryMeta: {
                                ...state.retryMeta,
                                [m.id]: { retry: prev + 1, next: Date.now() + nextRetry },
                            },
                        };
                    });
                } else {
                    // optimistic: leave status pending; server ACK/broadcast will mark 'sent'
                    set((state) => {
                        const r = { ...state.retryMeta };
                        delete r[m.id];
                        return { retryMeta: r };
                    });
                }
            } catch {
                // network/send error → will retry on next flush
            }
        }
    },

    // Accept optional hint to improve matching when server re-ids messages
    // 'hint' may carry serverId/clientId/createdAt/content to find the original pending message.
    ackMessage: (roomId, id, hint?: { clientId?: string; serverId?: string; createdAt?: string; content?: string }) =>
      set((state): Partial<ChatState> => {
        // 1) try exact id match
        let idx = state.pendingMessages.findIndex((m) => m.id === id && m.roomId === roomId);
        let msg = idx >= 0 ? state.pendingMessages[idx] : undefined;

        // 2) try clientId/serverId from hint if provided
        if (!msg && hint?.clientId) {
          idx = state.pendingMessages.findIndex((m) => m.id === hint.clientId && m.roomId === roomId);
          msg = idx >= 0 ? state.pendingMessages[idx] : undefined;
        }
        if (!msg && hint?.serverId) {
          idx = state.pendingMessages.findIndex((m) => m.id === hint.serverId && m.roomId === roomId);
          msg = idx >= 0 ? state.pendingMessages[idx] : undefined;
        }

        // 3) try strict createdAt + content match (exact equality), most reliable without ids
        if (!msg && (hint?.createdAt || hint?.content)) {
          idx = state.pendingMessages.findIndex((m) => {
            if (String(m.roomId) !== String(roomId)) return false;
            const createdOk = hint?.createdAt ? String(m.createdAt) === String(hint.createdAt) : true;
            const contentOk = hint?.content ? String(m.content) === String(hint.content) : true;
            return createdOk && contentOk;
          });
          msg = idx >= 0 ? state.pendingMessages[idx] : undefined;
        }

        if (!msg) return {}; // no-op if still not found

        // remove retry meta by the pending (client) id
        const newRetry = { ...state.retryMeta };
        delete newRetry[msg.id];
        const nextPending = state.pendingMessages.filter((_, i) => i !== idx);
        const nextMessages = [
          ...state.messages,
          { ...msg, status: "sent" as ChatMessage["status"] } as ChatMessage,
        ];
        return {
          retryMeta: newRetry,
          pendingMessages: nextPending,
          messages: nextMessages as ChatMessage[],
        };
      }),

    commitStatus: (roomId, id, status, patch) =>
      set((state) => {
        const update = (list: ChatMessage[]) =>
          list.map((m) =>
            m.id === id && m.roomId === roomId
              ? { ...m, status, ...patch }
              : m
          );
        return {
          messages: update(state.messages),
          pendingMessages: update(state.pendingMessages),
        };
      }),

    removeMessage: (id) =>
      set((state) => ({
          pendingMessages: state.pendingMessages.filter((m) => m.id !== id),
      })),

    sendMessage: async (roomId, content, senderId) => {
        const sid = typeof senderId === "number" ? senderId : 0;
        return await get().sendOrQueue(roomId, sid, content);
    },
}));

// --- One-time wiring for network awareness & resend ---
if (typeof window !== 'undefined') {
    let wired = (window as any).__chatStoreNetworkWired__;
    if (!wired) {
        (window as any).__chatStoreNetworkWired__ = true;
        window.addEventListener('online', () => useChatStore.getState().setOnline(true));
        window.addEventListener('offline', () => useChatStore.getState().setOnline(false));
        // background flush loop (lightweight)
        const tick = async () => {
            try { await useChatStore.getState().flushPending(); } catch {}
            setTimeout(tick, 1500); // small cadence; flush will no-op if nothing due
        };
        setTimeout(tick, 1500);
    }
}