/**
 * A captcha response.
 */
export type CaptchaResponse = {
    /**
     * A Base64 encoded png
     */
    png: string;
    /**
     * A Base64 encoded wav audio
     */
    wav: string;
    /**
     * The UUID for the captcha item.
     */
    uuid: string;
};
