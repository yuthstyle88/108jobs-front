import {useEffect} from "react";
import {HttpService, REQUEST_STATE} from "@/services/HttpService";
import {useReadLastIdStore} from "@/core/chat/store/readLastIdStore";
import {ChatRoomId, LocalUserId} from "@/lib/lemmy-js-client/src";

export function useLoadLastRead(roomId: ChatRoomId, myUserId: LocalUserId) {
    useEffect(() => {
        if (!roomId || !myUserId) return;

        let active = true;

        HttpService.client.getLastRead({roomId}).then((res) => {
            if (!active || !res || res.state !== REQUEST_STATE.SUCCESS || !res.data?.lastRead) return;

            const lastRead = res.data.lastRead;
            const {setLastReadAt, setPeerLastReadAt} = useReadLastIdStore.getState();

            if (Number(lastRead.localUserId) === Number(myUserId)) {
                // It's me → store my read timestamp
                setLastReadAt(roomId, myUserId, lastRead.updatedAt);
            } else {
                // It's another peer in the room
                setPeerLastReadAt(roomId, lastRead.localUserId, lastRead.updatedAt);
            }
        });

        return () => {
            active = false;
        };
    }, [roomId, myUserId]);
}
