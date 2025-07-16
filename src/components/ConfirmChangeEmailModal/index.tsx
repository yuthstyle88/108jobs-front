"use client";
import LoadingCircle from "@/components/LoadingCircle";
import Modal from "@/components/ui/Modal";
import { ProfileContactInfoLanguage } from "@/types/language";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

interface ConfirmChangeEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleConfirmChange: () => void;
  language: Partial<ProfileContactInfoLanguage> | undefined | null;
}


const ConfirmChangeEmailModal: React.FC<ConfirmChangeEmailModalProps> = ({
  isOpen,
  onClose,
  handleConfirmChange,
  language
}) => {
  const {
    reset,
    formState: {  isSubmitting },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
  });

  const handleCloseModal = () => {
    reset();
    onClose();
  };


  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      className="max-w-md p-0 w-full"
      closeOnOutsideClick={false}
    >
      <section className="px-[12px] w-full flex flex-col gap-8 justify-center items-center">
        <Mail className="w-[60px] h-[60px] text-third" />
        <article>
          <h1 className="text-base font-bold text-textPrimary text-center">
            {language?.emailChangeTitle}
          </h1>
          <p className="text-[14px] font-sans text-textSecondary text-center">
            {language?.emailChangeDescription}
          </p>
        </article>
      </section>
      <div className="flex flex-row gap-2 justify-end items-end pt-8 w-full">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="px-3 py-2 cursor-pointer w-fit text-textSecondary rounded-md font-semibold hover:bg-gray-200 transition duration-300 "
        >
          {isSubmitting ? <LoadingCircle /> : language?.cancelButton}
        </button>
        <button
          onClick={handleConfirmChange}
          disabled={isSubmitting}
          className="px-3 py-2 cursor-pointer w-fit bg-blue-600 text-white font-normal rounded-md shadow-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <LoadingCircle /> : language?.confirmButton}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmChangeEmailModal;
