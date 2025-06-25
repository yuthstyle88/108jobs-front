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
const registerSchema = z
  .object({
    email: z.string().email("กรุณากรอกอีเมลให้ถูกต้อง"),
    username: z.string().min(3, "ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร"),
    password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
    confirmPassword: z.string(),
    phone: z
      .string()
      .optional()
      .refine((value) => !value || value.length >= 10, {
        message: "เบอร์โทรศัพท์ต้องมีอย่างน้อย 10 หลัก",
      }),
    termsAccepted: z.literal(true),
    privacyAccepted: z.literal(true),
    promotionalAccepted: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });

type RegisterFormProps = {
  switchToVerifyEmail: () => void;
  setDataRegister: (data: RegisterDataProps) => void;
};

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = ({
  switchToVerifyEmail,
  setDataRegister,
}: RegisterFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const authen = useTranslateFile(LanguageFile.AUTHEN);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem("registerData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (parsedData.email) setValue("email", parsedData.email);
      if (parsedData.phone) setValue("phone", parsedData.phone);
      if (parsedData.termsAccepted) setValue("termsAccepted", true);
      if (parsedData.privacyAccepted) setValue("privacyAccepted", true);
    }
  }, [setValue]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setApiError(null);

      sessionStorage.setItem("registerData", JSON.stringify(data));

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          username: data.username,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.fieldErrors?.email) {
          setError("email", {
            type: "manual",
            message: result.fieldErrors.email,
          });
        }
        if (result.fieldErrors?.username) {
          setError("username", {
            type: "manual",
            message: result.fieldErrors.username,
          });
        }

        if (
          result.error &&
          !result.fieldErrors?.email &&
          !result.fieldErrors?.username
        ) {
          setApiError(ERROR_CONSTANTS.LIMIT_SEND_EMAIL);
        }

        return;
      }

      switchToVerifyEmail();
      setDataRegister(data);
    } catch (error) {
      console.error("Registration error:", error);
      setApiError(
        error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการลงทะเบียน"
      );
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

      <CustomInput
        label={authen?.label_phone}
        name="phone"
        register={register("phone")}
        error={errors.phone?.message}
        placeholder={authen?.placeholder_phone}
        type="tel"
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
              href="/content/privacy"
              className="text-text_secondary underline"
            >
              {authen?.checkbox_privacy_policy_redirect}
            </Link>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="promotionalAccepted"
            {...register("promotionalAccepted")}
            className="w-[1.3em] h-[1.3em] flex-shrink-0 border-[0.0625em] border-neutral-500 rounded-xl bg-transparent cursor-pointer checked:border-primary checked:bg-primary "
          />
          <label
            htmlFor="promotionalAccepted"
            className="text-sm text-text_secondary font-sans"
          >
            {authen?.checkbox_email_promotion}
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
