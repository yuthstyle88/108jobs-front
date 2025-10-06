"use client";
import { useMemo, useCallback, useEffect } from "react";
import { useChatStore } from "@/store/chatStore";
import type { ChatMessage, ChatStatus } from "lemmy-js-client";

const CHAT_DEBUG = true; // toggle debug logs
function dbg(...args: any[]) {
    if (CHAT_DEBUG) {
        try { console.info("[useChatLocal]", ...args); } catch {}
    }
}

export interface UseChatLocalReturn {
    // connectivity / meta
    isOnline: boolean;
    pendingCount: number;
    failedCount: number;
    autoFlush: boolean;

    // timeline
    messages: ChatMessage[]; // merged, de-duplicated, sorted asc by createdAt then id
    pending: ChatMessage[];  // raw pending for room (for UI badges/lists)
    failed: ChatMessage[];   // subset of pending with status=failed
    byId: (id: string) => ChatMessage | undefined;

    // actions (UI-safe wrappers that delegate to store)
    send: (content: string, senderId?: number) => Promise<ChatMessage>;
    retry: (id: string) => void;
    remove: (id: string) => void;
    resendFailed: () => Promise<void>;
    commitStatus: (id: string, status: ChatStatus, patch?: Partial<ChatMessage>) => void;
    flushNow: () => Promise<void>;
}

export function useChatLocal(roomId: string): UseChatLocalReturn {
    const store = useChatStore();

    const isOnline = store.isOnline;
    const messages = store.getMessages(roomId);
    const pending = store.getPending(roomId);
    const pendingCount = pending.length;
    const failedCount = pending.filter((m) => (m as any).status === "failed").length;

    useEffect(() => {
        dbg("state", { roomId, isOnline, messages: messages.length, pending: pending.length, failed: failedCount });
    }, [roomId, isOnline, messages.length, pending.length, failedCount]);

    const failed = useMemo(
      () => pending.filter((m) => (m as any).status === "failed"),
      [pending]
    );

    const flushPending = useCallback(async () => {
        dbg("flushPending()", { roomId });
        await store.flushPending();
    }, [store, roomId]);

    const autoFlush = isOnline && pendingCount > 0;
    useEffect(() => {
        if (!autoFlush) return;
        // Only flush for this room if there are pending in this room.
        dbg("autoFlush → flushPending()", { roomId, pending: pendingCount });
        void flushPending();
    }, [autoFlush, flushPending]);

    const byId = useCallback(
      (id: string) => {
          const found = store.getMessageById(roomId, id);
          dbg("byId()", { roomId, id, hit: !!found });
          return found;
      },
      [roomId, store]
    );

    const send = useCallback(
      async (content: string, senderId?: number) => {
          dbg("send()", { roomId, hasContent: !!content, senderId });
          return await store.sendMessage(roomId, content, senderId);
      },
      [roomId, store]
    );

    const retry = useCallback(
      (id: string) => {
          dbg("retry()", { roomId, id });
          store.retryMessage(id);
      },
      [store, roomId]
    );

    const remove = useCallback(
      (id: string) => {
          dbg("remove()", { roomId, id });
          store.removeMessage(id);
      },
      [store, roomId]
    );

    const resendFailed = useCallback(async () => {
        if (!failed.length) { dbg("resendFailed() skip (none)", { roomId }); return; }
        dbg("resendFailed() → flushPending()", { roomId, count: failed.length });
        await flushPending();
    }, [failed.length, flushPending, roomId]);

    const commitStatus = useCallback(
      (id: string, status: ChatStatus, patch?: Partial<ChatMessage>) => {
          dbg("commitStatus()", { roomId, id, status, hasPatch: !!patch });
          store.commitStatus(roomId, id, status, patch);
      },
      [roomId, store]
    );

    const flushNow = flushPending;

    return {
        isOnline,
        pendingCount,
        failedCount,
        autoFlush,
        messages,
        pending,
        failed,
        byId,
        send,
        retry,
        remove,
        resendFailed,
        commitStatus,
        flushNow,
    };
}