import {RoleType} from "@/lib/lemmy-js-client/src/types/RoleType";

export type RegisterOAuthFormData = {
  email: string;
  password: string;
  confirmPassword: string;
  privacyAccepted: boolean;
  termsAccepted: boolean;
  role: RoleType;
};