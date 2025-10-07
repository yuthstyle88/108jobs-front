// src/store/chatStore.ts
import {create} from "zustand";
import {nanoid} from "nanoid";
import {ChatMessage} from "lemmy-js-client";

// small jitter helper (±15%) to avoid thundering herd on resends
const withJitter = (ms: number, ratio = 0.15) => ms + Math.floor((Math.random() * 2 - 1) * ms * ratio);

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
    activeRoomId: string | null;
    setActiveRoom: (roomId: string | null) => void;

    // resend mutex flags (prevent overlap)
    isResendingAll: boolean;
    isResendingActive: boolean;

    setSender: (fn: SenderFn) => void;
    setOnline: (online: boolean) => void;
    sendOrQueue: (roomId: string, senderId: number, content: string) => Promise<ChatMessage>;
    flushPending: () => Promise<void>;
    flushAllPending: () => Promise<void>;
    ackMessage: (roomId: string, id: string, hint?: { clientId?: string; serverId?: string; createdAt?: string; content?: string }) => void;

    // failure flags
    hasFailure: boolean;
    failedRooms: Record<string, boolean>;
    setFailure: (roomId: string) => void;
    clearFailure: (roomId?: string) => void;
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
    activeRoomId: null,
    isResendingAll: false,
    isResendingActive: false,

    hasFailure: false,
    failedRooms: {},

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

    markMessageFailed: (id) => {
      set((state) => {
        const msg = state.pendingMessages.find((m) => m.id === id);
        const pendingMessages = state.pendingMessages.map((m) =>
          m.id === id ? { ...m, status: "failed" } : m
        );
        const patch: Partial<ChatState> = { pendingMessages } as any;
        return patch;
      });
      const msg = get().pendingMessages.find((m) => m.id === id);
      if (msg) get().setFailure(String(msg.roomId));
    },

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

    setOnline: async (online) => {
        const was = get().isOnline;
        set({ isOnline: online });
        // Trigger flush only on OFF -> ON transition and if there are failures
        if (!was && online && get().hasFailure) {
            await get().flushAllPending();
        }
    },

    setActiveRoom: (roomId) => set({ activeRoomId: roomId }),

    setFailure: (roomId) => set((s) => ({
      hasFailure: true,
      failedRooms: { ...s.failedRooms, [String(roomId)]: true },
    })),
    clearFailure: (roomId) => set((s) => {
      if (!roomId) {
        return { hasFailure: false, failedRooms: {} } as any;
      }
      const fr = { ...s.failedRooms };
      delete fr[String(roomId)];
      const anyLeft = Object.keys(fr).length > 0;
      return { failedRooms: fr, hasFailure: anyLeft } as any;
    }),

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
            const base = 1500;
            set((state) => ({
                retryMeta: {
                    ...state.retryMeta,
                    [msg.id]: {
                        retry: get().isOnline ? 1 : 0,
                        next: get().isOnline ? Date.now() + withJitter(base) : 0,
                    },
                },
            }));
            get().setFailure(roomId);
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
        // If global resend is in-flight, skip active-room resend to avoid overlap
        if (get().isResendingAll) return;
        if (get().isResendingActive) return;
        set({ isResendingActive: true });
        try {
            const { pendingMessages, retryMeta, isOnline, sender, activeRoomId } = get();
            if (!isOnline || !sender) return;
            const now = Date.now();
            const due = pendingMessages.filter((m) => {
                // If an active room is set, only resend messages for that room
                if (activeRoomId && String(m.roomId) !== String(activeRoomId)) return false;
                const meta = retryMeta[m.id];
                const count = meta?.retry ?? 0;
                return !!meta && meta.next <= now && count < 3;
            });
            for (const m of due) {
                if ((m as any).status === "failed") continue;
                const meta0 = retryMeta[m.id] ?? { retry: 0, next: now };
                const nextCount = meta0.retry + 1;
                const delays = [1000, 2000, 5000] as const; // 3 attempts
                const nextDelay = withJitter(delays[Math.min(nextCount - 1, delays.length - 1)], 0.15);
                set((state) => ({
                    retryMeta: {
                        ...state.retryMeta,
                        [m.id]: { retry: nextCount, next: Date.now() + nextDelay },
                    },
                }));
                try {
                    const sentId = await sender({
                        roomId: m.roomId,
                        senderId: m.senderId as any,
                        content: m.content as any,
                        createdAt: m.createdAt as any,
                        status: m.status as any,
                    });
                    const ok = typeof sentId === "string" && sentId.length > 0;
                    if (ok) {
                        set((state) => {
                            const r = { ...state.retryMeta };
                            delete r[m.id];
                            return { retryMeta: r } as any;
                        });
                    }
                } catch {
                    // ignore; backoff already scheduled above
                }
            }
        } finally {
            set({ isResendingActive: false });
        }
    },

    flushAllPending: async () => {
        if (get().isResendingAll) return; // already running
        set({ isResendingAll: true });
        try {
            const { pendingMessages, retryMeta, isOnline, sender } = get();
            if (!isOnline || !sender) return;
            const now = Date.now();
            const due = pendingMessages.filter((m) => {
                const meta = retryMeta[m.id];
                const count = meta?.retry ?? 0;
                return !!meta && meta.next <= now && count < 3;
            });
            for (const m of due) {
                if ((m as any).status === "failed") continue;
                const meta0 = retryMeta[m.id] ?? { retry: 0, next: now };
                const nextCount = meta0.retry + 1;
                const delays = [1000, 2000, 5000] as const; // 3 attempts
                const nextDelay = withJitter(delays[Math.min(nextCount - 1, delays.length - 1)], 0.15);
                set((state) => ({
                    retryMeta: {
                        ...state.retryMeta,
                        [m.id]: { retry: nextCount, next: Date.now() + nextDelay },
                    },
                }));
                try {
                    const sentId = await sender({
                        roomId: m.roomId,
                        senderId: m.senderId as any,
                        content: m.content as any,
                        createdAt: m.createdAt as any,
                        status: m.status as any,
                    });
                    const ok = typeof sentId === "string" && sentId.length > 0;
                    if (ok) {
                        set((state) => {
                            const r = { ...state.retryMeta };
                            delete r[m.id];
                            return { retryMeta: r } as any;
                        });
                    }
                } catch {}
            }
        } finally {
            set({ isResendingAll: false });
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

        // 3) robust match by (createdAt ± window) + normalized content (NFC + trim + single-space)
        if (!msg && (hint?.createdAt || hint?.content)) {
          const norm = (v: unknown) =>
            (v == null ? "" : String(v))
              .normalize("NFC")
              .replace(/\s+/g, " ")
              .trim();

          const tryParseMs = (iso?: string) => {
            if (!iso) return NaN;
            const t = Date.parse(iso);
            return Number.isFinite(t) ? t : NaN;
          };

          const hintMs = tryParseMs(hint?.createdAt);
          const hintText = norm(hint?.content);
          const hasTime = Number.isFinite(hintMs);
          const hasText = hintText.length > 0;

          // Consider only messages of this room
          const roomPending = state.pendingMessages.filter((m) => String(m.roomId) === String(roomId));

          // 3.1: both time and text → strongest signal
          if (hasTime && hasText) {
            const WINDOW_MS = 10_000; // ±10s clock skew tolerance
            const candidates = roomPending.filter((m) => {
              const ms = tryParseMs(String(m.createdAt));
              if (!Number.isFinite(ms) || Math.abs(ms - hintMs) > WINDOW_MS) return false;
              return norm(m.content) === hintText;
            });
            if (candidates.length === 1) {
              msg = candidates[0];
              idx = state.pendingMessages.findIndex((m) => m.id === msg!.id);
            } else if (candidates.length > 1) {
              // tie-breaker: choose the one closest in time; if tie, pick the latest
              candidates.sort((a, b) => {
                const da = Math.abs(tryParseMs(String(a.createdAt)) - hintMs);
                const db = Math.abs(tryParseMs(String(b.createdAt)) - hintMs);
                if (da !== db) return da - db;
                return tryParseMs(String(b.createdAt)) - tryParseMs(String(a.createdAt));
              });
              msg = candidates[0];
              idx = state.pendingMessages.findIndex((m) => m.id === msg!.id);
            }
          }

          // 3.2: only text → pick the newest with same normalized text
          if (!msg && hasText) {
            const candidates = roomPending.filter((m) => norm(m.content) === hintText);
            if (candidates.length > 0) {
              candidates.sort((a, b) => tryParseMs(String(b.createdAt)) - tryParseMs(String(a.createdAt)));
              msg = candidates[0];
              idx = state.pendingMessages.findIndex((m) => m.id === msg!.id);
            }
          }

          // 3.3: only time → pick the message within ±5s that is closest in time
          if (!msg && hasTime) {
            const WINDOW_MS = 5_000; // ±5s tolerance if no text provided
            const candidates = roomPending.filter((m) => {
              const ms = tryParseMs(String(m.createdAt));
              return Number.isFinite(ms) && Math.abs(ms - hintMs) <= WINDOW_MS;
            });
            if (candidates.length > 0) {
              candidates.sort((a, b) => {
                const da = Math.abs(tryParseMs(String(a.createdAt)) - hintMs);
                const db = Math.abs(tryParseMs(String(b.createdAt)) - hintMs);
                if (da !== db) return da - db;
                return tryParseMs(String(b.createdAt)) - tryParseMs(String(a.createdAt));
              });
              msg = candidates[0];
              idx = state.pendingMessages.findIndex((m) => m.id === msg!.id);
            }
          }
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
        const ret: Partial<ChatState> = {
          retryMeta: newRetry,
          pendingMessages: nextPending,
          messages: nextMessages as ChatMessage[],
        };
        // If this room no longer has any retryMeta, clear its failure flag
        const stillRoomRetry = Object.keys(newRetry).some((rid) =>
          nextPending.some((pm) => pm.id === rid && String(pm.roomId) === String(roomId))
        );
        if (!stillRoomRetry) {
          // clear specific room flag; may also toggle hasFailure if no rooms left
          (get().clearFailure)(String(roomId));
        }
        return ret;
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
  if (!(window as any).__chatStoreNetworkWired__) {
    (window as any).__chatStoreNetworkWired__ = true;

    let onlineTick: number | null = null;
    let offlineTick: number | null = null;

    const onOnline = () => {
      if (onlineTick != null) return; // debounce burst events
      onlineTick = window.setTimeout(() => {
        onlineTick = null;
        const st = useChatStore.getState();
        // setOnline() จะเป็นตัวตัดสินเองว่าเป็น transition OFF->ON หรือไม่
        // และจะเรียก flushAllPending() ก็ต่อเมื่อมี failure เท่านั้น
        void st.setOnline(true);
      }, 0);
    };

    const onOffline = () => {
      if (offlineTick != null) return;
      offlineTick = window.setTimeout(() => {
        offlineTick = null;
        useChatStore.getState().setOnline(false);
      }, 0);
    };

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    // ทำให้สถานะ store ตรงกับสถานะเริ่มต้นของ browser ทันที
    // (จะไม่กระตุ้น resend เพราะ setOnline จะเช็ค transition อยู่แล้ว)
    const nowOnline = navigator.onLine;
    useChatStore.getState().setOnline(nowOnline);
  }
}