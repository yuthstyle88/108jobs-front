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
  PublicOAuthProvider, MyUserInfo,
} from "lemmy-js-client";
import {
  EMPTY_REQUEST,
  HttpService,
  RequestState,
} from "@/lib/services/HttpService";
import {IsoData} from "@/interfaces";
import {toast} from "@/toast";
import {UserService} from "@/lib/services";
import {setIsoData} from "@/utils/app";

type LoginFormProps = {
  switchToRegister: () => void;
  switchToForgotPassword: () => void;
};

interface State {
  loginRes: RequestState<LoginResponse>;
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


async function handleLoginSuccess(i: LoginFormClass, loginRes: LoginResponse) {
  UserService.Instance.login({
    res: loginRes,
  });
  const site = await HttpService.client.getSite();

  if (site.state === "success") {
    try {
      const isoData = setIsoData(i.context);
      if (isoData && isoData.site_res) {
        isoData.site_res.oauth_providers = site.data.oauth_providers;
        isoData.site_res.admin_oauth_providers = site.data.admin_oauth_providers;
      }
    } catch (error) {
      console.error("Error updating isoData:", error);
    }
  }

  // ใช้ redirectUrl จาก props แทน prev
  const { redirectUrl } = i.props;

  // ใช้ router จาก props แทน history
  if (redirectUrl) {
    i.props.router.replace(redirectUrl);
  } else {
    i.props.router.replace("/");
  }
}

const withHooks = (Component: any) => {
  const WrappedWithHooks = (props: any) => {
    const authen = useTranslateFile(LanguageFile.AUTHEN);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("redirect") || "/";

    const loginSchema = z.object({
      username_or_email: z
        .string()
        .min(6, authen?.please_enter_email_or_username_min_6)
        .max(32, authen?.username_max_32),
      password: z.string().min(6, authen?.password_min_6),
    });

    const formMethods = useForm<z.infer<typeof loginSchema>>({
      resolver: zodResolver(loginSchema),
    });

    return (
      <Component
        {...props}
        authen={authen}
        router={router}
        redirectUrl={redirectUrl}
        formMethods={formMethods}
        loginSchema={loginSchema}
      />
    );
  };

  /* add explicit display name to satisfy react/display-name */
  WrappedWithHooks.displayName = `withHooks(${Component.displayName || Component.name || 'Component'})`;

  return WrappedWithHooks;
};

class LoginFormClass extends Component<LoginFormProps & {
  authen: any;
  router: any;
  redirectUrl: string;
  formMethods: any;
  loninSchema: any;
}> {
  private isoData: IsoData | null = null;
  private hasFetchedSite = false;

  state: State = {
    loginRes: EMPTY_REQUEST,
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

  constructor(props: any, context: any) {
    super(props, context);

    this.handleSubmitTotp = this.handleSubmitTotp.bind(this);
    this.handleLoginWithProvider = this.handleLoginWithProvider.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }


  async componentDidMount() {
    this.isoData = setIsoData(this.context);
    if (this.isoData?.site_res) {
      this.setState({
        siteRes: this.isoData.site_res,
        oauthProviders: this.isoData.site_res.oauth_providers ?? [],
        hasFetchedSite: true,
      });
      return;
    }
    if (this.hasFetchedSite || this.state.hasFetchedSite) return;

    this.hasFetchedSite = true;
    try {
      const site = await new LemmyHttp(`${process.env.NEXT_PUBLIC_API_BASE_URL_V3}`).getSite({});
      this.setState({
        siteRes: site,
        oauthProviders: site.oauth_providers ?? [],
        hasFetchedSite: true,
      });
    } catch (e) {
      console.error("fetch oauth providers failed", e);
    }
  }

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

  handleLoginSuccess = async (loginInRes: LoginResponse) => {
    sessionStorage.setItem("jwt", loginInRes.jwt || "");
  };
  handleLogin = async (data: any) => {
    try {
      const loginRes = await HttpService.client.login({
        username_or_email: data.username_or_email,
        password: data.password,
      });
      
      switch (loginRes.state) {
        case "failed": {
          this.props.formMethods.setError("password", {
            type: "manual",
            message: this.props.authen?.invalid_password ?? "รหัสผ่านไม่ถูกต้อง",
          });
          break;
        }
        case "success": {
          await handleLoginSuccess(this, loginRes.data);
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

  async handleSubmitTotp(totp: string) {
    const loginRes = await HttpService.client.login({
      password: this.state.form.password,
      username_or_email: this.state.form.username_or_email,
      totp_2fa_token: totp,
    });

    const successful = loginRes.state === "success";
    if (successful) {
      this.setState({ show2faModal: false });
      await this.handleLoginSuccess(loginRes.data);
    } else {
      toast("incorrect_totp_code");
    }

    return successful;
  }

  render() {
    const { switchToRegister, switchToForgotPassword, authen, formMethods } = this.props;
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
              onClick={switchToRegister}
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