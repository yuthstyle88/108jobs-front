import type { AdminBlockInstanceId } from "./AdminBlockInstanceId";
import type { InstanceId } from "./InstanceId";
import type { PersonId } from "./PersonId";
export type AdminBlockInstance = {
    id: AdminBlockInstanceId;
    instanceId: InstanceId;
    adminPersonId: PersonId;
    blocked: boolean;
    reason?: string;
    expires_at?: string;
    publishedAt: string;
};
