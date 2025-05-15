"use client";

import LoadingBlur from "@/components/LoadingBlur";
import { usePrivatePost } from "@/hooks/api-hooks";
import { API_ROUTES_SELLER } from "@/api/endpoints";
import { JobType } from "@/types/job";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslateFile } from "@/hooks/translation/useTranslateFile";
import { LanguageFile } from "@/constants/language";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSchema = (lang: any) =>
  z.object({
    isOwner: z.literal(true, {
      errorMap: () => ({
        message: lang?.confirmation_error,
      }),
    }),
    canComplete: z.literal(true, {
      errorMap: () => ({
        message: lang?.confirmation_error,
      }),
    }),
    agreeTerms: z.literal(true, {
      errorMap: () => ({
        message: lang?.confirmation_error,
      }),
    }),
  });

type Props = {
  job: JobType;
  prevStep: () => void;
  handleSubmitSteps: () => void;
};

const Step5Confirm = ({ job, prevStep, handleSubmitSteps }: Props) => {
  const createJobLanguage = useTranslateFile(LanguageFile.SELLER_CREATE_JOBS);

  const checkboxes: {
    id: "isOwner" | "canComplete" | "agreeTerms";
    label: React.ReactNode;
  }[] = [
    {
      id: "isOwner",
      label: createJobLanguage?.confirmation_check_1,
    },
    {
      id: "canComplete",
      label: createJobLanguage?.confirmation_check_2,
    },
    {
      id: "agreeTerms",
      label: <>{createJobLanguage?.confirmation_check_3}</>,
    },
  ];

  const schema = useMemo(
    () => getSchema(createJobLanguage),
    [createJobLanguage]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    defaultValues: {
      isOwner: undefined,
      canComplete: undefined,
      agreeTerms: undefined,
    },
    resolver: zodResolver(schema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const { trigger: submitJob } = usePrivatePost(
    API_ROUTES_SELLER.job.post_job_step_5
  );

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      await submitJob({ job_id: job.id });
      handleSubmitSteps();
    } catch (error) {
      console.error("Lỗi khi gửi bước 5", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      {isLoading && <LoadingBlur text={"Đang lưu dữ liệu"} />}
      <h2 className="text-xl font-medium text-text_primary">
        {createJobLanguage?.confirmation_title}
      </h2>
      <p className="mb-6 text-[16px] text-text_secondary font-sans">
        Nếu không xác nhận đồng ý với các điều khoản, bạn sẽ không thể đăng bán
        dịch vụ trên Fastlance
      </p>

      <div className="space-y-8 max-w-4xl">
        <div className="p-4 bg-secondary border border-third rounded-lg mb-6 flex">
          <Info className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
          <p className="text-sm text-primary mb-2 font-normal font-sans leading-6">
            Thông tin bổ sung từ hệ thống
            <br />• {createJobLanguage?.confirmation_notice_1}
            <br />• {createJobLanguage?.confirmation_notice_2}
          </p>
        </div>

        <div className="space-y-4">
          {checkboxes.map(({ id, label }) => (
            <div key={id} className="flex items-start gap-2">
              <input
                type="checkbox"
                id={id}
                className="checkbox-button checkbox-indicato mt-1"
                {...register(id)}
              />
              <label
                htmlFor={id}
                className="text-[16px] text-black font-sans font-semibold"
              >
                {label}
              </label>
            </div>
          ))}

          {(errors.agreeTerms || errors.isOwner || errors.canComplete) && (
            <p className="text-sm text-red-500">
              {createJobLanguage?.confirmation_error}
            </p>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            onClick={prevStep}
          >
            {createJobLanguage?.back_button}
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
