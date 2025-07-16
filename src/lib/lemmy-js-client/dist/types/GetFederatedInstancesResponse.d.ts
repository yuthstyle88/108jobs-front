import type { FederatedInstances } from "./FederatedInstances";
/**
 * A response of federated instances.
 */
export type GetFederatedInstancesResponse = {
    /**
     * Optional, because federation may be disabled.
     */
    federatedInstances?: FederatedInstances;
};
