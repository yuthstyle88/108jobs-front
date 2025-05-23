"use client";
import { ERROR_CONSTANTS } from "@/constants/error";
import useNotification from "@/hooks/useNotification";
import { ProfileBasicInfoLanguage } from "@/types/language";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import LoadingCircle from "../LoadingCircle";
import { CustomInput } from "../ui/InputField";
import Modal from "../ui/Modal";

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  languageData: Partial<ProfileBasicInfoLanguage> | undefined | null;
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  isOpen,
  onClose,
  languageData,
}) => {
  const schema = useMemo(() => {
    return z
      .object({
        old_password: z
          .string()
          .min(
            6,
            languageData?.password_min_length_error ||
              "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"
          ),
        new_password: z
          .string()
          .min(
            6,
            languageData?.password_min_length_error ||
              "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"
          ),
        confirmPassword: z.string(),
      })
      .refine((data) => data.new_password === data.confirmPassword, {
        message: languageData?.password_min_length_error || "รหัสผ่านไม่ตรงกัน",
        path: ["confirmPassword"],
      });
  }, [languageData]);

  type ChangePasswordFormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const { success_message } = useNotification();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleCloseModal = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setApiError(null);

      const response = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          old_password: data.old_password,
          new_password: data.new_password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.fieldErrors?.old_password) {
          setError("old_password", {
            type: "manual",
            message: result.fieldErrors.old_password,
          });
        }
        if (result.error && !result.fieldErrors?.old_password) {
          setApiError(ERROR_CONSTANTS.CHANGE_PASSWORD_FAILED);
        }
        return;
      }
      reset();
      onClose();
      success_message("profile", "change_password");
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "มีข้อผิดพลาดในการเปลี่ยนรหัสผ่านของคุณ"
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      title={languageData?.password}
      className="max-w-md w-full"
      closeOnOutsideClick={false}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <CustomInput
          label={languageData?.old_password}
          name="old_password"
          type="password"
          register={register("old_password")}
          error={errors.old_password?.message}
          placeholder={languageData?.password_placeholder}
          showPassword={showOldPassword}
          toggleShowPassword={() => setShowOldPassword(!showOldPassword)}
        />
        <CustomInput
          label={languageData?.new_password}
          name="new_password"
          type="password"
          register={register("new_password")}
          error={errors.new_password?.message}
          placeholder={languageData?.password_placeholder}
          showPassword={showNewPassword}
          toggleShowPassword={() => setShowNewPassword(!showNewPassword)}
        />

        <CustomInput
          label={languageData?.confirm_password_label}
          name="confirmPassword"
          type="password"
          register={register("confirmPassword")}
          error={errors.confirmPassword?.message}
          placeholder={languageData?.password_placeholder}
          showPassword={showConfirmPassword}
          toggleShowPassword={() =>
            setShowConfirmPassword(!showConfirmPassword)
          }
        />

        {apiError && (
          <div className="p-3 bg-red-100 text-red-700 rounded text-sm mt-4">
            {apiError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="submit-button py-2"
        >
          {isSubmitting ? <LoadingCircle /> : languageData?.submit_button}
        </button>
      </form>
    </Modal>
  );
};

export default PasswordChangeModal;
