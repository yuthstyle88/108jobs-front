export type RegisterOAuthFormData = {
  email: string;
  name: string;
  termsAccepted: boolean; 
  accountType: "employer" | "freelancer";
};