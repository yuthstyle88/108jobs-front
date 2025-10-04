// src/store/chatStore.ts
import { create } from "zustand";
import { nanoid } from "nanoid";
import { ChatMessage } from "lemmy-js-client";

interface ChatState {
    messages: ChatMessage[];
    pendingMessages: ChatMessage[];

    addMessage: (roomId: string, senderId: number, content: string) => ChatMessage;
    markMessageSent: (id: string) => void;
    markMessageFailed: (id: string) => void;
    retryMessage: (id: string) => void;
    commitStatus: (roomId: string, id: string, status: ChatMessage['status'], patch?: Partial<ChatMessage>) => void;
    removeMessage: (id: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    messages: [],
    pendingMessages: [],

    addMessage: (roomId, senderId, content) => {
        const msg: ChatMessage = {
            id: nanoid(),
            roomId,
            senderId,
            content,
            createdAt: new Date().toISOString(),
            status: "pending",
        };
        set((state) => ({
            pendingMessages: [...state.pendingMessages, msg],
        }));
        return msg;
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
        const msg = get().pendingMessages.find((m) => m.id === id);
        if (!msg) return;
        // trigger send API อีกครั้ง
        console.log("Retry sending:", msg);
    },

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
}));