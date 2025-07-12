"use client";
import LoadingCircle from "@/components/LoadingCircle";
import { CustomInput } from "@/components/ui/InputField";
import { SocialLoginButton } from "@/components/ui/SocialLoginButton";
import { AuthenticateIcon } from "@/constants/icons";
import { LanguageFile } from "@/constants/language";
import { useTranslateFile } from "@/hooks/translation/useTranslateFile";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type LoginFormProps = {
  switchToRegister: () => void;
  switchToForgotPassword: () => void;
  switchToSignUpGoogle: () => void;
};

export const LoginForm = ({
  switchToRegister,
  switchToForgotPassword,
  switchToSignUpGoogle
}: LoginFormProps) => {
  const authen = useTranslateFile(LanguageFile.AUTHEN);

  const loginSchema = z.object({
    username_or_email: z
      .string()
      .min(6, authen?.please_enter_email_or_username_min_6)
      .max(32, authen?.username_max_32),
    password: z.string().min(6, authen?.password_min_6),
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const route = useRouter();

  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        username_or_email: data.username_or_email,
        password: data.password,
        callbackUrl: redirectUrl,
      });

      if (result?.error) {
        console.log("reseult", result.error);
        switch (result.error) {
          case "not_found":
            setError("username_or_email", {
              type: "manual",
              message: authen?.not_found,
            });
            break;
          case "incorrect_password":
            setError("password", {
              type: "manual",
              message: "รหัสผ่านไม่ถูกต้อง",
            });
            break;
          default:
            setError("root", {
              type: "manual",
              message: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
            });
        }
      } else {
        route.push(result?.url || "/");
      }
    } catch (error) {
      setError("root", {
        type: "manual",
        message: "เกิดข้อผิดพลาดของระบบ กรุณาลองใหม่อีกครั้ง",
      });
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
      {errors.root && (
        <p className="text-red-500 text-sm text-center mb-4">
          {errors.root.message}
        </p>
      )}

      <CustomInput
        label={authen?.label_username_or_email}
        name="username_or_email"
        register={register("username_or_email")}
        error={errors.username_or_email?.message}
        placeholder={authen?.placeholder_username_or_email}
      />

      <CustomInput
        label={authen?.label_password}
        name="password"
        type="password"
        register={register("password")}
        error={errors.password?.message}
        placeholder={authen?.placeholder_password}
        showPassword={showPassword}
        toggleShowPassword={() => setShowPassword(!showPassword)}
      />

      <div className="text-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="submit-button py-2"
        >
          {isSubmitting ? <LoadingCircle /> : authen?.button_proceed}
        </button>

        <div className="flex justify-between text-sm text-blue-600 mt-4">
          <button
            type="button"
            onClick={switchToRegister}
            className="hover:underline"
          >
            {authen?.link_create_account}
          </button>
          <button
            type="button"
            onClick={switchToForgotPassword}
            className="hover:underline"
          >
            {authen?.link_forgot_password}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-4 text-center mt-6">
        <hr className="flex-grow border-t border-gray-300" />
        <span className="text-gray-600 px-2">{authen?.label_or}</span>
        <hr className="flex-grow border-t border-gray-300" />
      </div>

      <div className="flex flex-col gap-4 mt-6">
        <SocialLoginButton
          icon={AuthenticateIcon.fb}
          provider={authen?.button_login_facebook}
          onClick={() => signIn("facebook")}
        />
        <SocialLoginButton
          icon={AuthenticateIcon.gg}
          provider={authen?.button_login_google}
          // onClick={() => signIn("google", { callbackUrl: "/" })}
          onClick={switchToSignUpGoogle}
        />
      </div>
    </form>
  );
};
