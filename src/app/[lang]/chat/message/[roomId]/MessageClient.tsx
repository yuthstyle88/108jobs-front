"use client";

import {useEffect, useState} from "react";
import {WebSocketProvider} from "@/contexts/RealtimeChatContext";
import ChatSection from "../../_components/ChatSection";
import {HttpService, UserService} from "@/services";
import LoadingBlur from "@/components/LoadingBlur";
import {REQUEST_STATE} from "@/services/HttpService";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComment} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import {Post} from "@/lib/lemmy-js-client";

export default function MessageClient({roomId}: { roomId: string }) {
    const accessToken = UserService.Instance.auth();
    const {localUser} = useMyUser();

    const [partnerName, setPartnerName] = useState<string>("Unknown");
    const [partnerId, setPartnerId] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [peerPublicKeyHex, setPeerPublicKeyHex] = useState<string | undefined>(undefined);
    const [post, setPost] = useState<Post>();
    const [notFound, setNotFound] = useState<boolean>(false);

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
                try { setPost(((chatRoomRes.data as any)?.room?.post) ?? ((chatRoomRes.data as any)?.post)); } catch {}

                const other = participants.find(
                    (p: any) => String(p.memberId) !== String(localUser.id)
                );

                if (other) {
                    const res = await HttpService.client.visitProfile(String(other.memberId));

                    const profileName =
                        res.state === REQUEST_STATE.SUCCESS
                            ? res.data.profile.name
                            : "Unknown";
                    setPartnerId(res.state === REQUEST_STATE.SUCCESS ? res.data.profile.id : null);

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

    if (!accessToken || !roomId) {
        return <LoadingBlur text="Missing authentication or room ID"/>;
    }

    if (loading) {
        return <Link prefetch={false} href="/chat" className="relative text-white text-sm px-3">
            <FontAwesomeIcon icon={faComment} className="w-[24px] h-[24px] text-white"/>
        </Link>
    }

    if (notFound) {
        return (
            <div className="flex items-center justify-center w-full h-[calc(100vh-80px)]">
                <div className="text-center p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Room not found</h2>
                    <p className="text-gray-600 mb-4">The chat room you are trying to access does not exist or may have been deleted.</p>
                    <Link href="/chat" className="inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-[#063a68] transition-colors">Go back to Chats</Link>
                </div>
            </div>
        );
    }



    return (
        <WebSocketProvider token={accessToken} roomId={roomId} peerPublicKeyHex={peerPublicKeyHex}>
            <ChatSection roomId={roomId} post={post} partnerName={partnerName} partnerAvatar={""} partnerId={partnerId as number}/>
        </WebSocketProvider>
    );
}
