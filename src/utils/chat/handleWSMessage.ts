import * as React from "react";
import {HttpService, UserService} from "@/services";
import {
  unwrapPhoenixFrame,
  normalizePhoenixEnvelope,
  isValidIncomingChatPayload,
  broadcastToListeners,
  handleIncomingPayload,
  isChatMessageLike,
} from "@/utils/chat/chat-socket-utils";
import {isBrowser} from "@/utils";
import {REQUEST_STATE} from "@/services/HttpService";
import { emitChatTyping, emitReadReceipt, type ChatTypingDetail } from "@/events/chat";

export interface HandlerRefs {
  /** set of processed message signatures for dedupe */
  processedMsgRef: React.MutableRefObject<Set<string>>;
  /** mark that peer is active right now */
  peerActiveRef: React.MutableRefObject<boolean>;
  /** pending page cursor setter from history fetch */
  setPageCursor: (cursor: any) => void;
  setHasMoreMessages: (b: boolean) => void;
  setIsFetching: (b: boolean) => void;
  /** fetch coordination */
  fetchTimeoutRef: React.MutableRefObject<any>;
  fetchResolveRef: React.MutableRefObject<(() => void) | null>;
  /** read-ack support */
  readAckRef: React.MutableRefObject<((lastId: string) => void) | null>;
  ackCooldownRef: React.MutableRefObject<number>;
}

export interface HandlerDeps extends HandlerRefs {
  roomId: string;
  /** current user id */
  localUserId: number;
  /** inform UI that room data has been refreshed */
  setRefreshRoomData: (data: any) => void;
  /** inform that peer is active (UI hint) */
  markPeerActive: () => void;
}

export function buildMessageSignature(item: any): string {
  const id = item?.id != null ? String(item.id) : '';
  if (id) return `id:${id}`;
  const r = String(item?.roomId ?? '');
  const s = String(item?.senderId ?? '');
  const t = String(item?.createdAt ?? '');
  const c = typeof item?.content === 'string' ? item.content : JSON.stringify(item?.content ?? '');
  return `sig:${r}|${s}|${t}|${c}`;
}

/**
 * Factory to create a stable WS onmessage handler, with all external state passed via deps.
 */
