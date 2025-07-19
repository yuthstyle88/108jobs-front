import type { InstanceId } from "./InstanceId";
export type FederationBlockList = {
    instanceId: InstanceId;
    publishedAt: string;
    updated_at?: string;
    expires_at?: string;
};
