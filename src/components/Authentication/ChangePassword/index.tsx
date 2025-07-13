"use client";
import LoadingCircle from "@/components/LoadingCircle";
import { CustomInput } from "@/components/ui/InputField";
import { ERROR_CONSTANTS } from "@/constants/error";
import { LanguageFile } from "@/constants/language";
import { useTranslateFile } from "@/hooks/translation/useTranslateFile";
import { RegisterDataProps } from "@/types/registerData";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const changePasswordSchema = z
  .object({
    password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });

type ChangePasswordProps = {
  tokenPassword?: RegisterDataProps;
  switchToRegister: () => void;
  switchToForgotPassword: () => void;
};

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export const ChangePassword = ({
  tokenPassword,
}: ChangePasswordProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
  });

  const authen = useTranslateFile(LanguageFile.AUTHEN);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setApiError(null);

      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: tokenPassword,
          password: data.password,
          password_verify: data.confirmPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error) {
          setApiError(ERROR_CONSTANTS.CHANGE_PASSWORD_FAILED);
        }

        return;
      }

      if (result.success === true) {
        const loginResponse = await fetch("/api/auth/token-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: tokenPassword }),
        });

        if (loginResponse.ok) {
          window.location.href = "/";
        } else {
          setApiError("Đăng nhập tự động thất bại");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      setApiError(
        error instanceof Error ? error.message : "มีข้อผิดพลาดในการเปลี่ยนรหัสผ่านของคุณ"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <p className="text-text_primary text-sm font-sans">
        Create a new password. Your password must be at least 8 characters long
        and contain a mix of letters and numbers.
      </p>
      {errors.root && (
        <p className="text-red-500 text-sm text-center mb-4">
          {errors.root.message}
        </p>
      )}

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

      {apiError && (
        <div className="p-3 bg-red-100 text-red-700 rounded text-sm mt-4">
          {apiError}
        </div>
      )}

      <div className="text-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="submit-button py-3"
        >
          {isSubmitting ? <LoadingCircle /> : authen?.confirm_button}
        </button>
      </div>
    </form>
  );
};
