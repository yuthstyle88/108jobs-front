import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Plus } from "lucide-react";
import { usePrivatePost } from "@/hooks/api-hooks";
import { API_ROUTES_SELLER } from "@/api/endpoints";
import { JobType } from "@/types/job";
import LoadingBlur from "@/components/LoadingBlur";
import { useEffect, useMemo } from "react";
import { useTranslateFile } from "@/hooks/translation/useTranslateFile";
import { LanguageFile } from "@/constants/language";
import LoadingCircle from "@/components/LoadingCircle";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSchema = (lang: any) =>
  z.object({
    packages: z
      .array(
        z.object({
          package_name: z
            .string()
            .nonempty(lang?.package_name_error || "Tên gói là bắt buộc"),
          description: z
            .string()
            .nonempty(
              lang?.package_description_error || "Vui lòng nhập mô tả"
            ),
          price: z
            .string()
            .nonempty(lang?.package_price_error || "Giá là bắt buộc"),
          execution_time: z.coerce
            .number()
            .min(1, lang?.package_delivery_label || "Tối thiểu 1 phút"),
        })
      )
      .min(1)
      .max(3),
  });

type FormData = z.infer<ReturnType<typeof getSchema>>;

type Props = {
  job: JobType;
  nextStep: () => void;
  prevStep: () => void;
  mutate: () => void;
};

const Step2Packages = ({ job, nextStep, prevStep, mutate }: Props) => {
  const createJobLanguage = useTranslateFile(LanguageFile.SELLER_CREATE_JOBS);

  const schema = useMemo(
    () => getSchema(createJobLanguage),
    [createJobLanguage]
  );

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
        {createJobLanguage?.package_title}
      </h2>
      <div className="mb-6">
        <p className="text-[20px] text-text_primary">{createJobLanguage?.create_package_title}</p>
        <p className="text-[14px] text-text_secondary mb-6">
          {createJobLanguage?.create_package_description}
        </p>
      </div>

      <div className="space-y-8 max-w-4xl">
        {fields.map((pkg, index) => (
          <div
            key={pkg.id}
            className="border border-gray-200 rounded-lg p-6 relative"
          >
            <div className="absolute -top-3 left-4 bg-blue-600 text-white text-[16px] font-medium px-3 py-1 rounded-full">
              {createJobLanguage?.package_label} {index + 1}
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
                  {createJobLanguage?.package_name_label}
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
                  {createJobLanguage?.package_description_label}
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
                    {createJobLanguage?.package_price_label}
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
                    {createJobLanguage?.package_delivery_label}
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
            {createJobLanguage?.add_package}
          </button>
        )}

        <div className="flex justify-between mt-6">
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
            disabled={isMutating}
          >
            {isMutating ? <LoadingCircle /> : createJobLanguage?.next_button}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Step2Packages;
