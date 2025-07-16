import type { InstanceId } from "./InstanceId";
/**
 * Block an instance as user
 */
export type UserBlockInstanceParams = {
    instanceId: InstanceId;
    block: boolean;
};
