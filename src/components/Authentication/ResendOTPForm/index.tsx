"use client";
import LoadingCircle from "@/components/LoadingCircle";
import {CustomInput} from "@/components/ui/InputField";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {useCallback, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {HttpService, REQUEST_STATE,} from "@/services/HttpService";
import {useTranslation} from "react-i18next";
import {OAuthButtons} from "@/components/Authentication/LoginForm/oauth-provider";
import {useIsoData} from "@/hooks/profile-api/useIsoData";
import {OAuthProvider} from "@/lib/lemmy-js-client/src";
import {handleUseOAuthProvider} from "@/components/Authentication/LoginForm/handlers";
import {useSearchParams} from "next/navigation";
import {UserService} from "@/services";

// Form schema definition
const createOTPSchema = (t: any) => z
.object({
  email: z.string().email(t("authen.invalidEmail")),
});

interface OTPFormProps {
  switchToVerifyOTP?: () => void;
  setApiError?: (err: string) => void;
  email?: string;
}

export const ResendOTPForm: React.FC<OTPFormProps> = ({
  switchToVerifyOTP,
  setApiError,
  email
}) => {
  const searchParams = useSearchParams();
  // Hooks
  const {t} = useTranslation();
  // State
  const [apiErrorState, setApiErrorState] = useState<string | null>(null);

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
  const registerSchema = createOTPSchema(t);
  const formMethods = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    criteriaMode: "all",
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: {isValid, errors, isSubmitting}
  } = formMethods;
  useEffect(() => {
      if (email) {
        try {
          if (email) {
            setValue("email",
              email);
          }
        } catch (error) {
          console.error("Error",
            error);
        }
      }
    },
    [email, setValue]);

  const onSubmit = useCallback(async(data: any) => {
      const registerRes = await HttpService.client.register({
        email: data.email,
        answer: "FastJob"
      });
      switch (registerRes.state) {
        case REQUEST_STATE.FAILED: {
          handleApiError(t(`authen.${registerRes.err.name}`));
          break;
        }
        case REQUEST_STATE.SUCCESS: {
          if (registerRes.data.verifyEmailSent){
            if (switchToVerifyOTP) {
              switchToVerifyOTP();
            }
          }
        }
        break;
      }
    },
    [switchToVerifyOTP]);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
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
          disabled={isSubmitting}
        >
          {isSubmitting ? <LoadingCircle/> : t("authen.resendVerifyCode")}
        </button>
      </div>

    </form>
  );
};