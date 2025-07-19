import type { SensitiveString } from "./SensitiveString";
export type GenerateTotpSecretResponse = {
    totp_secret_url: SensitiveString;
};
