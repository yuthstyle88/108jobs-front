"use client";
import LoadingCircle from "@/components/LoadingCircle";
import { CustomInput } from "@/components/ui/InputField";
import { LanguageFile } from "@/constants/language";
import { useTranslateFile } from "@/hooks/translation/useTranslateFile";
import { UpdateDataProps } from "@/types/update-term";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import {HttpService, UserService} from "@/services";

type AcceptFormProps = {
  switchToVerifyEmail: () => void;
  setDataUpdate: (data: UpdateDataProps) => void;
};

// AcceptFormSchema factory (must be outside component to avoid recreation)
const AcceptFormSchema = (authen: ReturnType<typeof useTranslateFile>) =>
  z
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

export const AcceptForm: React.FC<AcceptFormProps> = ({
  switchToVerifyEmail,
  setDataUpdate,
}) => {
  const authen = useTranslateFile(LanguageFile.AUTHEN);
  const { data: session } = useSession();

  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<z.infer<ReturnType<typeof AcceptFormSchema>>>({
    resolver: zodResolver(AcceptFormSchema(authen)),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: "Employer",
      termsAccepted: false,
      privacyAccepted: false,
    },
  });

  const formValues = watch();

  useEffect(() => {
    if (session?.user?.email) {
      setValue("email", session.user.email);
    }
  }, [session?.user?.email, setValue]);

  const onSubmit = async (data: z.infer<ReturnType<typeof AcceptFormSchema>>) => {

    setIsSubmitting(true);
    setApiError(null);

    try {
      sessionStorage.setItem("RegisterUpData", JSON.stringify(data));

      const response = await HttpService.client.updateTerm({
        email: data.email,
        password: data.password,
        passwordVerify: data.confirmPassword,
        role: data.role,
        termsAccepted: data.termsAccepted,
      });

      if (response.state === "success") {
        // switchToVerifyEmail();
        // setDataUpdate(...);
        UserService.Instance.login({
          res: response.data,
        });

        console.log("response:", response.data.jwt);
      }
    } catch (error: any) {
      if (error?.errors || error?.formErrors) {
        for (const err of error.errors ?? []) {
          setError(err.path[0], { message: err.message });
        }
      } else {
        setApiError(
          error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการลงทะเบียน"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <CustomInput
        label={authen?.labelEmail}
        {...register("email")}
        error={errors.email?.message}
        placeholder={authen?.placeholderEmail}
        readonly
        type="email"
      />

      <CustomInput
        label={authen?.labelPassword}
        {...register("password")}
        type={showPassword ? "text" : "password"}
        error={errors.password?.message}
        placeholder={authen?.placeholderPassword}
        showPassword={showPassword}
        toggleShowPassword={() => setShowPassword((prev) => !prev)}
      />

      <CustomInput
        label={authen?.labelConfirmPassword}
        {...register("confirmPassword")}
        type={showConfirmPassword ? "text" : "password"}
        error={errors.confirmPassword?.message}
        placeholder={authen?.placeholderConfirmPassword}
        showPassword={showConfirmPassword}
        toggleShowPassword={() => setShowConfirmPassword((prev) => !prev)}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Account Type
        </label>
        <div className="flex gap-6 items-center text-base text-text-primary">
          {["Employer", "Freelancer"].map((role) => (
            <label key={role} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value={role}
                {...register("role")}
                checked={formValues.role === role}
              />
              {role}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            {...register("termsAccepted")}
            className="w-[1.3em] h-[1.3em] flex-shrink-0 border-[0.0625em] border-neutral-500 rounded-xl bg-transparent cursor-pointer checked:border-primary checked:bg-primary"
          />
          <label className="text-sm text-text_secondary font-sans">
            {authen?.checkboxTermsConditions}{" "}
            <Link href="/content/terms" className="text-text_secondary underline">
              {authen?.checkboxTermsConditionsRedirect}
            </Link>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            {...register("privacyAccepted")}
            className="w-[1.3em] h-[1.3em] flex-shrink-0 border-[0.0625em] border-neutral-500 rounded-xl bg-transparent cursor-pointer checked:border-primary checked:bg-primary"
          />
          <label className="text-sm text-text_secondary font-sans">
            <Link href="/content/privacy" className="text-text_secondary underline">
              {authen?.checkboxPrivacyPolicyRedirect}
            </Link>
          </label>
        </div>
      </div>

      {apiError && (
        <div className="p-3 bg-red-100 text-red-700 rounded text-sm">{apiError}</div>
      )}

      <div className="text-center">
        <button
          type="submit"
          className="submit-button py-3"
          disabled={
            !!errors.confirmPassword ||
            !formValues.termsAccepted ||
            !formValues.privacyAccepted
          }
        >
          {isSubmitting ? <LoadingCircle /> : authen?.linkCreateAccount}
        </button>
      </div>
    </form>
  );
};
