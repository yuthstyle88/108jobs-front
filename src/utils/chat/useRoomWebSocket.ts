import type {ChatMessage} from "@/lib/lemmy-js-client/src";
import {createContext, useContext, useEffect} from "react";
import {addRoomListener, removeRoomListener} from "@/utils/chat/chat-socket-utils";
import {WebSocketContextValue} from "@/utils/chat/types";
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

        // also forward typing events for the active room
        const onTyping = (e: Event) => {
            const detail = (e as CustomEvent).detail as any;
            if (!detail) return;
            if (String(detail.roomId) !== String(context.roomId)) return;
            // deliver a synthetic MessageEvent so existing handlers can branch on data.type === 'typing'
            const evt = new MessageEvent('message', {data: {type: 'typing', ...detail}});
            onMessage(evt as any);
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('chat:typing', onTyping);
        }

        return () => {
            removeRoomListener(key);
            if (typeof window !== 'undefined') {
                window.removeEventListener('chat:typing', onTyping);
            }
        };
    }, [key, onMessage, context.roomId]);

    return context;
};