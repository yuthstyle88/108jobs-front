"use client";
import {HttpService, UserService,} from "@/services";
import React, {useCallback, useState} from "react";

import {CustomInput} from "@/components/ui/InputField";
import {Trans, useTranslation} from "react-i18next";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {REQUEST_STATE} from "@/services/HttpService";
import LoadingCircle from "@/components/LoadingCircle";
import {RegisterDataProps} from "@/types/register-data";

interface VerifyOTPProps {
  switchToVerifyEmail?: () => void;
  setApiError?: (err: string) => void;
  email?: RegisterDataProps;
}

const createOTPSchema = (t: any) => z
.object({
  code: z.string().min(5,t("authen.invalidOTP")),
});

export const VerifyOTPForm: React.FC<VerifyOTPProps> = ({
  setApiError,
  email,
}) => {
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
  const otpSchema = createOTPSchema(t);
  const formMethods = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    mode: "onChange",
    criteriaMode: "all",
  });
  const {
    register,
    handleSubmit,
    formState: {isValid, errors, isSubmitting}
  } = formMethods;
  const onSubmit = useCallback(async(data: any) => {

            const verifyRes = await HttpService.client.verifyEmail({
                code: data.code,
            });
            switch (verifyRes.state) {
                case REQUEST_STATE.FAILED: {
                    handleApiError(verifyRes.err.name);
                    break;
                }
                case REQUEST_STATE.SUCCESS: {
                    UserService.Instance.login({
                        res: verifyRes.data,
                    });
                }
                    break;
            }
        },
        []);
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {apiErrorState && (
                <p className="text-red-500 text-sm text-center mb-4">
                    {t("authen.apiErrorState")}
                </p>
            )}
            {errors.root && (
                <p className="text-red-500 text-sm text-center mb-4">
                    {errors.root.message}
                </p>
            )}
            <p className="text-text-primary text-sm">
                <Trans
                    i18nKey="authen.enterCodeWithEmail"
                    components={{ strong: <span className="text-blue-700 font-semibold break-all" /> }}
                    values={{ email }}
                />
            </p>
            <CustomInput
                label={t("authen.labelOTP")}
                type="string"
                name={"code"}
                placeholder={t("authen.placeholderOTP")}
                register={register("code")}
                error={errors.code?.message}
            />

      <div className="text-center">
        <button
          type="submit"
          className="submit-button py-3"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? <LoadingCircle/> : t("global.labelContinue")}
        </button>
      </div>
      <div className="text-center">
       <button
         type="button"
         onClick={ async() => {
           const emailString: string = email?.toString() || "";
           const verifyRes = await HttpService.client.resendVerificationEmail({
             email: emailString,
           });
           if (verifyRes.state === REQUEST_STATE.FAILED) {
             handleApiError(verifyRes.err.name);
           } else {
             handleApiError("please check your email for the verification code.");
           }
         }}
         className="text-text-primary text-sm font-sans"
       >
           {t("authen.resendEmail")}
       </button>
        {errors.root && (
          <p className="text-red-500 text-sm text-center mb-4">
            {errors.root.message}
          </p>
        )}
      </div>
    </form>
  );
};
