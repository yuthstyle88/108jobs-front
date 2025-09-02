"use client";

import { WebSocketProvider } from "@/contexts/RealtimeChatContext";
import ChatSection from "../../_components/ChatSection";
import { UserService } from "@/services";
import LoadingBlur from "@/components/LoadingBlur";

export default function MessageClient({ roomId }: { roomId: string }) {
    const accessToken = UserService.Instance.auth();

    // Guard against missing accessToken or roomId
    if (!accessToken || !roomId) {
        return <LoadingBlur text="Missing authentication or room ID" />;
    }

    return (
        <WebSocketProvider token={accessToken} roomId={roomId}>
            <ChatSection roomId={roomId} />
        </WebSocketProvider>
    );
}