import {RoleType} from "@/lib/lemmy-js-client/src/types/RoleType";

export type RegisterFormData = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean; 
  privacyAccepted: boolean;
  promotionalAccepted?: boolean;
  captchaUuid?: string;
  captchaAnswer: string;
  role: RoleType;
};