"use client";

import {useEffect, useState} from "react";
import {PhoenixChatBridgeProvider} from "@/modules/chat/contexts/PhoenixChatBridgeProvider";
import ChatRoomView from "../../../../../modules/chat/components/ChatRoomView";
import {UserService} from "@/services";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {LocalUserId, PersonId, Post} from "@/lib/lemmy-js-client";
import {useStateMachineStore} from "@/modules/chat/store/stateMachineStore";

export default function MessageClient({roomId}: { roomId: string }) {
    const isLoggedIn = UserService.Instance.isLoggedIn;
    const {localUser} = useMyUser() as { localUser: any };
    console.log("localUser", localUser);
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
    const reset = useStateMachineStore((s) => s.reset);
    useEffect(() => {
        if (roomId) reset();
    }, [roomId, reset]);

    return (
        <PhoenixChatBridgeProvider
            key={roomId}
            isLoggedIn={isLoggedIn}
            roomId={roomId}
        >
            <ChatRoomView
                key={roomId}
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