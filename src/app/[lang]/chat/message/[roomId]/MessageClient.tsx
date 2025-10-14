"use client";

import {useEffect, useState} from "react";
import {PhoenixChatBridgeProvider} from "@/modules/chat/contexts/PhoenixChatBridgeProvider";
import ChatSection from "../../../../../modules/chat/components/ChatSection";
import {HttpService, UserService} from "@/services";
import LoadingBlur from "@/components/Common/Loading/LoadingBlur";
import {REQUEST_STATE} from "@/services/HttpService";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {Post} from "@/lib/lemmy-js-client";
import {RoomNotFound} from "@/components/RoomNotFound";
import {useStateMachineStore} from "@/modules/chat/store/stateMachineStore";
import {deriveAesGcmKeyHex, ensureIdentityKeyPair} from "@/utils";

export default function MessageClient({roomId}: { roomId: string }) {
    const accessToken = UserService.Instance.auth();
    const {localUser} = useMyUser();
    const [state, setState] = useState<{
        partnerName: string;
        partnerId?: number;
        currentRoom?: any;
        shareKey?: string;
        post?: Post;
        notFound: boolean;
        loading: boolean;
        partnerAvailable?: boolean;
    }>({
        partnerName: "Unknown",
        notFound: false,
        loading: true,
    });
    const reset = useStateMachineStore((s) => s.reset);

    useEffect(() => {
        if (roomId) reset();
    }, [roomId, reset]);

    useEffect(() => {
        if (!accessToken || !roomId || !localUser?.id) {
            setState((prev) => ({...prev, loading: false}));
            return;
        }

        let cancelled = false;

        const fetchData = async () => {
            try {
                // 1. Ensure local user's key pair and send public key to server
                let publicKeyHex: string | undefined;
                try {
                    const { publicKeyHex: localPubKeyHex, privateKey: clientPrivateKey } = await ensureIdentityKeyPair();
                    publicKeyHex = localPubKeyHex;
                    // Send public key to server
                    const exchangeRes = await HttpService.client.exchangePublicKey({
                        publicKey: publicKeyHex,
                    });
                    if (exchangeRes.state === REQUEST_STATE.SUCCESS) {
                        const serverPublicKeyHex = String(
                            exchangeRes.data?.publicKey ?? exchangeRes.data?.publicKey ?? ""
                        ).trim();
                        if (!serverPublicKeyHex) throw new Error("Server returned empty public key");
                        if (!clientPrivateKey) throw new Error("Missing client private key from ensureIdentityKeyPair()");

                        // derive shared AES-256 (hex) using client private key + server public key (hex)
                        const shareKeyHex = await deriveAesGcmKeyHex(clientPrivateKey, serverPublicKeyHex);

                        setState((prev) => ({
                            ...prev,
                            shareKey: shareKeyHex, // shared AES-256 key (hex) aligned with backend
                        }));
                    } else {
                        console.warn("Failed to exchange public key:", exchangeRes);
                        setState((prev) => ({ ...prev, loading: false }));
                    }
                } catch (error) {
                    console.warn("Error during public key exchange:", error);
                    setState((prev) => ({ ...prev, loading: false }));
                }

                // 2. Fetch chat room data
                const chatRoomRes = await HttpService.client.getChatRoom(roomId);
                if (cancelled) return;

                // Handle "empty" or "failed" states explicitly
                if (chatRoomRes.state === REQUEST_STATE.EMPTY) {
                    setState((prev) => ({...prev, notFound: true, loading: false}));
                    return;
                }

                if (chatRoomRes.state === REQUEST_STATE.FAILED) {
                    const errMsg = String(chatRoomRes.err?.message || "").toLowerCase();
                    if (errMsg.includes("notfound") || errMsg.includes("404")) {
                        setState((prev) => ({...prev, notFound: true, loading: false}));
                    }
                    return;
                }

                // Handle "success" state
                if (chatRoomRes.state === REQUEST_STATE.SUCCESS) {
                    const room = chatRoomRes.data;
                    const isNotFound = String(chatRoomRes.data || "")
                        .toLowerCase()
                        .includes("notfound");

                    if (!room || isNotFound) {
                        setState((prev) => ({
                            ...prev,
                            notFound: true,
                            loading: false,
                            currentRoom: room,
                        }));
                        return;
                    }

                    setState((prev) => ({
                        ...prev,
                        currentRoom: room,
                        post: room?.room.post ?? chatRoomRes.data?.room.post,
                    }));

                    const participants = room?.room.participants ?? [];
                    const other = participants.find(
                        (p) => String(p.memberId) !== String(localUser.id)
                    );

                    if (other) {
                        const [profileRes] = await Promise.all([
                            HttpService.client.visitProfile(String(other.memberId)),
                        ]);

                        if (cancelled) return;

                        setState((prev) => ({
                            ...prev,
                            partnerName:
                                profileRes.state === REQUEST_STATE.SUCCESS
                                    ? profileRes.data.profile.name
                                    : prev.partnerName,
                            partnerId: Number(other.memberId),
                            partnerAvailable:
                                profileRes.state === REQUEST_STATE.SUCCESS
                                    ? profileRes.data.profile.available
                                    : undefined,
                            loading: false,
                        }));
                    } else {
                        setState((prev) => ({...prev, loading: false}));
                    }
                }
            } catch (error) {
                if (!cancelled) {
                    console.error("Error fetching data:", error);
                    setState((prev) => ({...prev, notFound: true, loading: false}));
                }
            }
        };

        fetchData();

        return () => {
            cancelled = true;
        };
    }, [accessToken, roomId, localUser?.id]);


    if (!accessToken || !roomId || !localUser || !state.shareKey || !state.partnerId || state.loading) {
        return <LoadingBlur text=""/>;
    }

    if (state.notFound) {
        return <RoomNotFound/>;
    }

    return (
        // NOTE: state.shareKey now holds **shared AES-256 key (hex)** derived via ECDH, not a peer public key.
        <PhoenixChatBridgeProvider
            token={accessToken}
            roomId={roomId}
            peerPublicKeyHex={state.shareKey}
        >
            <ChatSection
                post={state.post}
                partnerName={state.partnerName}
                partnerAvatar=""
                partnerId={state.partnerId}
                partnerAvailable={state.partnerAvailable}
                roomData={state.currentRoom}
                localUser={localUser}
                shareKey={state.shareKey}
            />
        </PhoenixChatBridgeProvider>
    );
}