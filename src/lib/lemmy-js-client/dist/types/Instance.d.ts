import type { InstanceId } from "./InstanceId";
/**
 * Basic data about a Fediverse instance which is available for every known domain. Additional
 * data may be available in [[Site]].
 */
export type Instance = {
    id: InstanceId;
    domain: string;
    publishedAt: string;
    /**
     * When the instance was updated.
     */
    updated_at?: string;
    /**
     * The software of the instance.
     */
    software?: string;
    /**
     * The version of the instance's software.
     */
    version?: string;
};
