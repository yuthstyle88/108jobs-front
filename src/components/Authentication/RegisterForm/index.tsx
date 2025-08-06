"use client";
import LoadingCircle from "@/components/LoadingCircle";
import {CustomInput} from "@/components/ui/InputField";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {useCallback, useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {HttpService, REQUEST_STATE,} from "@/services/HttpService";
import {useTranslation} from "react-i18next";
import {OAuthButtons} from "@/components/Authentication/LoginForm/oauth-provider";
import {useIsoData} from "@/hooks/profile-api/useIsoData";
import {OAuthProvider} from "@/lib/lemmy-js-client/src";
import {handleUseOAuthProvider} from "@/components/Authentication/LoginForm/handlers";
import {useSearchParams} from "next/navigation";

// Form schema definition
const createRegisterSchema = (t: any) => z
.object({
  email: z.string().email(t("authen.invalidEmail")),
});

interface RegisterFormProps {
  switchToVerifyOTP?: (email: string) => void;
  setApiError?: (err: string) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  switchToVerifyOTP,
  setApiError
}) => {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  // Hooks
  const {t} = useTranslation();
  // State
  const [apiErrorState, setApiErrorState] = useState<string | null>(null);
  const {site, oauthProviders} = useIsoData();
  // Use the provided setApiError function if available, otherwise use the local state setter
  const handleApiError = useCallback((err: string) => {
      if (setApiError) {
        setApiError(err);
      } else {
        setApiErrorState(err);
      }
    },
    [setApiError]);

  // Form setup
  const registerSchema = createRegisterSchema(t);
  const formMethods = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    criteriaMode: "all",
  });

  const {
    register,
    handleSubmit,
    formState: {isValid, errors, isSubmitting}
  } = formMethods;

  const handleLoginWithProvider = (provider: OAuthProvider) => {
    handleUseOAuthProvider({
      oauthProvider: provider,
      prev: redirectUrl,
    });
  };
  const onSubmit = useCallback(async(data: any) => {

      const registerRes = await HttpService.client.register({
        email: data.email,
        answer: "FastJob",
      });
      switch (registerRes.state) {
        case REQUEST_STATE.FAILED: {
          handleApiError(t(`authen.${registerRes.err.name}`));
          break;
        }
        case REQUEST_STATE.SUCCESS: {
          if (registerRes.data.verifyEmailSent){
            if (switchToVerifyOTP) {
              switchToVerifyOTP(data.email);
            }
          }
        }
        break;
      }
    },
    [switchToVerifyOTP]);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {apiErrorState && (
        <p className="text-red-500 text-sm text-center mb-4">
          {t("authen.apiErrorState")}
        </p>
      )}
      {errors.root && (
        <p className="text-red-500 text-sm text-center mb-4">
          {errors.root.message}sss
        </p>
      )}
      <CustomInput
        label={t("authen.labelEmail")}
        type="email"
        name={"email"}
        placeholder={t("authen.placeholderEmail")}
        register={register("email")}
        error={errors.email?.message}
      />

      {apiErrorState && (
        <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
          {apiErrorState}
        </div>
      )}

      <div className="text-center">
        <button
          type="submit"
          className="submit-button py-3"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? <LoadingCircle/> : t("authen.linkCreateAccount")}
        </button>
      </div>

      <div className="flex flex-col gap-3 mt-6">
        <OAuthButtons providers={oauthProviders} onLogin={handleLoginWithProvider} label={t("authen.labelOrSignInWith")}/>
      </div>
    </form>
  );
};