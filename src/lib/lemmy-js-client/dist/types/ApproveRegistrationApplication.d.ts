import type { RegistrationApplicationId } from "./RegistrationApplicationId";
/**
 * Approves a registration application.
 */
export type ApproveRegistrationApplication = {
    id: RegistrationApplicationId;
    approve: boolean;
    deny_reason?: string;
};
