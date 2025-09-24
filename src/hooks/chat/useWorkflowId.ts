// useWorkflowId.ts (client hook)
import { useEffect, useState } from "react";

export function useWorkflowId(roomId: string | undefined, roomData?: any) {
    const [workflowId, setWorkflowId] = useState<number | undefined>(undefined);

    // hydrate จาก payload ที่โหลดจาก backend ทุกครั้งที่ room/roomData เปลี่ยน
    useEffect(() => {
        if (!roomId) return;
        const idFromRoom =
            (roomData?.room?.workflow?.id as number) ??
            (roomData?.workflow?.id as number) ??
            undefined;
        setWorkflowId(
            !Number.isNaN(idFromRoom)
                ? idFromRoom
                : undefined
        );
    }, [roomId, roomData]);

    // expose setter ไว้ใช้หลังเรียก API (startWorkflow/…)
    return { workflowId, setWorkflowId };
}