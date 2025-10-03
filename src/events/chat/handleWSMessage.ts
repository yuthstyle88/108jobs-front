import * as React from "react";
import {HttpService, UserService} from "@/services";
import {
    broadcastToListeners,
    isChatMessageLike,
    isValidIncomingChatPayload,
    normalizePhoenixEnvelope,
    unwrapPhoenixFrame,
} from "@/utils/chat/chatSocketUtils";
import {REQUEST_STATE} from "@/services/HttpService";
import {type ChatTypingDetail, emitChatTyping, emitReadReceipt, handleIncomingPayload} from "@/events/chat/index";
import {ChatMessage} from "@/lib/lemmy-js-client/src";

// Local fallback for message de-duplication signature
export function buildMessageSignature(msg: any): string {
    try {
        // Prefer stable ids first
        const id = (msg?.id ?? msg?.msg_ref_id ?? msg?.messageId);
        if (id) return String(id);
        // Composite signature as a fallback (room,sender,timestamp,content)
        const room = String(msg?.roomId ?? msg?.room_id ?? "");
        const sender = String(msg?.senderId ?? msg?.sender_id ?? "");
        const ts = String(msg?.createdAt ?? msg?.created_at ?? "");
        const content = typeof msg?.content === "string" ? msg.content : JSON.stringify(msg?.content ?? "");
        return [room, sender, ts, content].join("|");
    } catch {
        // Absolute fallback: unique object identity (weak, but prevents crash)
        return Math.random().toString(36).slice(2);
    }
}

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
    setRefreshRoomData: (data: any) => void;
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
                            } catch {
                            }
                        }
                    } catch (err) {
                        console.error("Error fetching room:", err);
                    }
                    return null as any;
                }
            } catch {
            }

            // Broadcast typing notifications to listeners (but never to the typist themselves)
            try {
                const evName = String((env as any)?.event ?? (env as any)?.data?.event ?? "");
                if (evName && evName.includes("typing")) {
                    // Topics/room ids
                    const rawTopic = String((env as any)?.topic ?? (env as any)?.data?.topic ?? roomId ?? "");
                    const bare = rawTopic.startsWith("room:") ? rawTopic.slice(5) : rawTopic;
                    const pureRoomId = String((env as any)?.roomId ?? bare.split(":")[0] ?? bare);

                    // Prefer normalized payload if present
                    const p: any = (env as any)?.payload ?? env;

                    // senderId: payload → contentParsed → content(JSON) → topic
                    let senderIdNum = Number(p?.sender_id ?? p?.senderId ?? 0);
                    if (!senderIdNum) {
                        const cp: any = (env as any)?.contentParsed;
                        if (cp) {
                            senderIdNum = Number(cp?.senderId ?? cp?.sender_id ?? 0);
                        }
                    }

                    // typing: payload → contentParsed → content(JSON) → event name fallback
                    let typingFlag: boolean | undefined = typeof p?.typing === 'boolean' ? p.typing : undefined;
                    if (typeof typingFlag !== 'boolean') {
                        const cp: any = (env as any)?.contentParsed;
                        if (cp && typeof cp.typing === 'boolean') {
                            typingFlag = cp.typing;
                        }
                    }
                    if (typeof typingFlag !== 'boolean') {
                        try {
                            const c: any = p?.content;
                            if (typeof c === 'string' && c.trim().startsWith('{')) {
                                const j = JSON.parse(c);
                                if (typeof j?.typing === 'boolean') typingFlag = j.typing;
                            } else if (c && typeof c === 'object' && typeof c.typing === 'boolean') {
                                typingFlag = c.typing;
                            }
                        } catch {
                        }
                    }
                    if (typeof typingFlag !== 'boolean') {
                        typingFlag = evName.includes('start') ? true : evName.includes('stop') ? false : false;
                    }

                    // Skip invalid sender or self
                    if (!senderIdNum || senderIdNum === Number(localUserId)) return;
                    const info: ChatTypingDetail = {roomId: pureRoomId, senderId: senderIdNum, typing: typingFlag};
                    try {
                        markPeerActive();
                    } catch {
                    }
                    emitChatTyping(info);
                    try {
                        onRemoteTyping?.(info);
                    } catch {
                    }
                    try {
                        console.debug('[typing] dispatch → DOM+callback', info);
                    } catch {
                    }
                }
            } catch {
            }

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
            } catch {
            }
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
                const newItems: ChatMessage[] = [];

                for (const item of msgs) {
                    // Broadcast to global listeners
                    broadcastToListeners(item);

                    try {
                        if (!isChatMessageLike(item)) continue;

                        const signature = buildMessageSignature(item);
                        if (processedMsgRef.current.has(signature)) continue;
                        processedMsgRef.current.add(signature);

                        const fromSelf = Number((item as any).senderId) === Number(localUserId);
                        const peerActiveNow = peerActiveRef.current;

                        const enhancedItem = {
                            ...item,
                            unread: fromSelf ? !peerActiveNow : false,
                        };

                        newItems.push(enhancedItem as ChatMessage);

                        // Read-ack setup
                        const msgId = String((item as any).id || "");
                        const sameRoom = String((item as any).roomId) === String(roomId);
                        if (sameRoom && !fromSelf && msgId) {
                            try {
                                console.log("[read-ack] candidate:lastId", {roomId, id: msgId});
                            } catch {
                            }
                            (handleWSMessage as any)._batchAckLastId = msgId;
                        }
                    } catch {
                    }
                }

                if (newItems.length > 0) {
                    setMessages((prev: any[]) => {
                        const copy = [...prev];
                        let latestTs = 0;

                        for (const msg of newItems) {
                            const idx = copy.findIndex((m) => m.id === msg.id);
                            if (idx >= 0) {
                                copy[idx] = {...msg}; // Replace existing
                            } else {
                                copy.push({...msg}); // Add new
                            }

                            // Track the latest message info
                            const ts = new Date(msg.createdAt).getTime();
                            if (ts > latestTs) {
                                latestTs = ts;
                            }
                        }

                        // Sort newest → oldest (reverse for top-down if needed)
                        return copy.sort(
                            (a, b) =>
                                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                        );
                    });
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
                            } catch {
                            }
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
                } catch {
                }
            }
        } catch (e) {
            setIsFetching?.(false);
            if (fetchTimeoutRef?.current) {
                clearTimeout(fetchTimeoutRef.current);
                fetchTimeoutRef.current = null as any;
            }
            if (fetchResolveRef?.current) {
                fetchResolveRef.current();
                fetchResolveRef.current = null;
            }
            try {
                broadcastToListeners(unwrapPhoenixFrame(event));
            } catch {
            }
        }
    };

    return handleWSMessage;
}
