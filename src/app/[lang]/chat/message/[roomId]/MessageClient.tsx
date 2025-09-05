"use client";

import { useEffect, useState } from "react";
import { WebSocketProvider } from "@/contexts/RealtimeChatContext";
import ChatSection from "../../_components/ChatSection";
import { HttpService, UserService } from "@/services";
import LoadingBlur from "@/components/LoadingBlur";
import { REQUEST_STATE } from "@/services/HttpService";
import { useMyUser } from "@/hooks/profile-api/useMyUser";

export default function MessageClient({ roomId }: { roomId: string }) {
    const accessToken = UserService.Instance.auth();
    const { localUser } = useMyUser();

    const [partnerName, setPartnerName] = useState<string>("Unknown");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!accessToken || !roomId || !localUser?.id) return;

        (async () => {
            const chatRoomRes = await HttpService.client.getChatRoom(roomId);

            if (chatRoomRes.state === REQUEST_STATE.SUCCESS) {
                const participants = chatRoomRes.data.participants as any[];

                const other = participants.find(
                    (p: any) => String(p.memberId) !== String(localUser.id)
                );

                if (other) {
                    const res = await HttpService.client.visitProfile(String(other.memberId));

                    const profileName =
                        res.state === REQUEST_STATE.SUCCESS
                            ? res.data.profile.name
                            : { name: "Unknown" };
                    setPartnerName(profileName.toString());
                }
            }
            setLoading(false);
        })();
    }, [accessToken, roomId, localUser]);

    if (!accessToken || !roomId) {
        return <LoadingBlur text="Missing authentication or room ID" />;
    }

    if (loading) {
        return <LoadingBlur text="Loading chat…" />;
    }

    return (
        <WebSocketProvider token={accessToken} roomId={roomId}>
            <ChatSection roomId={roomId} partnerName={partnerName} partnerAvatar={""} />
        </WebSocketProvider>
    );
}
