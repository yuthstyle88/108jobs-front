// src/core/chat/store/chatStore.ts
import { create } from 'zustand'
import { ChatMessage } from 'lemmy-js-client'

type RetryMeta = Record<string, { retry: number; next: number }>

interface ChatStoreState {
    messages: ChatMessage[]
    retryMeta: RetryMeta
    pendingMessages: ChatMessage[]
}

interface ChatStoreActions {
    addMessage: (msg: ChatMessage) => void
    upsertHistory: (items: ChatMessage[]) => void
    addPending: (msg: ChatMessage) => void
    removePending: (id: string) => void
    promoteToSent: (id: string) => void
    markFailed: (id: string) => void
    upsertRetryMeta: (id: string, meta: { retry: number; next: number }) => void
    dropRetryMeta: (id: string) => void
    clearRoom: (roomId: string) => void
    getPendingByRoom: (roomId: string) => ChatMessage[]
    commitStatus: (id: string, status: string) => void
    retryMessage: (id: string) => void
    flushPending: (roomId?: string) => ChatMessage[]
    removeMessage: (id: string) => void
    addPendingMessage: (msg: ChatMessage) => void
    removePendingMessage: (id: string) => void
    clearPendingMessages: () => void
}

export const useChatStore = create<ChatStoreState & ChatStoreActions>((set, get) => ({
    messages: [],
    retryMeta: {},
    pendingMessages: [],
    online: false,

    addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),

    upsertHistory: (items) =>
      set((s) => {
        const map = new Map<string, ChatMessage>();
        // seed with existing messages
        for (const m of s.messages) map.set(m.id, m);
        // upsert incoming
        for (const m of items) map.set(m.id, m);
        // build and sort ascending by time (fallback by id)
        const merged = Array.from(map.values()).sort((a, b) => {
          const ta = a.createdAt ?? '';
          const tb = b.createdAt ?? '';
          if (ta && tb && ta !== tb) return ta.localeCompare(tb);
          return a.id.localeCompare(b.id);
        });
        return { messages: merged };
      }),
    upsertMessage: (msg: ChatMessage) =>
      set((s) => {
          const k = String(msg.id);
          const byId = new Map(s.messages.map(m => [String(m.id), m]));
          const prev = byId.get(k);
          // ถ้าของเดิมเป็น pending แล้วตัวใหม่ไม่ pending ให้ตัวใหม่ทับ
          if (!prev) byId.set(k, msg);
          else if ((prev as any).status === 'pending' && (msg as any).status !== 'pending') {
              byId.set(k, { ...prev, ...msg });
          } else {
              byId.set(k, { ...prev, ...msg });
          }
          return { messages: Array.from(byId.values()) };
      }),

    addPending: (msg) =>
      set((s) => {
        const byId = new Map(s.messages.map(m => [String(m.id), m]));
        const k = String(msg.id);
        const prev = byId.get(k);
        byId.set(k, { ...(prev ?? {} as ChatMessage), ...msg, status: 'pending' as const });
        return { messages: Array.from(byId.values()) };
      }),

    removePending: (id) =>
      set((s) => ({ messages: s.messages.filter((m) => !(String(m.id) === String(id) && (m as any).status === 'pending')) })),

    promoteToSent: (id) =>
      set((s) => {
        const next = s.messages.map((m) => String(m.id) === String(id) ? { ...m, status: 'sent' as const } : m);
        const nextMeta = { ...s.retryMeta };
        delete nextMeta[String(id)];
        return { messages: next, retryMeta: nextMeta } as Partial<ChatStoreState>;
      }),

    markFailed: (id) =>
      set((s) => ({ messages: s.messages.map((m) => String(m.id) === String(id) ? { ...m, status: 'failed' as const } : m) })),

    upsertRetryMeta: (id, meta) =>
      set((s) => ({ retryMeta: { ...s.retryMeta, [id]: meta } })),

    dropRetryMeta: (id) =>
      set((s) => {
          const meta = { ...s.retryMeta }
          delete meta[id]
          return { retryMeta: meta }
      }),

    clearRoom: (roomId) =>
      set((s) => ({ messages: s.messages.filter((m) => m.roomId !== roomId) })),

    getPendingByRoom: (roomId) => get().messages.filter((m) => m.roomId === roomId && (m as any).status === 'pending'),

    commitStatus: (id, status) =>
      set((s) => {
        const next = s.messages.map((m) =>
          String(m.id) === String(id) ? ({ ...m, status } as any) : m
        );
        const nextMeta = { ...s.retryMeta };
        if (status === 'sent') {
          delete nextMeta[String(id)];
        }
        return { messages: next, retryMeta: nextMeta } as Partial<ChatStoreState>;
      }),

    retryMessage: (id) =>
      set((s) => {
        const cur = s.retryMeta[id] ?? { retry: 0, next: 0 };
        const retry = cur.retry + 1;
        // simple exponential backoff capped at 60s
        const delay = Math.min(60000, Math.round(1500 * Math.pow(2, cur.retry)));
        const next = Date.now() + delay;

        const msgs = s.messages.map((m) =>
          String(m.id) === String(id) ? ({ ...m, status: 'pending' } as any) : m
        );

        return {
          messages: msgs,
          retryMeta: { ...s.retryMeta, [id]: { retry, next } },
        };
      }),

    flushPending: (roomId) => {
      const { messages, retryMeta } = get();
      const now = Date.now();
      return messages.filter((m) => {
        const isRoomOk = !roomId || m.roomId === roomId;
        const isPending = (m as any).status === 'pending';
        const meta = retryMeta[String(m.id)];
        const due = !meta || meta.next <= now;
        return isRoomOk && isPending && due;
      });
    },

    removeMessage: (id) =>
      set((s) => {
        const nextMeta = { ...s.retryMeta };
        delete nextMeta[String(id)];
        return {
          messages: s.messages.filter((m) => String(m.id) !== String(id)),
          retryMeta: nextMeta,
        };
      }),

    addPendingMessage: (msg) => set((s) => ({ pendingMessages: [...s.pendingMessages, msg] })),

    removePendingMessage: (id) => set((s) => ({ pendingMessages: s.pendingMessages.filter(m => String(m.id) !== String(id)) })),

    clearPendingMessages: () => set(() => ({ pendingMessages: [] })),
}))