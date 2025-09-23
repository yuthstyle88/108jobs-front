import { v4 as uuidv4 } from 'uuid';
import type { ChatMessage as WsChatMessage } from 'lemmy-js-client';

export interface CreateChatRealtimeHandlerDeps {
  roomId: string;
  localUserId?: number | null;
  onRemoteTyping: (senderId: number, localId: number, typing: boolean) => void;
  getIsFetching: () => boolean;
  tryUpdateStatusFromItems: (items: WsChatMessage[]) => void;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>; // UIChatMessage[] in caller
  atBottomRef: React.MutableRefObject<boolean>;
  setNewSinceCount: React.Dispatch<React.SetStateAction<number>>;
  latestIncomingRef: React.MutableRefObject<{
    roomId: string;
    content: string;
    senderId: number;
    timestamp: string;
  } | null>;
}

/**
 * Factory that returns a WebSocket onMessage handler for ChatSection.
 * Extracted to keep ChatSection lean. Behavior is intentionally unchanged.
 */
export function createChatRealtimeHandler({
  roomId,
  localUserId,
  onRemoteTyping,
  getIsFetching,
  tryUpdateStatusFromItems,
  setMessages,
  atBottomRef,
  setNewSinceCount,
  latestIncomingRef,
}: CreateChatRealtimeHandlerDeps) {
  return (event: MessageEvent<string | WsChatMessage | WsChatMessage[]>) => {
    try {
      console.debug('[CHAT][RT] handler invoked for room', roomId);
    } catch {}

    let parsed: WsChatMessage | WsChatMessage[];
    try {
      const raw = event.data as unknown;
      parsed = typeof raw === 'string' ? JSON.parse(raw as string) : (raw as any);
    } catch (e) {
      console.error('Failed to parse WebSocket message:', e);
      return;
    }

    // Typing payloads from provider
    if (parsed && typeof parsed === 'object' && (parsed as any).type === 'typing') {
      const info = parsed as any;
      const senderId = Number(info.senderId) || 0;
      const val = !!info.typing;
      onRemoteTyping(senderId, Number(localUserId) || 0, val);
      return;
    }

    // DEBUG: verify realtime delivery into this component
    try {
      (globalThis as any).__chatRTLast = parsed;
      const arrLen = Array.isArray(parsed) ? parsed.length : 1;
      console.debug('[CHAT][RT] delivered to ChatSection', {
        roomId,
        arrLen,
        sample: Array.isArray(parsed) ? parsed[0] : parsed,
      });
    } catch {}

    // New protocol: provider broadcasts UI-ready ChatMessage objects (single or array)
    let items: WsChatMessage[] = [];
    if (Array.isArray(parsed)) {
      items = parsed as WsChatMessage[];
    } else if (parsed && typeof parsed === 'object') {
      items = [parsed as WsChatMessage];
    }
    if (!items.length) return;

    // Normalize: ensure id is string, createdAt present, senderId numeric
    items = items.map((m: any) => ({
      ...m,
      id: String(m.id ?? m.uuid ?? uuidv4()),
      createdAt: m.createdAt ?? m.created_at ?? new Date().toISOString(),
      senderId: typeof m.senderId === 'number' ? m.senderId : Number(m.sender_id ?? m.senderId ?? 0),
    }));
    try {
      console.debug('[CHAT][RT] items normalized:', { count: items.length, sample: items[0] });
    } catch {}

    // Realtime: update workflow status immediately based on structured message type
    try {
      if (!getIsFetching() && items.length > 0) {
        tryUpdateStatusFromItems(items);
      }
    } catch {
      /* ignore */
    }

    setMessages((prev: any[]) => {
      const copy = [...prev];
      let added = 0;
      let replaced = 0;
      let skippedDup = 0;
      let latestTs = 0;
      let latestContent: string | null = null;
      let latestSenderId: number | null = null;
      // Consider current batch as history if fetching or if this is the very first inflow (prev empty)
      const isHistoryBatch = getIsFetching() || prev.length === 0;
      let inc = 0;
      for (const msg of items) {
        const isDuplicate = copy.some(
          (m) =>
            m.content === (msg as any).content &&
            m.senderId === (msg as any).senderId &&
            Math.abs(new Date(m.createdAt).getTime() - new Date((msg as any).createdAt).getTime()) < 2000
        );
        if (isDuplicate) {
          skippedDup++;
          continue;
        }

        const idx = copy.findIndex((m) => m.id === (msg as any).id);
        const isIncoming = !(msg as any).isOwner;
        const newStatus = isIncoming
          ? atBottomRef.current || isHistoryBatch
            ? 1
            : 0
          : typeof (msg as any).status === 'number'
          ? (msg as any).status
          : 0;
        if (!isHistoryBatch && !atBottomRef.current && isIncoming) {
          inc++;
        }
        if (idx >= 0) {
          replaced++;
          copy[idx] = { ...(msg as any), status: newStatus } as any;
        } else {
          added++;
          copy.push({ ...(msg as any), status: newStatus } as any);
        }
        const ts = new Date((msg as any).createdAt).getTime();
        if (ts > latestTs) {
          latestTs = ts;
          latestContent = (msg as any).content;
          latestSenderId = (msg as any).senderId;
        }
      }
      const sorted = copy.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // Defer room preview updates only for live, single-message events (skip during history)
      if (!isHistoryBatch && inc > 0) {
        try {
          setNewSinceCount((prev) => prev + inc);
        } catch {}
        // Unread store is updated globally via ChatRoomsContext/ChatBadge listening to chat:new-message events.
        // Avoid direct increments here to prevent double counting.
      }
      if (!isHistoryBatch && items.length === 1 && latestTs > 0 && latestContent != null && latestSenderId != null) {
        const tsIso = new Date(latestTs).toISOString();
        latestIncomingRef.current = {
          roomId,
          content: latestContent,
          senderId: latestSenderId,
          timestamp: tsIso,
        };
      }
      return sorted;
    });
  };
}
