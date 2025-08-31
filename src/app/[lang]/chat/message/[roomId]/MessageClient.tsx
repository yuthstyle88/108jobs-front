"use client";

import {WebSocketProvider} from "@/contexts/RealtimeChatContext";
import ChatSection from "../../_components/ChatSection";
import {UserService} from "@/services";

export default function MessageClient({roomId}: { roomId: string }) {

    const accessToken = UserService.Instance.auth();
    if (!accessToken) return null;

    return (
        <WebSocketProvider token={accessToken} roomId={roomId}>
            <ChatSection/>
        </WebSocketProvider>
    );
}
