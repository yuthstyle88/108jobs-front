"use client";
import { CustomInput } from "@/components/ui/InputField";
import { useLanguageStore } from "@/store/useLanguageStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
const registerSchema = z
  .object({
    email: z.string().email("กรุณากรอกอีเมลให้ถูกต้อง"),
    username: z.string().min(3, "ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร"),
    password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
    confirmPassword: z.string(),
    phone: z.string().min(10, "เบอร์โทรศัพท์ต้องมีอย่างน้อย 10 หลัก"),
    termsAccepted: z.literal(true),
    privacyAccepted: z.literal(true),
    promotionalAccepted: z.literal(true),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });

type RegisterFormProps = {
  switchToVerifyEmail: () => void;
  setVerifyEmail: (email: string) => void;
  onBack: () => void;
};

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = ({
  switchToVerifyEmail,
  setVerifyEmail,
}: RegisterFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setError,
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

    const { loginLanguageData } = useLanguageStore();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setApiError(null);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          username: data.username,
          password: data.password,
          password_verify: data.confirmPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.fieldErrors?.email) {
          setError("email", {
            type: "manual",
            message: result.fieldErrors.email,
          });
        }
        if (result.fieldErrors?.username) {
          setError("username", {
            type: "manual",
            message: result.fieldErrors.username,
          });
        }

        if (
          result.error &&
          !result.fieldErrors?.email &&
          !result.fieldErrors?.username
        ) {
          setApiError(result.error);
        }

        return;
      }

      switchToVerifyEmail();
      setVerifyEmail(data.email);
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
        label="ชื่อผู้ใช้"
        name="username"
        register={register("username")}
        error={errors.username?.message}
        placeholder="กรอกชื่อผู้ใช้"
        type="text"
      />
      <CustomInput
        label="อีเมลที่ติดต่อได้"
        name="email"
        register={register("email")}
        error={errors.email?.message}
        placeholder="กรอกอีเมล"
        type="email"
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

      <CustomInput
        label="ยืนยันรหัสผ่าน"
        name="confirmPassword"
        type="password"
        register={register("confirmPassword")}
        error={errors.confirmPassword?.message}
        placeholder="ยืนยันรหัสผ่าน"
        showPassword={showConfirmPassword}
        toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
      />

      <CustomInput
        label="เบอร์โทรศัพท์ที่ติดต่อได้"
        name="phone"
        register={register("phone")}
        error={errors.phone?.message}
        placeholder="กรอกเบอร์โทร"
        type="tel"
      />

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="termsAccepted"
            {...register("termsAccepted")}
            className="mt-1"
          />
          <label htmlFor="termsAccepted" className="text-sm text-gray-700">
            ฉันได้อ่านและยอมรับ{" "}
            <a href="#" className="text-blue-600 hover:underline">
              เงื่อนไขข้อตกลงการใช้บริการ
            </a>
          </label>
        </div>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="privacyAccepted"
            {...register("privacyAccepted")}
            className="mt-1"
          />
          <label htmlFor="privacyAccepted" className="text-sm text-gray-700">
            ฉันได้อ่านและยอมรับ{" "}
            <a href="#" className="text-blue-600 hover:underline">
              นโยบายคุ้มครองความเป็นส่วนตัว
            </a>
          </label>
        </div>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="promotionalAccepted"
            {...register("promotionalAccepted")}
            className="mt-1"
          />
          <label
            htmlFor="promotionalAccepted"
            className="text-sm text-gray-700"
          >
            ฉันสนใจรับข้อมูลข่าวสาร ส่วนลดและโปรโมชันผ่านทางอีเมล
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
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? "กำลังดำเนินการ..." : loginLanguageData?.link_create_account}
        </button>
      </div>
    </form>
  );
};
