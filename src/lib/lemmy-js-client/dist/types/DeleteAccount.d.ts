import type { SensitiveString } from "./SensitiveString";
/**
 * Delete your account.
 */
export type DeleteAccount = {
    password: SensitiveString;
    deleteContent: boolean;
};
