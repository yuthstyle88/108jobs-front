"use client";
import LoadingCircle from "@/components/LoadingCircle";
import { CustomInput } from "@/components/ui/InputField";
import { LanguageFile } from "@/constants/language";
import { useTranslateFile } from "@/hooks/translation/useTranslateFile";
import { RegisterDataProps } from "@/types/registerData";
import { zodResolver } from "@hookform/resolvers/zod";
import {signIn, useSession} from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { axiosPublicV2 } from "@/lib/axios";
import {error} from "next/dist/build/output/log";
import {exchange} from "@/lib/api/auth";
import {parseJwt} from "@/auth";

type RegisterFormProps = {
  switchToVerifyEmail: () => void;
  setDataRegister: (data: RegisterDataProps) => void;
};

export const SignUpGoogleForm = ({
  switchToVerifyEmail,
  setDataRegister,
}: RegisterFormProps) => {
  const authen = useTranslateFile(LanguageFile.AUTHEN);
  const [apiError, setApiError] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const registerSchema = z.object({
    name: z.string().min(6, authen?.label_username),
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
  } = useForm<RegisterFormDataType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      termsAccepted: false,
      accountType: "employer",
    },
  });

  // 🔹 เติมค่า email และ name จาก session ที่ได้จาก Google
  useEffect(() => {
    if (session?.user) {
      setValue("name", session.user.name ?? "");
    }
  }, [session, setValue]);

  const onSubmit = async (data: RegisterFormDataType) => {
    try {
      setApiError(null);
      const redirectUrl = searchParams.get("redirect") || "/";
      const email = session?.user?.email;

      if (!email) {
        setApiError("Session an expire");
        return;
      }

      // 🔹 Step 1: Register กับระบบของคุณเอง
      const res = await axiosPublicV2.post("/oauth/register_with_oauth", {
        oauth_provider: "google",
        provider_account_id: session?.user?.id,
        name: data.name,
        email,
        roles: data.accountType,
        self_promotion: undefined,
        answer: undefined,
      });

      const result = res.data;

      const token = result?.jwt;
      if (token) {
          await signIn("credentials", {
          redirect: false,
          username_or_email:  "dummy_email",
          password: "dummy_password",
          token,
          callbackUrl: redirectUrl,
        });
      }

    } catch (error) {
      console.error("Registration error:", error);
      setApiError("เกิดข้อผิดพลาดในการลงทะเบียน");
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
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
          <div className="flex gap-6 items-center text-base text-text_primary">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="employer" {...register("accountType")} defaultChecked />
              Employer
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="freelancer" {...register("accountType")} />
              Freelancer
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
            <label htmlFor="termsAccepted" className="text-sm text-text_secondary font-sans">
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
          <div className="p-3 bg-red-100 text-red-700 rounded text-sm">{apiError}</div>
        )}

        <div className="text-center">
          <button
            type="submit"
            className="submit-button py-3"
            disabled={!watch("termsAccepted") || isSubmitting}
          >
            {isSubmitting ? <LoadingCircle /> : authen?.link_create_account}
          </button>
        </div>
      </form>
    </>
  );
};