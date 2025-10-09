// src/core/chat/store/chatStore.ts
import { create } from 'zustand'
import { ChatMessage, ChatStatus } from 'lemmy-js-client'

// --- local pure helpers (no Zustand refs) ---
function mergeIntoMessages(list: ChatMessage[], msg: ChatMessage): ChatMessage[] {
  const k = String(msg.id);
  const map = new Map(list.map(m => [String(m.id), m]));
  const prev = map.get(k);
  map.set(k, prev ? { ...prev, ...msg } : msg);
  return Array.from(map.values());
}

function removeAt<T>(arr: T[], index: number): T[] {
  if (index < 0 || index >= arr.length) return arr.slice();
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

type RetryMeta = Record<string, { retry: number; next: number }>

interface ChatStoreState {
    messages: ChatMessage[]
    retryMeta: RetryMeta
    pendingMessages: ChatMessage[]
    lastReadIdMap?: Record<string, string>
    peerLastReadIdMap?: Record<string, string>
}

interface ChatStoreActions {
    addMessage: (msg: ChatMessage) => void
    upsertHistory: (items: ChatMessage[]) => void
    upsertMessage: (msg: ChatMessage) => void
    addPending: (msg: ChatMessage) => void
    removePending: (id: string) => void
    promoteToSent: (id: string) => void
    markFailed: (id: string) => void
    upsertRetryMeta: (id: string, meta: { retry: number; next: number }) => void
    dropRetryMeta: (id: string) => void
    clearRoom: (roomId: string) => void
    getPendingByRoom: (roomId: string) => ChatMessage[]
    getFailedByRoom: (roomId: string) => ChatMessage[]
    getMessageById: (id: string) => ChatMessage | undefined
    commitStatus: (id: string, status: ChatStatus) => void
    retryMessage: (id: string) => void
    flushPending: (roomId?: string) => ChatMessage[]
    flushFailed: (roomId?: string) => ChatMessage[]
    removeMessage: (id: string) => void
    addPendingMessage: (msg: ChatMessage) => void
    removePendingMessage: (id: string) => void
    clearPendingMessages: () => void
    setLastReadId: (roomId: string, id: string) => void
    getLastReadAt: (roomId: string) => string | undefined
    clearLastReadId: (roomId: string) => void
    setPeerLastReadId: (roomId: string, id: string) => void
    getPeerLastReadAt: (roomId: string) => string | undefined
    clearPeerLastReadId: (roomId: string) => void
}

export const useChatStore = create<ChatStoreState & ChatStoreActions>((set, get) => ({
    messages: [],
    retryMeta: {},
    pendingMessages: [],
    lastReadIdMap: {},
    peerLastReadIdMap: {},
    online: false,

    addMessage: (msg) => set(() => ({ messages: mergeIntoMessages(get().messages, msg) })),

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
    upsertMessage: (msg) =>
      set((s) => ({ messages: mergeIntoMessages(s.messages, msg) })),

    addPending: (msg) =>
      set((s) => {
        const byId = new Map(s.pendingMessages.map(m => [String(m.id), m]));
        const k = String(msg.id);
        const prev = byId.get(k);
        byId.set(k, { ...(prev ?? ({} as ChatMessage)), ...msg, status: 'pending' as ChatStatus });
        return { pendingMessages: Array.from(byId.values()) };
      }),

    removePending: (id) =>
      set((s) => ({ pendingMessages: s.pendingMessages.filter((m) => String(m.id) !== String(id)) })),

    promoteToSent: (id) => get().commitStatus(id, 'sent' as ChatStatus),

    markFailed: (id) =>
      set((s) => {
        let foundInPending = false;
        const pendingUpdated = s.pendingMessages.map((m) => {
          if (String(m.id) === String(id)) {
            foundInPending = true;
            return { ...m, status: 'failed' as ChatStatus };
          }
          return m;
        });
        if (foundInPending) {
          return { pendingMessages: pendingUpdated };
        } else {
          const messagesUpdated = s.messages.map((m) => String(m.id) === String(id) ? { ...m, status: 'failed' as ChatStatus } : m);
          return { messages: messagesUpdated };
        }
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
      set((s) => {
        const nextMap = { ...(s.lastReadIdMap || {}) } as Record<string, string>;
        delete nextMap[String(roomId)];
        const nextPeer = { ...(s.peerLastReadIdMap || {}) } as Record<string, string>;
        delete nextPeer[String(roomId)];
        return {
          messages: s.messages.filter((m) => String(m.roomId) !== String(roomId)),
          lastReadIdMap: nextMap,
          peerLastReadIdMap: nextPeer,
        };
      }),

    getPendingByRoom: (roomId) => get().pendingMessages.filter((m) => String(m.roomId) === String(roomId) && (m as any).status === 'pending'),
    getFailedByRoom: (roomId) => {
      const { messages, pendingMessages } = get();
      const list = [...pendingMessages, ...messages]; // pending first
      const seen = new Set<string>();
      const failed: ChatMessage[] = [];
      for (const m of list) {
        if (String(m.roomId) === String(roomId) && (m.status as ChatStatus) === ('failed' as ChatStatus)) {
          const k = String(m.id);
          if (!seen.has(k)) {
            seen.add(k);
            failed.push(m);
          }
        }
      }
      return failed;
    },

    getMessageById: (id) => {
      const { messages, pendingMessages } = get();
      const k = String(id);
      return (
        messages.find(m => String(m.id) === k) ||
        pendingMessages.find(m => String(m.id) === k)
      );
    },

    commitStatus: (id, status) =>
      set((s) => {
        const k = String(id);
        const pendingIndex = s.pendingMessages.findIndex(m => String(m.id) === k);
        let pendingMessages = s.pendingMessages;
        let messages = s.messages;
        const nextMeta = { ...s.retryMeta };

        if (pendingIndex !== -1) {
          const pendingMsg = s.pendingMessages[pendingIndex];

          if (status === 'sent') {
            // 1) remove from pending
            pendingMessages = removeAt(s.pendingMessages, pendingIndex);
            // 2) upsert into messages as sent
            messages = mergeIntoMessages(s.messages, { ...pendingMsg, status } as ChatMessage);
            // 3) clear retry meta
            delete nextMeta[k];
          } else {
            // update status in pending only
            pendingMessages = s.pendingMessages.map((m, i) =>
              i === pendingIndex ? ({ ...m, status } as ChatMessage) : m
            );
          }
        } else {
          // Not in pending: update messages only
          const current = s.messages.find(m => String(m.id) === k);
          if (current) {
            messages = mergeIntoMessages(s.messages, { ...current, status } as ChatMessage);
          }
          if (status === 'sent') {
            delete nextMeta[k];
          }
        }

        return { messages, pendingMessages, retryMeta: nextMeta } as Partial<ChatStoreState>;
      }),

    retryMessage: (id) =>
      set((s) => {
        const cur = s.retryMeta[id] ?? { retry: 0, next: 0 };
        const retry = cur.retry + 1;
        // simple exponential backoff capped at 60s
        const delay = Math.min(60000, Math.round(1500 * Math.pow(2, cur.retry)));
        const next = Date.now() + delay;

        const pendingMessages = s.pendingMessages.map((m) =>
          String(m.id) === String(id) ? ({ ...m, status: 'pending' as ChatStatus } as any) : m
        );

        return {
          pendingMessages,
          retryMeta: { ...s.retryMeta, [id]: { retry, next } },
        };
      }),

    flushPending: (roomId) => {
      const { pendingMessages, retryMeta } = get();
      const now = Date.now();
      return pendingMessages.filter((m) => {
        const isRoomOk = !roomId || m.roomId === roomId;
        const isPending = (m as any).status === 'pending';
        const meta = retryMeta[String(m.id)];
        const due = !meta || meta.next <= now;
        return isRoomOk && isPending && due;
      });
    },
    flushFailed: (roomId) => {
      const { pendingMessages, retryMeta } = get();
      const now = Date.now();
      return pendingMessages.filter((m) => {
        const isRoomOk = !roomId || m.roomId === roomId;
        const isPending = (m as any).status === 'failed';
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
          pendingMessages: s.pendingMessages.filter((m) => String(m.id) !== String(id)),
          retryMeta: nextMeta,
        };
      }),

    addPendingMessage: (msg) => get().addPending(msg),
    removePendingMessage: (id) => get().removePending(id),

    clearPendingMessages: () => set(() => ({ pendingMessages: [] })),

    setLastReadId: (roomId, id) =>
      set((s) => ({ lastReadIdMap: { ...(s.lastReadIdMap || {}), [String(roomId)]: String(id) } })),

    getLastReadAt: (roomId) => {
      const map = get().lastReadIdMap || {};
      const id = map[String(roomId)];
      if (!id) return undefined;
      const { messages, pendingMessages } = get();
      const k = String(id);
      const msg =
        messages.find((m) => String(m.id) === k) ||
        pendingMessages.find((m) => String(m.id) === k);
      const at = (msg as any)?.createdAt as string | undefined;
      return at;
    },

    setPeerLastReadId: (roomId, id) =>
      set((s) => ({ peerLastReadIdMap: { ...(s.peerLastReadIdMap || {}), [String(roomId)]: String(id) } })),

    getPeerLastReadAt: (roomId) => {
      const map = get().peerLastReadIdMap || {};
      const id = map[String(roomId)];
      if (!id) return undefined;
      const { messages, pendingMessages } = get();
      const k = String(id);
      const msg =
        messages.find((m) => String(m.id) === k) ||
        pendingMessages.find((m) => String(m.id) === k);
      const at = (msg as any)?.createdAt as string | undefined;
      return at;
    },

    clearPeerLastReadId: (roomId) =>
      set((s) => {
        const next = { ...(s.peerLastReadIdMap || {}) } as Record<string, string>;
        delete next[String(roomId)];
        return { peerLastReadIdMap: next };
      }),

    clearLastReadId: (roomId) =>
      set((s) => {
        const next = { ...(s.lastReadIdMap || {}) } as Record<string, string>;
        delete next[String(roomId)];
        return { lastReadIdMap: next };
      }),
}))