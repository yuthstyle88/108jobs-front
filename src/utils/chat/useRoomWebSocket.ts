import type {ChatMessage} from "@/lib/lemmy-js-client/src";
import {createContext, useContext, useEffect} from "react";
import {addRoomListener, removeRoomListener} from "@/utils/chat/chat-socket-utils";
import {WebSocketContextValue} from "@/utils/chat/types";
import { onChatNewMessage, onChatTyping } from "@/events/chat";
export const WebSocketContext = createContext<WebSocketContextValue | undefined>(undefined);
export const useWebSocket = (
    key: string,
    onMessage: (event: MessageEvent<string | ChatMessage | ChatMessage[]>) => void
): WebSocketContextValue => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error("useWebSocket must be used within WebSocketProvider");
    }

    useEffect(() => {
        // normal chat message binding
        addRoomListener(key, context.roomId, onMessage as any);

        // forward local UI new-message events via event bus (optimistic updates)
        const unsubscribeLocal = onChatNewMessage((detail) => {
            if (!detail) return;
            if (String(detail.roomId) !== String(context.roomId)) return;
            const evt = new MessageEvent('message', { data: { type: 'local:new_message', ...detail } });
            onMessage(evt as any);
        });

        // forward typing events via unified event bus (chat:typing)
        const unsubscribeTyping = onChatTyping((detail) => {
            if (!detail) return;
            if (String(detail.roomId) !== String(context.roomId)) return;
            const evt = new MessageEvent('message', { data: { type: 'local:typing', ...detail } });
            onMessage(evt as any);
        });

        return () => {
            removeRoomListener(key);
            unsubscribeLocal();
            unsubscribeTyping();
        };
    }, [key, onMessage, context.roomId]);

    return context;
};