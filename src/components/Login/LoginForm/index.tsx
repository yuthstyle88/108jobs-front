"use client";
import { CustomInput } from "@/components/ui/InputField";
import { SocialLoginButton } from "@/components/ui/SocialLoginButton";
import { useLanguageStore } from "@/store/useLanguageStore";
import { faFacebookF, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email ไม่ถูกต้อง"),
  password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
});

type LoginFormProps = {
  switchToRegister: () => void;
  switchToForgotPassword: () => void;
};

export const LoginForm = ({
  switchToRegister,
  switchToForgotPassword,
}: LoginFormProps) => {
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

  const { loginLanguageData } = useLanguageStore();

  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError("email", {
          type: "manual",
          message: " ",
        });
        setError("password", {
          type: "manual",
          message: " ",
        });
        setError("root", {
          type: "manual",
          message: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
        });
      } else {
        route.push("/dashboard");
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
        label="Email"
        name="email"
        register={register("email")}
        error={errors.email?.message}
        placeholder="กรอกอีเมลของคุณ"
      />

      <CustomInput
        label="รหัสผ่าน"
        name="password"
        type="password"
        register={register("password")}
        error={errors.password?.message}
        placeholder="กรอกรหัสผ่าน"
        showPassword={showPassword}
        toggleShowPassword={() => setShowPassword(!showPassword)}
      />

      <div className="text-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-300"
        >
          {isSubmitting ? "การเข้าสู่ระบบ..." : loginLanguageData?.button_proceed}
        </button>

        <div className="flex justify-between text-sm text-blue-600 mt-4">
          <button
            type="button"
            onClick={switchToRegister}
            className="hover:underline"
          >
            {loginLanguageData?.link_create_account}
          </button>
          <button
            type="button"
            onClick={switchToForgotPassword}
            className="hover:underline"
          >
            {loginLanguageData?.link_forgot_password}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-4 text-center mt-6">
        <hr className="flex-grow border-t border-gray-300" />
        <span className="text-gray-600 px-2">
          {loginLanguageData?.label_or}
        </span>
        <hr className="flex-grow border-t border-gray-300" />
      </div>

      <div className="flex flex-col gap-4 mt-6">
        <SocialLoginButton
          icon={faFacebookF}
          provider={loginLanguageData?.button_login_facebook}
          onClick={() => signIn("facebook")}
        />
        <SocialLoginButton
          icon={faGoogle}
          provider={loginLanguageData?.button_login_google}
          onClick={() => signIn("google")}
        />
      </div>
    </form>
  );
};
