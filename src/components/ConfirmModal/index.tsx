"use client";
import { ERROR_CONSTANTS } from "@/constants/error";
import useNotification from "@/hooks/useNotification";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import LoadingCircle from "../LoadingCircle";
import { CustomInput } from "../ui/InputField";
import Modal from "../ui/Modal";

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
    newPassword: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
  });

  const { successMessage } = useNotification();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleCloseModal = ()=>{
    reset();
    onClose();
  }

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setApiError(null);

      const response = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.fieldErrors?.oldPassword) {
          setError("oldPassword", {
            type: "manual",
            message: result.fieldErrors.oldPassword,
          });
        }
        if (result.error && !result.fieldErrors?.oldPassword) {
          setApiError(ERROR_CONSTANTS.CHANGE_PASSWORD_FAILED);
        }
        return;
      }
      reset();
      onClose();
      successMessage("profile", "changePassword");
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
      title="รหัสผ่าน"
      className="max-w-md w-full"
      closeOnOutsideClick={false}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <CustomInput
          label="รหัสผ่าน"
          name="oldPassword"
          type="password"
          register={register("oldPassword")}
          error={errors.oldPassword?.message}
          placeholder="ระบุรหัสผ่าน"
          showPassword={showOldPassword}
          toggleShowPassword={() => setShowOldPassword(!showOldPassword)}
        />
        <CustomInput
          label="รหัสผ่าน"
          name="newPassword"
          type="password"
          register={register("newPassword")}
          error={errors.newPassword?.message}
          placeholder="ระบุรหัสผ่าน"
          showPassword={showNewPassword}
          toggleShowPassword={() => setShowNewPassword(!showNewPassword)}
        />

        <CustomInput
          label="ยืนยันรหัสผ่าน"
          name="confirmPassword"
          type="password"
          register={register("confirmPassword")}
          error={errors.confirmPassword?.message}
          placeholder="ยืนยันรหัสผ่าน"
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
          {isSubmitting ? <LoadingCircle /> : "ยืนยัน"}
        </button>
      </form>
    </Modal>
  );
};

export default ConfirmModal;
