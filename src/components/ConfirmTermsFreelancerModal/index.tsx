"use client";
import Modal from "@/components/ui/Modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import TermsAndCondition from "./components/TermsAndCondition";
import LoadingCircle from "../LoadingCircle";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { LanguageFile } from "@/constants/language";
import Loading from "../Loading";
import Error from "@/app/error";
import { useEffect } from "react";

interface ConfirmTermsFreelancerModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleConfirmChange: () => void;
  isLoading?: boolean;
}

const signUpSchema = z.object({
  termsAccepted: z.literal(true),
  privacyAccepted: z.literal(true),
  promotionalAccepted: z.boolean().optional(),
});

const ConfirmTermsFreelancerModal: React.FC<
  ConfirmTermsFreelancerModalProps
> = ({ isOpen, onClose, handleConfirmChange, isLoading }) => {
  const {
    data: termLanguage,
    isLoading: isTermLoading,
    error,
  } = useGlobalTranslate(LanguageFile.TERMS_AND_CONDITIONS);

  const { watch, register, reset } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });

  useEffect(() => {
  if (!isOpen) {
    reset(); 
  }
}, [isOpen, reset]);

  if (isTermLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[520px] p-0 w-full"
      title="ยืนยันการลงทะเบียนเป็นฟรีแลนซ์"
      closeOnOutsideClick={false}
    >
      <section className="px-[12px] w-full flex flex-col gap-3 justify-center">
        <p className="text-sm text-textPrimary font-semibold">
          {termLanguage?.termsTitle}
        </p>
        <div className="border-1 border-borderPrimary p-3 rounded-lg text-[12px] list-decimal max-h-[280px] overflow-auto">
          <TermsAndCondition language={termLanguage} />
        </div>
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="termsAccepted"
              {...register("termsAccepted")}
              className="w-[1.3em] h-[1.3em] flex-shrink-0 border-[0.0625em] border-neutral-500 rounded-xl bg-transparent cursor-pointer checked:border-primary checked:bg-primary "
            />
            <label
              htmlFor="termsAccepted"
              className="text-[12px] text-textPrimary font-sans"
            >
              {termLanguage?.termsAcceptance}
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
              className="text-[12px] text-textPrimary font-sans"
            >
              {termLanguage?.privacyAcceptance}
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
              className="text-[12px] text-textPrimary font-sans"
            >
              {termLanguage?.marketingOptIn}
            </label>
          </div>
        </div>
      </section>
      <div className="flex flex-row gap-2 justify-end items-end pt-4 mt-4 w-full border-t-1 border-borderSecondary">
        <button
          onClick={handleConfirmChange}
          disabled={!watch("termsAccepted") || !watch("privacyAccepted")}
          className="px-3 py-2 cursor-pointer w-full bg-blue-600 text-white font-normal rounded-md shadow-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isLoading ? <LoadingCircle /> : termLanguage?.freelancerSignup}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmTermsFreelancerModal;
