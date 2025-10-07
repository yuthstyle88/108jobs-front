// src/core/chat/store/chatStore.ts
import { create } from 'zustand'
import { ChatMessage } from 'lemmy-js-client'

type RetryMeta = Record<string, { retry: number; next: number }>

interface ChatStoreState {
    messages: ChatMessage[]
    pendingMessages: ChatMessage[]
    retryMeta: RetryMeta
    online: boolean
}

interface ChatStoreActions {
    addMessage: (msg: ChatMessage) => void
    addPending: (msg: ChatMessage) => void
    removePending: (id: string) => void
    promoteToSent: (id: string) => void
    markFailed: (id: string) => void
    upsertRetryMeta: (id: string, meta: { retry: number; next: number }) => void
    dropRetryMeta: (id: string) => void
    clearRoom: (roomId: string) => void
    getPendingByRoom: (roomId: string) => ChatMessage[]
    setOnline: (status: boolean) => void
}

export const useChatStore = create<ChatStoreState & ChatStoreActions>((set, get) => ({
    messages: [],
    pendingMessages: [],
    retryMeta: {},
    online: false,

    addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),

    addPending: (msg) =>
      set((s) => ({ pendingMessages: [...s.pendingMessages, msg] })),

    removePending: (id) =>
      set((s) => ({ pendingMessages: s.pendingMessages.filter((m) => m.id !== id) })),

    promoteToSent: (id) =>
      set((s) => {
        const idx = s.pendingMessages.findIndex((m) => m.id === id);
        if (idx === -1) return {} as Partial<ChatStoreState>; // no-op but keep type

        const pending = s.pendingMessages[idx];
        const updated: ChatMessage = { ...pending, status: 'sent' };

        const nextPending = s.pendingMessages.slice();
        nextPending.splice(idx, 1);

        const nextMeta = { ...s.retryMeta };
        delete nextMeta[id];

        return {
          messages: [...s.messages, updated],
          pendingMessages: nextPending,
          retryMeta: nextMeta,
        } as Partial<ChatStoreState>;
      }),

    markFailed: (id) =>
      set((s) => {
        const updated = s.pendingMessages.map((m) =>
          m.id === id ? { ...m, status: 'failed' as const } : m
        );
        return { pendingMessages: updated };
      }),

    upsertRetryMeta: (id, meta) =>
      set((s) => ({ retryMeta: { ...s.retryMeta, [id]: meta } })),

    dropRetryMeta: (id) =>
      set((s) => {
          const meta = { ...s.retryMeta }
          delete meta[id]
          return { retryMeta: meta }
      }),

    clearRoom: (roomId) =>
      set((s) => ({
          messages: s.messages.filter((m) => m.roomId !== roomId),
          pendingMessages: s.pendingMessages.filter((m) => m.roomId !== roomId),
      })),

    getPendingByRoom: (roomId) => get().pendingMessages.filter((m) => m.roomId === roomId),
    setOnline: (status) => set(() => ({ online: status })),
}))