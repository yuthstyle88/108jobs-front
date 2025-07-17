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
          packageName: z
            .string()
            .nonempty(lang?.packageNameError || "Tên gói là bắt buộc"),
          description: z
            .string()
            .nonempty(lang?.packageDescriptionError || "Vui lòng nhập mô tả"),
          price: z
            .string()
            .nonempty(lang?.packagePriceError || "Giá là bắt buộc"),
          executionTime: z.coerce
            .number()
            .min(1, lang?.packageDeliveryLabel || "Tối thiểu 1 phút"),
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
  setIsFormDirty?: (dirty: boolean) => void;
};

const Step2Packages = ({
  job,
  nextStep,
  prevStep,
  mutate,
  setIsFormDirty,
}: Props) => {
  const createJobLanguage = useTranslateFile(LanguageFile.SELLER_CREATE_JOBS);

  const schema = useMemo(
    () => getSchema(createJobLanguage),
    [createJobLanguage]
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      packages: [
        {
          packageName: "",
          description: "",
          price: "",
          executionTime: 1,
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
    API_ROUTES_SELLER.job.postJobStep2
  );

  const onSubmit = async (data: FormData) => {
    try {
      await sendPackages({
        jobId: job.id,
        packages: data.packages,
      });
      await mutate();
      nextStep();
    } catch (err) {
      console.error("SUBMIT ERROR:", err);
    }
  };

  useEffect(() => {
    setIsFormDirty?.(isDirty);
  }, [isDirty, setIsFormDirty]);

  useEffect(() => {
    if (job?.packages?.length) {
      reset({
        packages: job.packages.map((pkg) => ({
          packageName: pkg.packageName,
          description: pkg.description,
          price: pkg.price,
          executionTime: pkg.executionTime,
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
        {createJobLanguage?.packageTitle}
      </h2>
      <div className="mb-6">
        <p className="text-[20px] text-text_primary">
          {createJobLanguage?.createPackageTitle}
        </p>
        <p className="text-[14px] text-text_secondary mb-6">
          {createJobLanguage?.createPackageDescription}
        </p>
      </div>

      <div className="space-y-8 max-w-4xl">
        {fields.map((pkg, index) => (
          <div
            key={pkg.id}
            className="border border-gray-200 rounded-lg p-6 relative"
          >
            <div className="absolute -top-3 left-4 bg-blue-600 text-white text-[16px] font-medium px-3 py-1 rounded-full">
              {createJobLanguage?.packageLabel} {index + 1}
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
                  {createJobLanguage?.packageNameLabel}
                </label>
                <input
                  className="text-text_primary w-full p-3 border border-gray-300 rounded-lg"
                  {...register(`packages.${index}.packageName`)}
                />
                {errors.packages?.[index]?.packageName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.packages[index]?.packageName?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-1">
                  {createJobLanguage?.packageDescriptionLabel}
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
                    {createJobLanguage?.packagePriceLabel}
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
                    {createJobLanguage?.packageDeliveryLabel}
                  </label>
                  <input
                    type="number"
                    className="text-text_primary w-full p-3 border border-gray-300 rounded-lg"
                    {...register(`packages.${index}.executionTime`)}
                  />
                  {errors.packages?.[index]?.executionTime && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.packages[index]?.executionTime?.message}
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
                packageName: "",
                description: "",
                price: "",
                executionTime: 1,
              })
            }
            className="flex items-center gap-2 text-blue-600 font-medium"
          >
            <Plus className="w-4 h-4" />
            {createJobLanguage?.addPackage}
          </button>
        )}

        <div className="flex justify-between mt-6">
          <button
            type="button"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            onClick={prevStep}
          >
            {createJobLanguage?.backButton}
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            disabled={isMutating}
          >
            {isMutating ? <LoadingCircle /> : createJobLanguage?.nextButton}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Step2Packages;
