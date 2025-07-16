import type { SensitiveString } from "./SensitiveString";
/**
 * Logging into lemmy.
 *
 * Note: Banned users can still log in, to be able to do certain things like delete
 * their account.
 */
export type Login = {
    usernameOrEmail: SensitiveString;
    password: SensitiveString;
    /**
     * May be required, if totp is enabled for their account.
     */
    totp2faToken?: string;
};
