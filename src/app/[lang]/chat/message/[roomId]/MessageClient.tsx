"use client";

import {useEffect, useState} from "react";
import {PhoenixSocketProvider} from "@/contexts/RealtimeChatContext";
import ChatSection from "../../_components/ChatSection";
import {HttpService, UserService} from "@/services";
import LoadingBlur from "@/components/Common/Loading/LoadingBlur";
import {REQUEST_STATE} from "@/services/HttpService";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {Post} from "@/lib/lemmy-js-client";
import {RoomNotFound} from "@/components/RoomNotFound";

export default function MessageClient({roomId}: { roomId: string }) {
    const accessToken = UserService.Instance.auth();
    const {localUser} = useMyUser();

    const [partnerName, setPartnerName] = useState<string>("Unknown");
    const [partnerId, setPartnerId] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [peerPublicKeyHex, setPeerPublicKeyHex] = useState<string | undefined>(undefined);
    const [post, setPost] = useState<Post>();
    const [notFound, setNotFound] = useState<boolean>(false);
    const [partnerAvailable, setPartnerAvailable] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        let cancelled = false;
        if (!accessToken || !roomId || !localUser?.id) return;

        (async () => {
            const chatRoomRes = await HttpService.client.getChatRoom(roomId);

            if (!cancelled) {
                const dataAny: any = (chatRoomRes as any)?.data;
                const errAny: any = (chatRoomRes as any)?.err;
                const errName = String(errAny?.name || "").toLowerCase();
                const errMsg = String(errAny?.message || "").toLowerCase();
                const dataError = String(dataAny?.error || dataAny?.err || dataAny?.message || "").toLowerCase();
                const roomView = dataAny?.room;
                const hasValidRoom = !!roomView && typeof roomView === 'object' && !!roomView.room && typeof roomView.room === 'object';
                const isNFByError = errName.includes('notfound') || errMsg.includes('notfound') || errMsg.includes('404') || dataError.includes('notfound') || dataError.includes('404');

                if (
                    chatRoomRes.state === REQUEST_STATE.FAILED && isNFByError
                ) {
                    setNotFound(true);
                    setLoading(false);
                    return;
                }
                if (chatRoomRes.state === REQUEST_STATE.EMPTY) {
                    setNotFound(true);
                    setLoading(false);
                    return;
                }
                if (
                    chatRoomRes.state === REQUEST_STATE.SUCCESS && (!hasValidRoom || isNFByError)
                ) {
                    setNotFound(true);
                    setLoading(false);
                    return;
                }
            }

            if (!cancelled && chatRoomRes.state === REQUEST_STATE.SUCCESS) {
                const participants = ((chatRoomRes.data as any)?.room?.participants as any[]) ?? [];
                try {
                    setPost(((chatRoomRes.data as any)?.room?.post) ?? ((chatRoomRes.data as any)?.post));
                } catch {
                }

                const other = participants.find(
                    (p: any) => String(p.memberId) !== String(localUser.id)
                );

                if (other) {
                    const res = await HttpService.client.visitProfile(String(other.memberId));
                    setPartnerId(other.memberId);

                    const profileName =
                        res.state === REQUEST_STATE.SUCCESS
                            ? res.data.profile.name
                            : "Unknown";
                    if (res.state === REQUEST_STATE.SUCCESS) {
                        // Preserve undefined as undefined; only block sending if explicitly false
                        setPartnerAvailable((res.data as any)?.profile?.available);
                    }

                    if (!cancelled) setPartnerName(String(profileName));


                    // Fetch peer's published public keys for E2EE
                    try {
                        const keysRes = await HttpService.client.getUserKeys(Number(other.memberId));
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

    if (!accessToken || !roomId || loading) {
        return <LoadingBlur text=""/>;
    }

    if (notFound) {
        return (
            <RoomNotFound/>
        );
    }

    return (
        <PhoenixSocketProvider token={accessToken} roomId={roomId} peerPublicKeyHex={peerPublicKeyHex}>
            <ChatSection roomId={roomId} post={post} partnerName={partnerName} partnerAvatar={""}
                         partnerId={partnerId as number} partnerAvailable={partnerAvailable}/>
        </PhoenixSocketProvider>
    );
}
