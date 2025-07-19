import type { LocalUserId } from "./LocalUserId";
import type { PersonId } from "./PersonId";
import type { RegistrationApplicationId } from "./RegistrationApplicationId";
/**
 * A registration application.
 */
export type RegistrationApplication = {
    id: RegistrationApplicationId;
    localUserId: LocalUserId;
    answer: string;
    admin_id?: PersonId;
    deny_reason?: string;
    publishedAt: string;
};
