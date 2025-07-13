"use client";
import LoadingCircle from "@/components/LoadingCircle";
import { CustomInput } from "@/components/ui/InputField";
import { ERROR_CONSTANTS } from "@/constants/error";
import { LanguageFile } from "@/constants/language";
import { useTranslateFile } from "@/hooks/translation/useTranslateFile";
import { RegisterDataProps } from "@/types/registerData";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CaptchaField } from "../CaptchaField";
import { usePublicFetchV2 } from "@/hooks/api-hooks";
import { CaptchaResponse } from "@/types/capcha";
import { API_ROUTES } from "@/api/endpoints";
import { RegisterFormData } from "@/types/formTypes/register";

type RegisterFormProps = {
  switchToVerifyEmail: () => void;
  setDataRegister: (data: RegisterDataProps) => void;
};

export const RegisterForm = ({
  switchToVerifyEmail,
  setDataRegister,
}: RegisterFormProps) => {
  const authen = useTranslateFile(LanguageFile.AUTHEN);
  const registerSchema = z
  .object({
    email: z.string().email(authen?.invalid_email),
    username: z.string().min(6, authen?.username_min_6),
    password: z.string().min(6, authen?.password_min_6),
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine((val) => val === true),
    privacyAccepted: z.boolean().refine((val) => val === true),
    promotionalAccepted: z.boolean().optional(),
    captcha_uuid: z.string().optional(),
    captcha_answer: z.string().min(1, authen?.require_captcha),
    accountType: z.enum(["employer", "freelancer"]).default("employer"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: authen?.not_match_password,
    path: ["confirmPassword"],
  });

  type RegisterFormDataType = z.infer<typeof registerSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { refetch } = usePublicFetchV2<CaptchaResponse>(
    API_ROUTES.auth.get_capcha
  );

  useEffect(() => {
    const storedData = sessionStorage.getItem("registerData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (parsedData.email) setValue("email", parsedData.email);
      if (parsedData.termsAccepted) setValue("termsAccepted", true);
      if (parsedData.privacyAccepted) setValue("privacyAccepted", true);
    }
  }, [setValue]);

  const onSubmit = async (data: RegisterFormDataType) => {
    try {
      setApiError(null);
      sessionStorage.setItem("registerData", JSON.stringify(data));

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
          password_verify: data.confirmPassword,
          captcha_uuid: data.captcha_uuid,
          captcha_answer: data.captcha_answer,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        if (result.fieldErrors?.email) {
          setError("email", {
            type: "manual",
            message: authen?.email_already_exists,
          });
        }
        if (result.fieldErrors?.username) {
          const code = result.fieldErrors.username;
          const message =
            code === "invalid_name"
              ? authen?.invalid_name
              : authen?.username_already_exists;
          console.log("message", message);
          setError("username", {
            type: "manual",
            message,
          });
        }
        if (result.fieldErrors?.captcha_answer) {
          setError("captcha_answer", {
            type: "manual",
            message: authen?.captcha_incorrect,
          });
        }

        if (
          result.error &&
          !result.fieldErrors?.email &&
          !result.fieldErrors?.username &&
          !result.fieldErrors?.captcha_answer
        ) {
          setApiError(ERROR_CONSTANTS.LIMIT_SEND_EMAIL);
        }
        refetch();
        setValue("captcha_answer", "");
        return;
      }
      refetch();
      switchToVerifyEmail();
      setDataRegister(data);
    } catch (error) {
      console.error("Registration error:", error);
      setApiError(
        error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการลงทะเบียน"
      );
      refetch();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <CustomInput
        label={authen?.label_username}
        name="username"
        register={register("username")}
        error={errors.username?.message}
        placeholder={authen?.placeholder_username}
        type="text"
      />
      <CustomInput
        label={authen?.label_email}
        name="email"
        register={register("email")}
        error={errors.email?.message}
        placeholder={authen?.placeholder_email}
        type="email"
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

      <CustomInput
        label={authen?.label_confirm_password}
        name="confirmPassword"
        type="password"
        register={register("confirmPassword")}
        error={errors.confirmPassword?.message}
        placeholder={authen?.placeholder_confirm_password}
        showPassword={showConfirmPassword}
        toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
      />
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {"Account Type"}
        </label>
        <div className="flex gap-6 items-center text-base text-text_primary">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="employer"
              {...register("accountType")}
              defaultChecked
            />
            {"Employer"}
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="freelancer"
              {...register("accountType")}
            />
            {"Freelancer"}
          </label>
        </div>
      </div>
      <CaptchaField
        setCaptchaUuid={(uuid) => setValue("captcha_uuid", uuid)}
        register={register}
        error={errors.captcha_answer?.message}
        language={authen}
      />
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="termsAccepted"
            {...register("termsAccepted")}
            className="w-[1.3em] h-[1.3em] flex-shrink-0 border-[0.0625em] border-neutral-500 rounded-xl bg-transparent cursor-pointer checked:border-primary checked:bg-primary "
          />
          <label
            htmlFor="termsAccepted"
            className="text-sm text-text_secondary font-sans"
          >
            {authen?.checkbox_terms_conditions}{" "}
            <Link
              prefetch={false}
              href="/content/terms"
              className="text-text_secondary underline"
            >
              {authen?.checkbox_terms_conditions_redirect}
            </Link>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="privacyAccepted"
            {...register("privacyAccepted")}
            className="w-[1.3em] h-[1.3em] flex-shrink-0 border-[0.0625em] border-neutral-500 rounded-xl bg-transparent cursor-pointer checked:border-primary checked:bg-primary "
          />
          <label
            htmlFor="privacyAccepted"
            className="text-sm text-text_secondary font-sans"
          >
            {authen?.checkbox_terms_conditions}{" "}
            <Link
              prefetch={false}
              href="/content/privacy"
              className="text-text_secondary underline"
            >
              {authen?.checkbox_privacy_policy_redirect}
            </Link>
          </label>
        </div>
      </div>

      {apiError && (
        <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
          {apiError}
        </div>
      )}

      <div className="text-center">
        <button
          type="submit"
          className="submit-button py-3"
          disabled={
            !!errors.confirmPassword ||
            !watch("termsAccepted") ||
            !watch("privacyAccepted")
          }
        >
          {isSubmitting ? <LoadingCircle /> : authen?.link_create_account}
        </button>
      </div>
    </form>
  );
};
