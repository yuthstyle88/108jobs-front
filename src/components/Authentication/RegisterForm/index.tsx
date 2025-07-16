"use client";
import LoadingCircle from "@/components/LoadingCircle";
import { CustomInput } from "@/components/ui/InputField";
import { ERROR_CONSTANTS } from "@/constants/error";
import { LanguageFile } from "@/constants/language";
import { useTranslateFile } from "@/hooks/translation/useTranslateFile";
import { RegisterDataProps } from "@/types/register-data";
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
  const RegisterSchema = z
    .object({
      email: z.string().email(authen?.invalidEmail),
      username: z.string().min(6, authen?.usernameMin6),
      password: z.string().min(6, authen?.passwordMin6),
      confirmPassword: z.string(),
      termsAccepted: z.boolean().refine((val) => val === true),
      privacyAccepted: z.boolean().refine((val) => val === true),
      promotionalAccepted: z.boolean().optional(),
      captchaUuid: z.string().optional(),
      captchaAnswer: z.string().min(1, authen?.requireCaptcha),
      role: z.enum(["Employer", "Freelancer"]).default("Employer"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: authen?.notMatchPassword,
      path: ["confirmPassword"],
    });

  type RegisterFormDataType = z.infer<typeof RegisterSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { refetch } = usePublicFetchV2<CaptchaResponse>(
    API_ROUTES.auth.getCapcha
  );

  useEffect(() => {
    const storedData = sessionStorage.getItem("RegisterData");
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
      sessionStorage.setItem("RegisterUpData", JSON.stringify(data));

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
          passwordVerify: data.confirmPassword,
          captchaUuid: data.captchaUuid,
          captchaAnswer: data.captchaAnswer,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        if (result.fieldErrors?.email) {
          setError("email", {
            type: "manual",
            message: authen?.emailAlreadyExists,
          });
        }
        if (result.fieldErrors?.username) {
          const code = result.fieldErrors.username;
          const message =
            code === "invalidName"
              ? authen?.invalidName
              : authen?.usernameAlreadyExists;
          console.log("message", message);
          setError("username", {
            type: "manual",
            message,
          });
        }
        if (result.fieldErrors?.captchaAnswer) {
          setError("captchaAnswer", {
            type: "manual",
            message: authen?.captchaIncorrect,
          });
        }

        if (
          result.error &&
          !result.fieldErrors?.email &&
          !result.fieldErrors?.username &&
          !result.fieldErrors?.captchaAnswer
        ) {
          setApiError(ERROR_CONSTANTS.LIMIT_SEND_EMAIL);
        }
        refetch();
        setValue("captchaAnswer", "");
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
        label={authen?.labelUsername}
        name="username"
        register={register("username")}
        error={errors.username?.message}
        placeholder={authen?.placeholderUsername}
        type="text"
      />
      <CustomInput
        label={authen?.labelEmail}
        name="email"
        register={register("email")}
        error={errors.email?.message}
        placeholder={authen?.placeholderEmail}
        type="email"
      />

      <CustomInput
        label={authen?.labelPassword}
        name="password"
        type="password"
        register={register("password")}
        error={errors.password?.message}
        placeholder={authen?.placeholderPassword}
        showPassword={showPassword}
        toggleShowPassword={() => setShowPassword(!showPassword)}
      />

      <CustomInput
        label={authen?.labelConfirmPassword}
        name="confirmPassword"
        type="password"
        register={register("confirmPassword")}
        error={errors.confirmPassword?.message}
        placeholder={authen?.placeholderConfirmPassword}
        showPassword={showConfirmPassword}
        toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
      />
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {"Account Type"}
        </label>
        <div className="flex gap-6 items-center text-base text-textPrimary">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="Employer"
              {...register("role")}
              defaultChecked
            />
            {"Employer"}
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="Freelancer"
              {...register("role")}
            />
            {"Freelancer"}
          </label>
        </div>
      </div>
      <CaptchaField
        setCaptchaUuid={(uuid) => setValue("captchaUuid", uuid)}
        register={register}
        error={errors.captchaAnswer?.message}
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
            className="text-sm text-textSecondary font-sans"
          >
            {authen?.checkboxTermsConditions}{" "}
            <Link
              prefetch={false}
              href="/content/terms"
              className="text-textSecondary underline"
            >
              {authen?.checkboxTermsConditionsRedirect}
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
            className="text-sm text-textSecondary font-sans"
          >
            {authen?.checkboxTermsConditions}{" "}
            <Link
              prefetch={false}
              href="/content/privacy"
              className="text-textSecondary underline"
            >
              {authen?.checkboxPrivacyPolicyRedirect}
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
          {isSubmitting ? <LoadingCircle /> : authen?.linkCreateAccount}
        </button>
      </div>
      <div className="flex flex-col gap-3 mt-6">
        <div className="text-center text-sm text-gray-500">หรือสมัครด้วยบัญชีโซเชียล</div>
      </div>
    </form>
  );
};
