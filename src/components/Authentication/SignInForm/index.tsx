"use client";
import LoadingCircle from "@/components/LoadingCircle";
import { CustomInput } from "@/components/ui/InputField";
import { LanguageFile } from "@/constants/language";
import { useTranslateFile } from "@/hooks/translation/useTranslateFile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Component } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  LemmyHttp,
  GetSiteResponse,
  LoginResponse,
  OAuthProvider,
  PublicOAuthProvider,
} from "lemmy-js-client";
import {
  EMPTY_REQUEST,
  HttpService,
  RequestState,
} from "@/lib/services/HttpService";
import {setIsoData} from "@/utils/app";
import {IsoData} from "@/interfaces";

type LoginFormProps = {
  switchToSingUp: () => void;
  switchToForgotPassword: () => void;
};

interface State {
  signInRes: RequestState<LoginResponse>;
  form: {
    username_or_email: string;
    password: string;
  };

  siteRes: GetSiteResponse | null;
  show2faModal: boolean;
  showOAuthModal: boolean;
  showPassword: boolean;
  oauthProviders: PublicOAuthProvider[];
  hasFetchedSite: boolean;
}

interface LoginFormState {
  showPassword: boolean;
  oauthProviders: PublicOAuthProvider[];
  hasFetchedSite: boolean;
}

const withHooks = (Component: any) => {
  return (props: any) => {
    const authen = useTranslateFile(LanguageFile.AUTHEN);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("redirect") || "/";
    
    const signInSchema = z.object({
      username_or_email: z
        .string()
        .min(6, authen?.please_enter_email_or_username_min_6)
        .max(32, authen?.username_max_32),
      password: z.string().min(6, authen?.password_min_6),
    });
    
    const formMethods = useForm<z.infer<typeof signInSchema>>({
      resolver: zodResolver(signInSchema),
    });

    return (
      <Component
        {...props}
        authen={authen}
        router={router}
        redirectUrl={redirectUrl}
        formMethods={formMethods}
        signInSchema={signInSchema}
      />
    );
  };
};

