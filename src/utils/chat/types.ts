import {LocalUserId} from "@/lib/lemmy-js-client/src";

export type WsMessageSender = (data: MessagePayload) => void | Promise<void>;
/**
 * Public API exposed by the Realtime chat WebSocket context.
 * Keep this minimal and stable; prefer adding helpers inside the provider.
 */
export interface WebSocketContextValue {
    /** Send a chat message (handles encryption if configured). */
    sendMessage: (data: MessagePayload) => void;
    /** Notify others that the local user is typing or stopped typing. */
    sendTyping?: (isTyping: boolean) => void;
    /** Notify others need room update to fetch new. */
    sendRoomUpdate: (roomId: string, update: Record<string, any>) => void;
    /** Request next page of history over the socket if supported. */
    fetchHistory: () => Promise<void>;
    /** True if WebSocket is open and ready. */
    isConnected: boolean;
    /** Current room identifier. */
    roomId: string;
    /** True when server indicates there are more messages to fetch. */
    hasMoreMessages: boolean;
    /** True when a history fetch is in-flight. */
    isFetching: boolean;
    refreshRoomData: any;
    sendReadReceipt: (roomId: string, lastMessageId: string) => void;
}

export interface MessagePayload {
    message: string;
    senderId: LocalUserId;
    id?: string;
}