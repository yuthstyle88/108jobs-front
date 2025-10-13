import {useEffect} from "react";
import {HttpService, REQUEST_STATE} from "@/services/HttpService";
import {useReadLastIdStore} from "@/core/chat/store/readLastIdStore";
import {ChatRoomId, LocalUserId} from "lemmy-js-client";

export function useLoadLastRead(roomId: ChatRoomId, peerId: LocalUserId) {
    useEffect(() => {
        if (!roomId || !peerId) return;

        let active = true;

        HttpService.client.getLastRead({roomId, peerId}).then((res) => {
            if (!active || !res || res.state !== REQUEST_STATE.SUCCESS || !res.data?.lastRead) return;
            const lastRead = res.data.lastRead;
            const {setPeerLastReadAt} = useReadLastIdStore.getState();
            setPeerLastReadAt(roomId, lastRead.localUserId, lastRead.updatedAt);
        });

        return () => {
            active = false;
        };
    }, [roomId, peerId]);
}
