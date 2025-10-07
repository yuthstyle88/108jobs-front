import * as React from "react";
import {UserService} from "@/services";
import {
    broadcastToListeners,
    handleIncomingPayload,
    isChatMessageLike,
    isValidIncomingChatPayload,
    normalizePhoenixEnvelope,
    unwrapPhoenixFrame,
} from "@/core/chat/utils/chatSocketUtils";
import type {NormalizedEnvelope} from "@/core/chat/utils/chatSocketUtils";
import {emitChatTyping,} from "@/core/chat/events/index";
import type {ChatMessage, ChatRoomData} from "lemmy-js-client";
import {
    buildMessageSignature,
    cleanupFetch, dbg,
    maybeHandleReadReceipt,
    maybeHandleStatusChange,
    mergeNewMessages,
    parseTypingDetail,
    tryFlushAutoAck
} from "@/core/chat/utils";
import {ChatTypingDetail} from "@/core/chat/types";

export interface HandlerRefs {
    /** set of processed message signatures for dedupe */
    processedMsgRef: React.RefObject<Set<string>>;
    /** mark that peer is active right now */
    peerActiveRef: React.RefObject<boolean>;
    /** pending page cursor setter from history fetch */
    setPageCursor?: (cursor: any) => void;
    setHasMoreMessages?: (b: boolean) => void;
    setIsFetching?: (b: boolean) => void;
    /** fetch coordination */
    fetchTimeoutRef?: React.RefObject<any>;
    fetchResolveRef?: React.RefObject<(() => void) | null>;
    /** read-ack support */
    readAckRef: React.RefObject<((lastId: string) => void) | null>;
    ackCooldownRef: React.RefObject<number>;
}

export interface HandlerDeps extends HandlerRefs {
    roomId: string;
    /** current user id */
    localUserId: number;
    /** inform UI that room data has been refreshed */
    setRefreshRoomData: (data: ChatRoomData) => void;
    /** inform that peer is active (UI hint) */
    markPeerActive: () => void;
    /** optional: push typing state directly to UI in addition to DOM event */
    onRemoteTyping?: (detail: ChatTypingDetail) => void;
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
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
        onRemoteTyping,
        setMessages,
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
    const meId = Number(localUserId);
    const roomIdStr = String(roomId);

    const handleWSMessage = async (event: any) => {
        let payload: any;
        try {
            payload = unwrapPhoenixFrame(event);
            if (!isValidIncomingChatPayload(payload)) {
                // Keep log lightweight; the permissive mapper below will try its best.
                try {
                    console.debug("[ws] payload failed strict validation; attempting permissive mapping");
                } catch {
                }
            }
            // Normalize once only
            const env: NormalizedEnvelope = normalizePhoenixEnvelope(payload.data, roomIdStr);
            try {
                markPeerActive();
            } catch {
            }
            // 1) status-change → refresh & return
            if (await maybeHandleStatusChange(env, roomIdStr, setRefreshRoomData)) {
                return null;
            }

            // 2) typing → DOM + optional callback

            const typingInfo = parseTypingDetail(env, roomIdStr, meId);
            dbg("handleWSMessage", typingInfo);
            if (typingInfo) {
                try {
                    emitChatTyping(typingInfo);
                } catch {
                }
                try {
                    onRemoteTyping?.(typingInfo);
                } catch {
                }
            }

            // 3) read-receipt → emit & return
            if (maybeHandleReadReceipt(env, roomIdStr)) {
                return;
            }

            // 4) message payloads → handle + merge
            const msgs = await handleIncomingPayload(payload.data, {
                roomId: roomIdStr,
                localUserId: meId,
                token: UserService.Instance.auth(),
                sharedKeyHex: UserService.Instance.authInfo?.sharedKey,
                receivedSet: processedMsgRef.current,
                setPageCursor,
                setHasMoreMessages,
                setIsFetching,
                fetchTimeoutRef,
                fetchResolveRef,
            });

            if (Array.isArray(msgs) && msgs.length) {
                let lastAckId: string | undefined;
                const newItems: ChatMessage[] = [];

                for (const item of msgs) {
                    broadcastToListeners(item);
                    if (!isChatMessageLike(item)) continue;

                    const signature = buildMessageSignature(item);
                    // if (processedMsgRef.current.has(signature)) continue;
                    processedMsgRef.current.add(signature);


                    const fromSelf = Number(item.senderId) === meId;
                    const peerActiveNow = peerActiveRef.current;
                    const enhancedItem = {...item, unread: fromSelf ? !peerActiveNow : false} as ChatMessage;
                    newItems.push(enhancedItem);

                    const msgId = String(item.id || "");
                    const sameRoom = String(item.roomId) === roomIdStr;
                    if (sameRoom && !fromSelf && msgId) lastAckId = msgId;
                }

                if (lastAckId) (handleWSMessage as any)._batchAckLastId = lastAckId;

                if (newItems.length > 0) {
                    setMessages(prev => mergeNewMessages(prev, newItems));
                }

                // 5) auto-ack flush (once)
                tryFlushAutoAck(handleWSMessage, roomIdStr, readAckRef, ackCooldownRef);
            }
        } catch (e) {
            cleanupFetch(setIsFetching, fetchTimeoutRef, fetchResolveRef);
            try {
                broadcastToListeners(payload ?? unwrapPhoenixFrame(event));
            } catch {
            }
        }
    };

    return handleWSMessage;
}
