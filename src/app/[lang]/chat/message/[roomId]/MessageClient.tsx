"use client";

import {useEffect, useState} from "react";
import {WebSocketProvider} from "@/contexts/RealtimeChatContext";
import ChatSection from "../../_components/ChatSection";
import {HttpService, UserService} from "@/services";
import LoadingBlur from "@/components/LoadingBlur";
import {REQUEST_STATE} from "@/services/HttpService";
import {useMyUser} from "@/hooks/profile-api/useMyUser";

export default function MessageClient({ roomId }: { roomId: string }) {
    const accessToken = UserService.Instance.auth();
    const { localUser } = useMyUser();

    const [partnerName, setPartnerName] = useState<string>("Unknown");
    const [loading, setLoading] = useState(true);
    const [peerPublicKeyHex, setPeerPublicKeyHex] = useState<string | undefined>(undefined);

    useEffect(() => {
        let cancelled = false;
        if (!accessToken || !roomId || !localUser?.id) return;

        (async () => {
            const chatRoomRes = await HttpService.client.getChatRoom(roomId);

            if (!cancelled && chatRoomRes.state === REQUEST_STATE.SUCCESS) {
                const participants = chatRoomRes.data.participants as any[];

                const other = participants.find(
                    (p: any) => String(p.memberId) !== String(localUser.id)
                );

                if (other) {
                    const res = await HttpService.client.visitProfile(String(other.memberId));

                    const profileName =
                        res.state === REQUEST_STATE.SUCCESS
                            ? res.data.profile.name
                            : "Unknown";
                    if (!cancelled) setPartnerName(String(profileName));

                    // Fetch peer's published public keys for E2EE
                    try {
                        const keysRes = await (HttpService.client as any).getUserKeys(Number(other.memberId));
                        if (!cancelled && keysRes?.state === REQUEST_STATE.SUCCESS) {
                            const keys = (keysRes.data as any)?.publicKeys as string[] | undefined;
                            if (Array.isArray(keys) && keys.length > 0) {
                                setPeerPublicKeyHex(keys[0]);
                            }
                        }
                    } catch (e) {
                        // non-fatal: fall back to plaintext until key available
                        if (process.env.NODE_ENV !== 'production') {
                            console.warn('Failed to fetch peer public keys for E2EE', e);
                        }
                    }
                }
            }
            if (!cancelled) setLoading(false);
        })();

        return () => {
            cancelled = true;
        };
    }, [accessToken, roomId, localUser?.id]);

    if (!accessToken || !roomId) {
        return <LoadingBlur text="Missing authentication or room ID" />;
    }

    if (loading) {
        return <LoadingBlur text="Loading chat…" />;
    }

    return (
        <WebSocketProvider token={accessToken} roomId={roomId} peerPublicKeyHex={peerPublicKeyHex}>
            <ChatSection roomId={roomId} partnerName={partnerName} partnerAvatar={""} />
        </WebSocketProvider>
    );
}
