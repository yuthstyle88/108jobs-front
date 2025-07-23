export type RegisterDataProps = {
  email: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  termsAccepted?: boolean;
  privacyAccepted?: boolean;
  phone?: string | undefined;
  promotionalAccepted?: boolean | undefined;
  token?: string;
  role?: string;
};


