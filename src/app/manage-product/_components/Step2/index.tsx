import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Plus } from "lucide-react";
import { usePrivatePost } from "@/hooks/api-hooks";
import { API_ROUTES_SELLER } from "@/api/endpoints";
import { JobType } from "@/types/job";
import LoadingBlur from "@/components/LoadingBlur";
import { useEffect } from "react";

const packageSchema = z.object({
  package_name: z.string().nonempty("Tên gói là bắt buộc"),
  description: z.string().nonempty("Vui lòng nhập mô tả"),
  price: z.string().nonempty("Giá là bắt buộc"),
  execution_time: z.coerce.number().min(1, "Tối thiểu 1 phút"),
});

const schema = z.object({
  packages: z.array(packageSchema).min(1).max(3),
});

type FormData = z.infer<typeof schema>;

type Props = {
  job: JobType;
  nextStep: () => void;
  prevStep: () => void;
  mutate: () => void;
};

const Step2Packages = ({ job, nextStep, prevStep,mutate }: Props) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      packages: [
        {
          package_name: "",
          description: "",
          price: "",
          execution_time: 1,
        },
      ],
    },
    resolver: zodResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "packages",
  });

  const { trigger: sendPackages, isMutating } = usePrivatePost(
    API_ROUTES_SELLER.job.post_job_step_2
  );

  const onSubmit = async (data: FormData) => {
    try {
      await sendPackages({
        job_id: job.id,
        packages: data.packages,
      });
      await mutate();
      nextStep();
    } catch (err) {
      console.error("SUBMIT ERROR:", err);
    }
  };

  useEffect(() => {
    if (job?.packages?.length) {
      reset({
        packages: job.packages.map((pkg) => ({
          package_name: pkg.package_name,
          description: pkg.description,
          price: pkg.price,
          execution_time: pkg.execution_time,
        })),
      });
    }
  }, [job, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      {isMutating && <LoadingBlur text={"Đang lưu dữ liệu"} />}
      <h2 className="text-[32px] font-medium mb-2 text-text_primary">
        Các gói dịch vụ và giá
      </h2>
      <div className="mb-6">
        <p className="text-[20px] text-text_primary">Tạo gói dịch vụ của bạn</p>
        <p className="text-[14px] text-text_secondary mb-6">
          Gói dịch vụ sẽ giúp quá trình nhận dự án của bạn trở nên thuận tiện
          hơn, giảm bớt các bước thảo luận chi tiết với người thuê. Bạn cần tạo
          ít nhất một gói và tối đa ba gói cho một dịch vụ.
        </p>
      </div>

      <div className="space-y-8 max-w-4xl">
        {fields.map((pkg, index) => (
          <div
            key={pkg.id}
            className="border border-gray-200 rounded-lg p-6 relative"
          >
            <div className="absolute -top-3 left-4 bg-blue-600 text-white text-[16px] font-medium px-3 py-1 rounded-full">
              Gói {index + 1}
            </div>

            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <div className="mt-4 space-y-6">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-1">
                  Tên gói
                </label>
                <input
                  className="text-text_primary w-full p-3 border border-gray-300 rounded-lg"
                  {...register(`packages.${index}.package_name`)}
                />
                {errors.packages?.[index]?.package_name && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.packages[index]?.package_name?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  className="text-text_primary w-full p-3 border border-gray-300 rounded-lg min-h-24"
                  {...register(`packages.${index}.description`)}
                ></textarea>
                {errors.packages?.[index]?.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.packages[index]?.description?.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-1">
                    Giá (VND)
                  </label>
                  <input
                    type="text"
                    className="text-text_primary w-full p-3 border border-gray-300 rounded-lg"
                    {...register(`packages.${index}.price`)}
                  />
                  {errors.packages?.[index]?.price && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.packages[index]?.price?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-700 mb-1">
                    Thời gian thực hiện (phút)
                  </label>
                  <input
                    type="number"
                    className="text-text_primary w-full p-3 border border-gray-300 rounded-lg"
                    {...register(`packages.${index}.execution_time`)}
                  />
                  {errors.packages?.[index]?.execution_time && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.packages[index]?.execution_time?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {fields.length < 3 && (
          <button
            type="button"
            onClick={() =>
              append({
                package_name: "",
                description: "",
                price: "",
                execution_time: 1,
              })
            }
            className="flex items-center gap-2 text-blue-600 font-medium"
          >
            <Plus className="w-4 h-4" />
            Thêm gói
          </button>
        )}

        <div className="flex justify-between mt-6">
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
            disabled={isMutating}
          >
            {isMutating ? "Đang gửi..." : "Tiếp tục"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Step2Packages;
