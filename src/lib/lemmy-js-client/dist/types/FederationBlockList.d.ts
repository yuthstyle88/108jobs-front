import type { InstanceId } from "./InstanceId";
export type FederationBlockList = {
    instanceId: InstanceId;
    publishedAt: string;
    updatedAt?: string;
    expiresAt?: string;
};
