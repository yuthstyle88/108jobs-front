import type { InstanceWithFederationState } from "./InstanceWithFederationState";
/**
 * A list of federated instances.
 */
export type FederatedInstances = {
    linked: Array<InstanceWithFederationState>;
    allowed: Array<InstanceWithFederationState>;
    blocked: Array<InstanceWithFederationState>;
};
