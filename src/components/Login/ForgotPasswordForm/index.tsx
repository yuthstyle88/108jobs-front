"use client";
import LoadingCircle from "@/components/LoadingCircle";
import { CustomInput } from "@/components/ui/InputField";
import { ERROR_CONSTANTS } from "@/constants/error";
import { useLanguageStore } from "@/store/useLanguageStore";
import { RegisterDataProps } from "@/types/registerData";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "กรุณากรอกอีเมลหรือเบอร์โทรศัพท์"),
});

type VerifyForgotPasswordProps = {
  switchToVerifyForgotPassword: () => void;
  setForgotEmail: (data: RegisterDataProps) => void;
};

type VerifyForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordForm = ({
  switchToVerifyForgotPassword,
  setForgotEmail,
}: VerifyForgotPasswordProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const { loginLanguageData } = useLanguageStore();

  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: VerifyForgotPasswordFormData) => {
    try {
      setApiError(null);

      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error) {
          setApiError(ERROR_CONSTANTS.EMAIL_NOT_EXIST);
        }

        return;
      }
      setForgotEmail(data);
      switchToVerifyForgotPassword();
    } catch (error) {
      console.error("Registration error:", error);
      setApiError(
        error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการลงทะเบียน"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="text-sm text-gray-600 mb-6">
        {loginLanguageData?.verification_message}
      </div>

      <CustomInput
        label={loginLanguageData?.label_contact_email_phone}
        name="email"
        register={register("email")}
        error={errors.email?.message}
        placeholder={loginLanguageData?.placeholder_email_phone}
      />

      {apiError && (
        <div className="p-3 bg-red-100 text-red-700 rounded text-sm mt-4">
          {apiError}
        </div>
      )}

      <div className="text-center">
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <LoadingCircle />
          ) : (
            loginLanguageData?.send_code_button
          )}
        </button>
      </div>
    </form>
  );
};
