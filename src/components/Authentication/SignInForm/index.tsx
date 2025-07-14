"use client";
import LoadingCircle from "@/components/LoadingCircle";
import { CustomInput } from "@/components/ui/InputField";
import { LanguageFile } from "@/constants/language";
import { useTranslateFile } from "@/hooks/translation/useTranslateFile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
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
  HttpService,
  RequestState,
} from "@/lib/services/HttpService";
type LoginFormProps = {
  switchToRegister: () => void;
  switchToForgotPassword: () => void;
};

interface State {
  signInRes: RequestState<LoginResponse>;
  form: {
    username_or_email: string;
    password: string;
  };
  siteRes: GetSiteResponse;
  show2faModal: boolean;
  showOAuthModal: boolean;
}


export const LoginForm = ({
  switchToRegister,
  switchToForgotPassword,
}: LoginFormProps) => {
  // Lemmy client – base URL configurable via env

  const authen = useTranslateFile(LanguageFile.AUTHEN);

  const signInSchema = z.object({
    username_or_email: z
      .string()
      .min(6, authen?.please_enter_email_or_username_min_6)
      .max(32, authen?.username_max_32),
    password: z.string().min(6, authen?.password_min_6),
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  // OAuth providers returned by the Lemmy backend
  const [oauthProviders, setOauthProviders] = useState<PublicOAuthProvider[]>([]);

  // Fetch provider list once on mount
  useEffect(() => {
    console.log("LoginForm mounted");               // 1. mount log
    (async () => {
      try {
        console.log("fetching providers");           // 2. pre-fetch log
        const lemmy = new LemmyHttp(
          process.env.NEXT_PUBLIC_API_BASE_URL_V3 ??
          "http://localhost:1234"
        );
        const site = await lemmy.getSite({});
        console.log("site", site);                   // 3. response log
        setOauthProviders(site.oauth_providers ?? []);
      } catch (err) {
        console.error("Failed to load OAuth providers", err);
      }
    })();
  }, []);

  const route = useRouter();

  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  /**
   * Redirect the user to the selected OAuth provider’s authorization endpoint.
   * Keeps the current redirectUrl so we can come back after the flow finishes.
   */
  const handleLoginWithProvider = (provider: OAuthProvider) => {
    handleUseOAuthProvider({
      oauth_provider: provider,
      prev: redirectUrl,
    });
  };

  async function handleUseOAuthProvider(params: {
    oauth_provider: OAuthProvider;
    username?: string;
    prev?: string;
    answer?: string;
    show_nsfw?: boolean;
  }) {
    const redirectUri = `${window.location.origin}/api/auth/callback/google`;
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
    // store state in local storage
    localStorage.setItem(
      "oauth_state",
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
  }
  async function handleLoginSuccess(signInRes: LoginResponse) {
    sessionStorage.setItem("jwt", signInRes.jwt || "");
  }

  const handleLogin = async (data: z.infer<typeof signInSchema>) => {
    try {
      const signInRes = await HttpService.client.signIn({
        username_or_email: data.username_or_email,
        password: data.password,
      });
      switch (signInRes.state) {
        case "failed": {
          setError("password",
            {
              type: "manual",
              message: authen?.invalid_password ?? "รหัสผ่านไม่ถูกต้อง",
            });
          break;
        }
        case "success": {
          await handleLoginSuccess(signInRes.data);
          break;
        }
      }

    } catch (error) {
      console.error(error);
      setError("root", {
        type: "manual",
        message: authen?.system_error ?? "เกิดข้อผิดพลาดของระบบ กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
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
        toggleShowPassword={() => setShowPassword(!showPassword)}
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
                onClick={() => handleLoginWithProvider(p)}
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
};
