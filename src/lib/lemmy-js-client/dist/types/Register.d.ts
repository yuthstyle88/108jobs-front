import type { SensitiveString } from "./SensitiveString";
/**
 * Register / Sign up to lemmy.
 */
export type Register = {
    username: string;
    password: SensitiveString;
    passwordVerify: SensitiveString;
    showNsfw?: boolean;
    /**
     * email is mandatory if email verification is enabled on the server
     */
    email?: SensitiveString;
    /**
     * The UUID of the captcha item.
     */
    captchaUuid?: string;
    /**
     * Your captcha answer.
     */
    captchaAnswer?: string;
    /**
     * An answer is mandatory if require application is enabled on the server
     */
    role?: string;

    acceptedApplication?: boolean;
};
