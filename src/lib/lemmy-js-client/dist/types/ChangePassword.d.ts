import type { SensitiveString } from "./SensitiveString";
/**
 * Changes your account password.
 */
export type ChangePassword = {
    newPassword: SensitiveString;
    newPasswordVerify: SensitiveString;
    oldPassword: SensitiveString;
};