class LoginFormClass extends Component<LoginFormProps & {
  authen: any;
  router: any;
  redirectUrl: string;
  formMethods: any;
  signInSchema: any;
}> {
  private isoData: IsoData | null = null;

  state: State = {
    signInRes: EMPTY_REQUEST,
    form: {
      username_or_email: "",
      password: "",
    },
    siteRes:  null,
    show2faModal: false,
    showOAuthModal: false,
    showPassword: false,
    oauthProviders: [],
    hasFetchedSite: false
  };


  componentDidMount() {
    try {
      this.isoData = setIsoData(this.context);
      if (this.isoData?.site_res) {
        this.setState({
          siteRes: this.isoData.site_res,
          oauthProviders: this.isoData.site_res.oauth_providers || [],
          hasFetchedSite: true
        });
      } else {
        this.fetchOAuthProviders();
      }
    } catch (error) {
      console.error("Error initializing isoData:", error);
      this.fetchOAuthProviders();
    }
  }

  fetchOAuthProviders = async () => {
    if (this.state.hasFetchedSite) return;
    
    try {
      const lemmy = new LemmyHttp(
        process.env.NEXT_PUBLIC_API_BASE_URL_V3 ?? "http://localhost:1234"
      );
      const site = await lemmy.getSite({}) as GetSiteResponse;
      this.setState({
        oauthProviders: site.oauth_providers ?? [],
        siteRes: site,
        hasFetchedSite: true
      });
    } catch (err) {
      console.error("Failed to load OAuth providers", err);
    }
  };

  toggleShowPassword = () => {
    this.setState((prevState: LoginFormState) => ({
      showPassword: !prevState.showPassword
    }));
  };

  handleLoginWithProvider = (provider: OAuthProvider) => {
    this.handleUseOAuthProvider({
      oauth_provider: provider,
      prev: this.props.redirectUrl,
    });
  };

  handleUseOAuthProvider = async (params: {
    oauth_provider: OAuthProvider;
    username?: string;
    prev?: string;
    answer?: string;
    show_nsfw?: boolean;
  }) => {
    const redirectUri = `${window.location.origin}/api/auth/callback/${params.oauth_provider.display_name}`;
    const state = crypto.randomUUID();
    const requestUri =
      params.oauth_provider.authorization_endpoint +
      "?" +
      [
        `client_id=${encodeURIComponent(params.oauth_provider.client_id)}`,
        `response_type=code`,
        `scope=${encodeURIComponent(params.oauth_provider.scopes)}`,
        `redirect_uri=${encodeURIComponent(redirectUri)}`,
        `state=${state}`,
      ].join("&");
    console.log(requestUri);
    
    localStorage.setItem(
      "jwt",
      JSON.stringify({
        state,
        oauth_provider_id: params.oauth_provider.id,
        redirect_uri: redirectUri,
        prev: params.prev ?? "/",
        username: params.username,
        answer: params.answer,
        show_nsfw: params.show_nsfw,
        expires_at: Date.now() + 5 * 60_000,
      }),
    );

    window.location.assign(requestUri);
  };

  handleLoginSuccess = async (signInRes: LoginResponse) => {
    sessionStorage.setItem("jwt", signInRes.jwt || "");
  };

  handleLogin = async (data: any) => {
    try {
      const signInRes = await HttpService.client.signIn({
        username_or_email: data.username_or_email,
        password: data.password,
      });
      
      switch (signInRes.state) {
        case "failed": {
          this.props.formMethods.setError("password", {
            type: "manual",
            message: this.props.authen?.invalid_password ?? "รหัสผ่านไม่ถูกต้อง",
          });
          break;
        }
        case "success": {
          await this.handleLoginSuccess(signInRes.data);
          break;
        }
      }
    } catch (error) {
      console.error(error);
      this.props.formMethods.setError("root", {
        type: "manual",
        message: this.props.authen?.system_error ?? "เกิดข้อผิดพลาดของระบบ กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  render() {
    const { switchToSingUp, switchToForgotPassword, authen, formMethods } = this.props;
    const { showPassword, oauthProviders } = this.state;
    const { register, handleSubmit, formState: { errors, isSubmitting } } = formMethods;

    return (
      <form onSubmit={handleSubmit(this.handleLogin)} className="space-y-5">
        {errors.root && (
          <p className="text-red-500 text-sm text-center mb-4">
            {errors.root.message}
          </p>
        )}

        <CustomInput
          label={authen?.label_username_or_email}
          name="username_or_email"
          register={register("username_or_email")}
          error={errors.username_or_email?.message}
          placeholder={authen?.placeholder_username_or_email}
        />

        <CustomInput
          label={authen?.label_password}
          name="password"
          type="password"
          register={register("password")}
          error={errors.password?.message}
          placeholder={authen?.placeholder_password}
          showPassword={showPassword}
          toggleShowPassword={this.toggleShowPassword}
        />

        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-button py-2"
          >
            {isSubmitting ? <LoadingCircle /> : authen?.button_proceed}
          </button>

          <div className="flex justify-between text-sm text-blue-600 mt-4">
            <button
              type="button"
              onClick={switchToSingUp}
              className="hover:underline"
            >
              {authen?.link_create_account}
            </button>
            <button
              type="button"
              onClick={switchToForgotPassword}
              className="hover:underline"
            >
              {authen?.link_forgot_password}
            </button>
          </div>
        </div>

        {oauthProviders.length > 0 && (
          <>
            <hr className="my-6" />
            <p className="text-center text-sm text-gray-600 mb-3">
              {authen?.label_or_sign_in_with ?? "หรือเข้าสู่ระบบด้วย"}
            </p>
            <div className="flex flex-col gap-3">
              {oauthProviders.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => this.handleLoginWithProvider(p)}
                  className="oauth-button py-2 px-4 border rounded-md flex justify-center items-center hover:bg-gray-100"
                >
                  {p.display_name}
                </button>
              ))}
            </div>
          </>
        )}
      </form>
    );
  }
}

export const LoginForm = withHooks(LoginFormClass);