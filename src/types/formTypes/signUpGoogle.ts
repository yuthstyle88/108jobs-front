export type SignUpGoogleFormData = {
  email: string;
  name: string;
  termsAccepted: boolean; 
  accountType: "employer" | "freelancer";
};