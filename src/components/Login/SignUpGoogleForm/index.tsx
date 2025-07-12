"use client";
import LoadingCircle from "@/components/LoadingCircle";
import { CustomInput } from "@/components/ui/InputField";
import { ERROR_CONSTANTS } from "@/constants/error";
import { LanguageFile } from "@/constants/language";
import { useTranslateFile } from "@/hooks/translation/useTranslateFile";
import { SignUpGoogleFormData } from "@/types/formTypes/signUpGoogle";
import { RegisterDataProps } from "@/types/registerData";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type RegisterFormProps = {
  switchToVerifyEmail: () => void;
  setDataRegister: (data: RegisterDataProps) => void;
};

export const SignUpGoogleForm = ({
  switchToVerifyEmail,
  setDataRegister,
}: RegisterFormProps) => {
  const authen = useTranslateFile(LanguageFile.AUTHEN);
  const registerSchema = z.object({
    email: z.string().email(authen?.invalid_email),
    name: z.string().min(6, "Username must be more than 6 characters"),
    termsAccepted: z.boolean().refine((val) => val === true),
    accountType: z.enum(["employer", "freelancer"]).default("employer"),
  });

  type RegisterFormDataType = z.infer<typeof registerSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
    watch,
  } = useForm<SignUpGoogleFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem("registerData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (parsedData.email) setValue("email", parsedData.email);
      if (parsedData.termsAccepted) setValue("termsAccepted", true);
    }
  }, [setValue]);

  const onSubmit = async (data: RegisterFormDataType) => {
    try {
      setApiError(null);
      sessionStorage.setItem("registerData", JSON.stringify(data));

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.name,
          email: data.email,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        if (result.fieldErrors?.email) {
          setError("email", {
            type: "manual",
            message: authen?.email_already_exists,
          });
        }
        if (result.fieldErrors?.username) {
          const code = result.fieldErrors.username;
          const message =
            code === "invalid_name"
              ? authen?.invalid_name
              : authen?.username_already_exists;
          setError("name", {
            type: "manual",
            message,
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
    <>
      <p className="text-center font-semibold text-[18px] text-text_primary mb-4">
        Please provide more details to sign up
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <CustomInput
          label={authen?.label_username}
          name="name"
          register={register("name")}
          error={errors.name?.message}
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

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {"Account Type"}
          </label>
          <div className="flex gap-6 items-center text-base text-text_primary">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="employer"
                {...register("accountType")}
                defaultChecked
              />
              {"Employer"}
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="freelancer"
                {...register("accountType")}
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
              className="text-sm text-text_secondary font-sans"
            >
              {authen?.checkbox_terms_conditions}{" "}
              <Link
                prefetch={false}
                href="/content/terms"
                className="text-text_secondary underline"
              >
                {authen?.checkbox_terms_conditions_redirect}
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
            disabled={!watch("termsAccepted")}
          >
            {isSubmitting ? <LoadingCircle /> : authen?.link_create_account}
          </button>
        </div>
      </form>
    </>
  );
};
