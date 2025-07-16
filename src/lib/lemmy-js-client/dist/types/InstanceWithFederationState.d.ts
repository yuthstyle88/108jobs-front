import type { InstanceId } from "./InstanceId";
import type { ReadableFederationState } from "./ReadableFederationState";
export type InstanceWithFederationState = {
    /**
     * if federation to this instance is or was active, show state of outgoing federation to this
     * instance
     */
    federationState?: ReadableFederationState;
    id: InstanceId;
    domain: string;
    publishedAt: string;
    /**
     * When the instance was updated.
     */
    updatedAt?: string;
    /**
     * The software of the instance.
     */
    software?: string;
    /**
     * The version of the instance's software.
     */
    version?: string;
};
