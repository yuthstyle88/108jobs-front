"use client";
import LoadingCircle from "@/components/LoadingCircle";
import { CustomInput } from "@/components/ui/InputField";
import { ERROR_CONSTANTS } from "@/constants/error";
import { LanguageFile } from "@/constants/language";
import { useTranslateFile } from "@/hooks/translation/useTranslateFile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { HttpService } from "@/services";
import useNotification from "@/hooks/useNotification";

type ChangePasswordProps = {
  token: string;
};

export const ChangePassword = ({
  token,
}: ChangePasswordProps) => {


  const authen = useTranslateFile(LanguageFile.AUTHEN);
  const changePasswordSchema = z
  .object({
    password: z.string().min(6, authen?.passwordMin6),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: authen?.notMatchPassword,
    path: ["confirmPassword"],
  });
  type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
  });
  const { successMessage } = useNotification();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setApiError(null);
      const response = await HttpService.client.passwordChangeAfterReset({
        token: token,
        password: data.password,
        passwordVerify: data.confirmPassword,
      });

      // const result = await response.json();

      if (response.state === "failed") {
        setApiError(ERROR_CONSTANTS.CHANGE_PASSWORD_FAILED);
        return;
      }

      window.location.href = "/login";
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "มีข้อผิดพลาดในการเปลี่ยนรหัสผ่านของคุณ"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <p className="text-text-primary text-sm font-sans">
        Create a new password. Your password must be at least 8 characters long
        and contain a mix of letters and numbers.
      </p>
      {errors.root && (
        <p className="text-red-500 text-sm text-center mb-4">
          {errors.root.message}
        </p>
      )}

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
          {isSubmitting ? <LoadingCircle /> : authen?.confirmButton}
        </button>
      </div>
    </form>
  );
};
