import type { CaptchaResponse } from "./CaptchaResponse";
/**
 * A wrapper for the captcha response.
 */
export type GetCaptchaResponse = {
    /**
       * Will be None if captchas are disabled.
       */
    ok?: CaptchaResponse;
};
