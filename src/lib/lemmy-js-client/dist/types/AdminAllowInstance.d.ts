import type { AdminAllowInstanceId } from "./AdminAllowInstanceId";
import type { InstanceId } from "./InstanceId";
import type { PersonId } from "./PersonId";
export type AdminAllowInstance = {
    id: AdminAllowInstanceId;
    instanceId: InstanceId;
    adminPersonId: PersonId;
    allowed: boolean;
    reason?: string;
    publishedAt: string;
};
