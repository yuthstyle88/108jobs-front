import type { ActivityId } from "./ActivityId";
import type { InstanceId } from "./InstanceId";
export type ReadableFederationState = {
    /**
     * timestamp of the next retry attempt (null if fail count is 0)
     */
    nextRetry?: string;
    instanceId: InstanceId;
    /**
     * the last successfully sent activity id
     */
    lastSuccessfulId?: ActivityId;
    lastSuccessfulPublishedTimeAt?: string;
    /**
     * how many failed attempts have been made to send the next activity
     */
    failCount: number;
    /**
     * timestamp of the last retry attempt (when the last failing activity was resent)
     */
    lastRetryAt?: string;
};
