// src/modules/chat/store/chatStore.ts
import {create} from 'zustand'
import {ChatMessage, ChatStatus} from 'lemmy-js-client'
import {normRoom} from "@/utils/helpers";
import {useReadLastIdStore} from "@/modules/chat/store/readStore";

// Utility function for read-last-id store interaction
const readLastIdUtils = {
  setLastReadAt: (roomId: string, senderId: number, createdAt: string) => {
    try {
      const state = useReadLastIdStore.getState();
      if (typeof state.setLastReadAt === 'function') {
        state.setLastReadAt(roomId, senderId, createdAt);
      }
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.debug('[chatStore.readLastIdUtils] setLastReadAt failed', e);
      }
    }
  }
};


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
    retryMeta: RetryMeta
    listMessages: ChatMessage[]
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
    getByRoom: (roomId: string) => ChatMessage[]
    getMessageById: (id: string) => ChatMessage | undefined
    commitStatus: (id: string, status: ChatStatus) => void
    retryMessage: (id: string) => void
    flushPending: (roomId?: string) => ChatMessage[]
    flushFailed: (roomId?: string) => ChatMessage[]
    removeMessage: (id: string) => void
    addPendingMessage: (msg: ChatMessage) => void
    removePendingMessage: (id: string) => void
    clearPendingMessages: () => void
}

export const useChatStore = create<ChatStoreState & ChatStoreActions>((set, get) => ({
    retryMeta: {},
    listMessages: [],

    addMessage: (msg) => set((s) => {
      const keep = (msg as any).status === 'pending' || (msg as any).status === 'failed';
      if (!keep) return {} as any;
      return { listMessages: mergeIntoMessages(s.listMessages, msg) };
    }),

    upsertHistory: (_items) => set(() => ({})),

    upsertMessage: (msg) => set((s) => {
      if (typeof window !== 'undefined' && msg.roomId && msg.senderId && msg.createdAt) {
        readLastIdUtils.setLastReadAt(msg.roomId, msg.senderId, msg.createdAt);
      }
      const keep = (msg as any).status === 'pending' || (msg as any).status === 'failed';
      if (!keep) {
        // remove if previously existed
        const k = String(msg.id);
        return { listMessages: s.listMessages.filter(m => String(m.id) !== k) };
      }
      return { listMessages: mergeIntoMessages(s.listMessages, msg) };
    }),

    addPending: (msg) => set((s) => {
      const k = String(msg.id);
      const map = new Map(s.listMessages.map(m => [String(m.id), m]));
      const prev = map.get(k);
      map.set(k, { ...(prev ?? ({} as ChatMessage)), ...msg, isOwner: true, status: 'pending' as ChatStatus });
      return { listMessages: Array.from(map.values()) };
    }),

    removePending: (id) => set((s) => ({
      listMessages: s.listMessages.filter((m) => String(m.id) !== String(id))
    })),

    promoteToSent: (id) => get().commitStatus(id, 'sent' as ChatStatus),

    markFailed: (id) => set((s) => {
      const k = String(id);
      const idx = s.listMessages.findIndex(m => String(m.id) === k);
      if (idx === -1) return {} as any;
      const next = s.listMessages.slice();
      next[idx] = { ...next[idx], status: 'failed' as ChatStatus } as ChatMessage;
      return { listMessages: next };
    }),

    upsertRetryMeta: (id, meta) =>
      set((s) => ({ retryMeta: { ...s.retryMeta, [id]: meta } })),

    dropRetryMeta: (id) =>
      set((s) => {
          const meta = { ...s.retryMeta }
          delete meta[id]
          return { retryMeta: meta }
      }),

    getByRoom: (roomId) => {
      const norm = normRoom(String(roomId));
      const list = get().listMessages.filter(m => normRoom(String(m.roomId)) === norm);
      list.sort((a, b) => {
        const ta = a.createdAt ?? '';
        const tb = b.createdAt ?? '';
        if (ta && tb && ta !== tb) return ta.localeCompare(tb);
        return String(a.id).localeCompare(String(b.id));
      });
      return list;
    },

    getMessageById: (id) => get().listMessages.find(m => String(m.id) === String(id)),

    commitStatus: (id, status) => set((s) => {
      const k = String(id);
      const idx = s.listMessages.findIndex(m => String(m.id) === k);
      let next = s.listMessages;
      const nextMeta = { ...s.retryMeta };

      if (idx !== -1) {
        const cur = s.listMessages[idx];
        if (status === 'sent') {
          // remove successful messages from local store
          next = removeAt(s.listMessages, idx);
          delete nextMeta[k];
        } else {
          next = s.listMessages.map((m, i) => i === idx ? ({ ...m, status } as ChatMessage) : m);
        }
      } else {
        if (status === 'sent') {
          // ensure cleanup if somehow present
          next = s.listMessages.filter(m => String(m.id) !== k);
          delete nextMeta[k];
        }
      }

      return { listMessages: next, retryMeta: nextMeta } as Partial<ChatStoreState>;
    }),

    retryMessage: (id) => set((s) => {
      const cur = s.retryMeta[id] ?? { retry: 0, next: 0 };
      const retry = cur.retry + 1;
      const delay = Math.min(60000, Math.round(1500 * Math.pow(2, cur.retry)));
      const nextTime = Date.now() + delay;
      return {
        listMessages: s.listMessages.map((m) =>
          String(m.id) === String(id) ? ({ ...m, status: 'pending' as ChatStatus } as ChatMessage) : m
        ),
        retryMeta: { ...s.retryMeta, [id]: { retry, next: nextTime } },
      };
    }),

    flushPending: (roomId) => {
      const { listMessages, retryMeta } = get();
      const now = Date.now();
      const norm = roomId ? normRoom(String(roomId)) : undefined;
      return listMessages.filter((m: any) => {
        const isRoomOk = !norm || normRoom(String(m.roomId)) === norm;
        const isPending = m.status === 'pending';
        const meta = retryMeta[String(m.id)];
        const due = !meta || meta.next <= now;
        return isRoomOk && isPending && due;
      });
    },
    flushFailed: (roomId) => {
      const { listMessages, retryMeta } = get();
      const now = Date.now();
      const norm = roomId ? normRoom(String(roomId)) : undefined;
      return listMessages.filter((m: any) => {
        const isRoomOk = !norm || normRoom(String(m.roomId)) === norm;
        const isFailed = m.status === 'failed';
        const meta = retryMeta[String(m.id)];
        const due = !meta || meta.next <= now;
        return isRoomOk && isFailed && due;
      });
    },

    removeMessage: (id) => set((s) => {
      const nextMeta = { ...s.retryMeta };
      delete nextMeta[String(id)];
      return {
        listMessages: s.listMessages.filter((m) => String(m.id) !== String(id)),
        retryMeta: nextMeta,
      };
    }),

    addPendingMessage: (msg) => get().addPending(msg),
    removePendingMessage: (id) => get().removePending(id),
    clearPendingMessages: () => set((s) => ({ listMessages: s.listMessages.filter((m: any) => m.status !== 'pending') })),

}))