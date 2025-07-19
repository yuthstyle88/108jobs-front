import React from "react";
import {RequestState} from "@/services/HttpService";
import {
  GetSiteResponse,
  LoginResponse,
  PublicOAuthProvider,
} from "../../../lib/lemmy-js-client";

export interface LoginFormProps {
  formState: {
    usernameOrEmail: string;
    password: string;
    totp2faToken?: string;
  };
  setFormState: React.Dispatch<
    React.SetStateAction<{
      usernameOrEmail: string;
      password: string;
      totp2faToken?: string;
    }>
  >;
  switchToRegister: () => void;
  switchToForgotPassword: () => void;
}


export interface State {
  loginRes: RequestState<LoginResponse>;
  form: {
    usernameOrEmail: string;
    password: string;
    totp2faToken?: string;
  };

  siteRes: GetSiteResponse | null;
  show2faModal: boolean;
  showOAuthModal: boolean;
  showPassword: boolean;
  oauthProviders: PublicOAuthProvider[];
  hasFetchedSite: boolean;
}

export interface LoginFormState {
  showPassword: boolean;
  oauthProviders: PublicOAuthProvider[];
  hasFetchedSite: boolean;
}