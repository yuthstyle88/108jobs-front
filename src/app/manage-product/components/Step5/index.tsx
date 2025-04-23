// Step5Confirm.tsx
"use client";
import LoadingBlur from "@/components/LoadingBlur";
import { JobType } from "@/types/job";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  isOwner: z.literal(true, {
    errorMap: () => ({
      message: "Vui lòng xác nhận bạn là người cung cấp dịch vụ",
    }),
  }),
  canComplete: z.literal(true, {
    errorMap: () => ({
      message: "Vui lòng xác nhận bạn có khả năng hoàn thành dịch vụ",
    }),
  }),
  agreeTerms: z.literal(true, {
    errorMap: () => ({ message: "Vui lòng đồng ý với điều khoản dịch vụ" }),
  }),
});

type FormData = z.infer<typeof schema>;

type Props = {
  job: JobType;
  prevStep: () => void;
  handleSubmitSteps: () => void;
};

const Step5Confirm = ({ job, prevStep, handleSubmitSteps }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      isOwner: undefined,
      canComplete: undefined,
      agreeTerms: undefined,
    },
    resolver: zodResolver(schema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      console.log("Submitting final step with:", {
        job_id: job.id,
        ...data,
      });

      // Giả lập API call
      await new Promise((res) => setTimeout(res, 1000));
      setIsLoading(false);
      // Thành công
      handleSubmitSteps();
    } catch (error) {
      console.error("Lỗi khi gửi bước 5", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      {isLoading && <LoadingBlur text={"Đang lưu dữ liệu"} />}
      <h2 className="text-xl font-medium text-text_primary">
        Xác nhận dịch vụ
      </h2>
      <p className="mb-6 text-[16px] text-text_secondary font-sans">Nếu không xác nhận đồng ý với các điều khoản, bạn sẽ không thể đăng bán dịch vụ trên Fastlance</p>

      <div className="space-y-8 max-w-4xl">
        <div className="p-4 bg-secondary border border-third rounded-lg mb-6 flex">
          <Info className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
          <p className="text-sm text-primary mb-2 font-normal font-sans leading-6">
            Thông tin bổ sung từ hệ thống
            <br />
            • Hệ thống sẽ bắt đầu kiểm tra thông tin công việc sau khi hồ sơ
            Freelancer được phê duyệt
            <br />• Việc kiểm tra và phê duyệt hồ sơ dịch vụ sẽ mất khoảng 2
            ngày làm việc
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isOwner"
              className="mt-1 mr-2 checkbox-button checkbox-indicato"
              {...register("isOwner")}
            />
            <label htmlFor="isOwner" className="text-[16px] text-black font-sans font-semibold">
            Tôi là chủ sở hữu thực sự của dịch vụ
            </label>
          </div>
          {errors.isOwner && (
            <p className="text-sm text-red-500 ml-7">
              {errors.isOwner.message}
            </p>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="canComplete"
              className="mt-1 mr-2 checkbox-button checkbox-indicato"
              {...register("canComplete")}
            />
            <label htmlFor="canComplete" className="text-[16px] text-black font-sans font-semibold">
            Tôi có thể hoàn thành tất cả công việc như đã mô tả
            </label>
          </div>
          {errors.canComplete && (
            <p className="text-sm text-red-500 ml-7">
              {errors.canComplete.message}
            </p>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="agreeTerms"
              className="mt-1 mr-2 checkbox-button checkbox-indicato"
              {...register("agreeTerms")}
            />
            <label htmlFor="agreeTerms" className="text-[16px] text-black font-sans font-semibold">
            Tôi đã đọc và đồng ý với các gợi ý <a className="underline text-third">Điều khoản sử dụng dịch vụ của Fastlance</a>
            </label>
          </div>
          {errors.agreeTerms && (
            <p className="text-sm text-red-500 ml-7">
              {errors.agreeTerms.message}
            </p>
          )}
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            onClick={prevStep}
          >
            Quay lại
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Đăng dịch vụ
          </button>
        </div>
      </div>
    </form>
  );
};

export default Step5Confirm;
