"use client";

import {useEffect, useState} from "react";
import {PhoenixChatBridgeProvider} from "@/modules/chat/contexts/PhoenixChatBridgeProvider";
import ChatRoomView from "../../../../../modules/chat/components/ChatRoomView";
import {HttpService, UserService} from "@/services";
import LoadingBlur from "@/components/Common/Loading/LoadingBlur";
import {REQUEST_STATE} from "@/services/HttpService";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {LocalUserId, PersonId, Post} from "@/lib/lemmy-js-client";
import {RoomNotFound} from "@/components/RoomNotFound";
import {useStateMachineStore} from "@/modules/chat/store/stateMachineStore";
import {deriveAesGcmKeyHex, ensureIdentityKeyPair} from "@/utils";

export default function MessageClient({roomId}: { roomId: string }) {
    const isLoggedIn = UserService.Instance.isLoggedIn;
    const {localUser} = useMyUser() as { localUser: any };
    const [state, setState] = useState<{
        partnerName: string;
        partnerId?: LocalUserId;
        partnerAvatar?: string;
        partnerPersonId?: PersonId
        currentRoom?: any;
        post?: Post;
        notFound: boolean;
        partnerAvailable?: boolean;
    }>({
        partnerName: "Unknown",
        notFound: false,
    });
    const [showDelay, setShowDelay] = useState(false);
    const isReady = Boolean(localUser && state.partnerId);
    const reset = useStateMachineStore((s) => s.reset);
    useEffect(() => {
        if (roomId) reset();
    }, [roomId, reset]);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | undefined;
        if (!isReady) {
            setShowDelay(false);
            timer = setTimeout(() => setShowDelay(true), 300); // delay spinner 300ms
        } else {
            setShowDelay(false);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [isReady]);

    if (!isReady) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
                ⚠️ Chat room is not ready or missing required data.
            </div>
        );
    }

    if (state.notFound) {
        return <RoomNotFound/>;
    }

    return (
        <PhoenixChatBridgeProvider
            isLoggedIn={isLoggedIn}
            roomId={roomId}
        >
            <ChatRoomView
                post={state.post}
                partnerName={state.partnerName}
                partnerAvatar={state?.partnerAvatar}
                partnerId={state.partnerId as LocalUserId}
                partnerAvailable={state.partnerAvailable}
                roomData={state.currentRoom}
                localUser={localUser}
            />
        </PhoenixChatBridgeProvider>
    );
}