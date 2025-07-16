import type { SensitiveString } from "./SensitiveString";
/**
 * Change your password after receiving a reset request.
 */
export type PasswordChangeAfterReset = {
    token: SensitiveString;
    password: SensitiveString;
    passwordVerify: SensitiveString;
};
