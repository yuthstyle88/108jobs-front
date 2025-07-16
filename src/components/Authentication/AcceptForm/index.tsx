"use client";
import LoadingCircle from "@/components/LoadingCircle";
import { CustomInput } from "@/components/ui/InputField";
import { LanguageFile } from "@/constants/language";
import { useTranslateFile } from "@/hooks/translation/useTranslateFile";
import { UpdateDataProps } from "@/types/update-term";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RegisterOAuthFormData } from "@/types/formTypes/RegisterOAuth";
import { useSession } from "next-auth/react";
import {axiosPrivate} from "@/lib/axios"; // เพิ่ม import นี้

type UpdateFormProps = {
  switchToVerifyEmail: () => void;
  setDataUpdate: (data: UpdateDataProps) => void;
};

export const AcceptForm = ({
  switchToVerifyEmail,
  setDataUpdate,
}: UpdateFormProps) => {
  const authen = useTranslateFile(LanguageFile.AUTHEN);

  const UpdateSchema = z
  .object({
    email: z.string().email(authen?.invalidEmail),
    password: z.string().min(6, authen?.passwordMin6),
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine((val) => val === true),
    privacyAccepted: z.boolean().refine((val) => val === true),
    promotionalAccepted: z.boolean().optional(),
    role: z.enum(["Employer", "Freelancer"]).default("Employer"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: authen?.notMatchPassword,
    path: ["confirmPassword"],
  });

  type UpdateFormDataType = z.infer<typeof UpdateSchema>;
  const resolver = zodResolver(UpdateSchema);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<RegisterOAuthFormData>({
     resolver,
    mode: "onChange",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { data: session } = useSession();
  useEffect(() => {
    if (session) {
      try {

        if (session?.user?.email) {
          setValue("email", session?.user?.email);
        }
      } catch (error) {
        console.error("Error decoding JWT:", error);
      }
    }
  }, [setValue]);


  const onSubmit = async (data: UpdateFormDataType) => {
    try {
      setApiError(null);
      sessionStorage.setItem("RegisterUpData", JSON.stringify(data));

      const response = await axiosPrivate.post("/account/auth/update_term", {
          email: data.email,
          password: data.password,
          passwordVerify: data.confirmPassword,
          role: data.role,
          termsAccepted: data.termsAccepted
      });
      if (response.status === 200) {
        console.error("response:", response.data);
      }
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
        label={authen?.labelEmail}
        name="email"
        register={register("email")}
        error={errors.email?.message}
        placeholder={authen?.placeholderEmail}
        readonly
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
    </form>
  );
};
