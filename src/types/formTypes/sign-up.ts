export type SignUpFormData = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean; 
  privacyAccepted: boolean;
  promotionalAccepted?: boolean;
  captcha_uuid?: string;
  captcha_answer: string;
  accountType: "employer" | "freelancer";
};