export function createHandleWSMessage(deps: HandlerDeps) {
  const {
    roomId,
    localUserId,
    setRefreshRoomData,
    markPeerActive,
    processedMsgRef,
    peerActiveRef,
    setPageCursor,
    setHasMoreMessages,
    setIsFetching,
    fetchTimeoutRef,
    fetchResolveRef,
    readAckRef,
    ackCooldownRef,
  } = deps;

  const handleWSMessage = async (event: any) => {
    try {
      const token = UserService.Instance.auth();
      const sharedKeyHex = UserService.Instance.authInfo?.sharedKey;
      let payload: any = unwrapPhoenixFrame(event);

      if (!isValidIncomingChatPayload(payload)) {
        console.debug(
          "onmessage: payload not passing strict validator, attempting permissive mapping...",
          payload,
        );
      }

      // Normalize once
      const env: any = normalizePhoenixEnvelope(payload, roomId);

      // Shortcut: status-change -> refresh room once
      try {
        const evName = String((env as any)?.content || "");
        if (evName && evName.includes("status-change")) {
          try {
            const chatRoomRes = await HttpService.client.getChatRoom(roomId);
            if (chatRoomRes.state === REQUEST_STATE.SUCCESS) {
              setRefreshRoomData(chatRoomRes.data);
              try {
                markPeerActive();
              } catch {}
            }
          } catch (err) {
            console.error("Error fetching room:", err);
          }
          return null as any;
        }
      } catch {}

      // Broadcast typing notifications to listeners (but never to the typist themselves)
      try {
        const evName = String((env as any)?.event || "");
        if (evName && evName.includes("typing")) {
          const senderIdNum = Number((env as any)?.sender_id ?? (env as any)?.senderId ?? 0);
          const info: ChatTypingDetail = {
            roomId: String((env as any)?.topic || roomId),
            senderId: senderIdNum,
            typing:
              (env as any)?.typing ??
              (evName.includes("start") ? true : evName.includes("stop") ? false : !!(env as any)?.isTyping),
          };
          if (senderIdNum !== Number(localUserId)) {
            try {
              markPeerActive();
            } catch {}
            emitChatTyping(info);
          }
        }
      } catch {}

      // Handle read receipt events → broadcast to UI
      try {
        const evName = String((env as any)?.event || (env as any)?.content || "");
        if (evName === "chat:read-receipt" || evName === "chat:read") {
          const room_id = (env as any)?.room_id || (env as any)?.roomId || (env as any)?.topic || roomId;
          const last_read_message_id = (env as any)?.last_read_message_id || (env as any)?.lastReadMessageId;
          const reader_id = Number((env as any)?.reader_id ?? (env as any)?.readerId ?? 0);
          emitReadReceipt(String(room_id), String(last_read_message_id || ""), reader_id);
          return;
        }
      } catch {}

      const msgs = await handleIncomingPayload(payload, {
        roomId,
        localUserId: Number(localUserId),
        token,
        sharedKeyHex,
        receivedSet: processedMsgRef.current, // reuse processed set to limit memory; optional split if needed
        setPageCursor,
        setHasMoreMessages,
        setIsFetching,
        fetchTimeoutRef,
        fetchResolveRef,
      });

      if (Array.isArray(msgs) && msgs.length) {
        for (const item of msgs) {
          // Broadcast to in-app listeners
          broadcastToListeners(item);
          // Only fire chat:new-message for real messages (not typing/partial frames)
          try {
            if (!isChatMessageLike(item)) continue;
            // Unified dedupe (prefer id; fall back to composite signature)
            const signature = buildMessageSignature(item as any);
            if (processedMsgRef.current.has(signature)) {
              continue;
            }
            processedMsgRef.current.add(signature);

            const msgId = String((item as any).id || "");
            const fromSelf = Number((item as any).senderId) === Number(localUserId);
            const peerActiveNow = peerActiveRef.current;
            const detail = {
              id: msgId,
              roomId: String((item as any).roomId),
              content: String((item as any).content ?? ""),
              createdAt: String((item as any).createdAt || new Date().toISOString()),
              // If message is from self and peer isn't currently active in this room, mark as unread for recipient view
              // Incoming messages to us are considered read (for our side) when they arrive in the active room
              unread: fromSelf ? !peerActiveNow : false,
            };

            // Collect the latest id for this batch to avoid spamming the acker (ignore self messages)
            try {
              const sameRoom = String((item as any).roomId) === String(roomId);
              const _fromSelf = Number((item as any).senderId) === Number(localUserId);
              if (sameRoom && !_fromSelf && detail.id) {
                try {
                  console.log("[read-ack] candidate:lastId", { roomId, id: String(detail.id) });
                } catch {}
                (handleWSMessage as any)._batchAckLastId = String(detail.id);
              }
            } catch {}

            if (isBrowser()) {
              try {
                // Dispatch exactly once via DOM (no secondary emitters)
                // NOTE: emitChatNewMessage is performed inside broadcastToListeners by downstream listeners if needed.
                // Keeping here minimal to avoid duplicate DOM events.
              } catch {}
            }
          } catch {}
        }
        // Flush one auto-ack (safe)
        try {
          const batchId = (handleWSMessage as any)._batchAckLastId as string | undefined;
          (handleWSMessage as any)._batchAckLastId = null;

          if (batchId) {
            const now = Date.now();
            const lastAcked = (handleWSMessage as any)._lastAckedId as string | undefined;

            // Determine if we should require an active, visible tab before sending read-acks.
            // Default: require focus (set localStorage `read_ack_require_focus` to "0" to allow background acks).
            const requireFocus = (() => {
              try {
                return localStorage.getItem("read_ack_require_focus") !== "0";
              } catch {
                return true;
              }
            })();

            const isActiveTab =
              typeof document !== "undefined"
                ? document.visibilityState === "visible" && (typeof document.hasFocus === "function" ? document.hasFocus() : true)
                : true;

            // If focus is required and the tab isn't active, skip only the ack (don't abort other message handling).
            if (requireFocus && !isActiveTab) {
              try {
                if (localStorage.getItem("debug_read_ack") === "1") {
                  console.log("[read-ack] skip: tab not active (visibility/focus required)");
                }
              } catch {}
              // skip ack, but do not return from handleWSMessage entirely; just bypass this ack cycle
            } else {
              if (lastAcked === batchId) {
                // skip: duplicated
                return;
              }
              if (now < ackCooldownRef.current) {
                // skip: cooldown
                return;
              }

              readAckRef.current?.(batchId);
              (handleWSMessage as any)._lastAckedId = batchId;
              ackCooldownRef.current = now + 900; // 900ms
            }
          }
        } catch {}
      }
    } catch (e) {
      setIsFetching(false);
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
        fetchTimeoutRef.current = null;
      }
      if (fetchResolveRef.current) {
        fetchResolveRef.current();
        fetchResolveRef.current = null;
      }
      try {
        broadcastToListeners(unwrapPhoenixFrame(event));
      } catch {}
    }
  };

  return handleWSMessage;
}
