"use client";
import { CustomInput } from "@/components/ui/InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "กรุณากรอกอีเมลหรือเบอร์โทรศัพท์"),
});

export const ForgotPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = () => console.log("helo");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="text-sm text-gray-600 mb-6">
        Fastwork จะทำการส่งรหัสยืนยันไปยัง อีเมล/เบอร์โทรศัพท์ของคุณ
        เพื่อยืนยันความเป็นเจ้าของบัญชี
      </div>

      <CustomInput
        label="อีเมลหรือหมายเลขโทรศัพท์"
        name="email"
        register={register("email")}
        error={errors.email?.message}
        placeholder="กรอกอีเมลหรือเบอร์โทร"
      />

      <div className="text-center">
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 transition duration-300"
        >
          ส่งรหัสยืนยัน
        </button>
      </div>
    </form>
  );
};