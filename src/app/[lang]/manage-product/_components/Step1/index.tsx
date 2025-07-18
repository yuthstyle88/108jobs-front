import { API_ROUTES, API_ROUTES_SELLER } from "@/api/endpoints";
import Loading from "@/components/Loading";
import LoadingBlur from "@/components/LoadingBlur";
import LoadingCircle from "@/components/LoadingCircle";
import { LanguageFile } from "@/constants/language";
import { usePrivateFetch, usePrivatePost } from "@/hooks/api-hooks";
import { useTranslateFile } from "@/hooks/translation/useTranslateFile";
import { ServiceCatalogData } from "@/types/catalog";
import { JobType } from "@/types/job";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSchema = (createJobLanguage: any) =>
  z.object({
    category: z
      .string()
      .nonempty(
        createJobLanguage?.selectServiceCategoryError ||
          "Vui lòng chọn danh mục dịch vụ"
      ),
    type: z
      .string()
      .nonempty(
        createJobLanguage?.selectSubServiceError ||
          "Vui lòng chọn loại dịch vụ"
      ),
    name: z
      .string()
      .min(
        5,
        createJobLanguage?.serviceTitleError ||
          "Tiêu đề phải có ít nhất 5 ký tự"
      ),
    description: z
      .string()
      .min(
        10,
        createJobLanguage?.serviceDescriptionError ||
          "Mô tả phải có ít nhất 10 ký tự"
      ),
  });

type FormData = z.infer<ReturnType<typeof getSchema>>;

interface Props {
  onCreated?: (job: JobType) => void;
  job?: JobType;
  setJob?: (job: JobType) => void;
  nextStep?: () => void;
  setIsFormDirty?: (dirty: boolean) => void;
}

const Step1ServiceInfo = ({
  onCreated,
  job,
  setJob,
  nextStep,
  setIsFormDirty,
}: Props) => {
  const createJobLanguage = useTranslateFile(LanguageFile.SELLER_CREATE_JOBS);

  const { data: jobsData, isLoading } = usePrivateFetch<ServiceCatalogData>(
    API_ROUTES.catalog.getAllCatalog
  );
  const { trigger: sendLanguages, isMutating } = usePrivatePost(
    API_ROUTES_SELLER.job.postJobStep1
  );

  const schema = useMemo(
    () => getSchema(createJobLanguage),
    [createJobLanguage]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      category: job?.serviceCatalog?.id || "",
      type: job?.serviceType?.id || "",
      name: job?.title || "",
      description: job?.description || "",
    },
    resolver: zodResolver(schema),
  });

  const selectedCategory = watch("category");

  const subCategories = useMemo(() => {
    const selected = jobsData?.serviceCatalogs.find(
      (c) => c.id === selectedCategory
    );
    return selected ? selected.sections.flatMap((s) => s.categories) : [];
  }, [jobsData, selectedCategory]);

  useEffect(() => {
  if (!job || !jobsData?.serviceCatalogs?.length) return;

  const catalogId = job.serviceCatalog?.id || "";
  const typeId = job.serviceType?.id || "";

  reset({
    category: catalogId,
    type: typeId,
    name: job.title,
    description: job.description,
  });
}, [job, jobsData, reset]);


  const onSubmit = async (data: FormData) => {
    try {
      const res = await sendLanguages({
        ...(job?.id && { jobId: job.id }),
        serviceTypeId: data.type,
        jobTitle: data.name,
        jobDescription: data.description,
      });
      const newJob = res as JobType;
      setJob?.(newJob);
      if (nextStep) {
        nextStep();
      } else if (onCreated) {
        onCreated(newJob);
      }
    } catch (err) {
      console.error("Submit error", err);
    }
  };

  useEffect(() => {
    setIsFormDirty?.(isDirty);
  }, [isDirty, setIsFormDirty]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      {isMutating && <LoadingBlur text="Saving data" />}
      {isLoading && <Loading />}
      <h2 className="text-[32px] font-medium mb-6 text-text-primary">
        {createJobLanguage?.serviceInfoTitle}
      </h2>

      <div className="space-y-6 max-w-4xl">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-base font-medium text-gray-700 mb-1">
              {createJobLanguage?.serviceCategoryLabel}
            </label>
            <select
              className="text-text-primary w-full p-3 border border-gray-300 rounded-lg"
              {...register("category")}
              onChange={(e) => {
                setValue("category", e.target.value);
                setValue("type", "");
              }}
            >
              <option value="">
                {createJobLanguage?.selectServiceCategoryPlaceholder}
              </option>
              {jobsData?.serviceCatalogs?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-red-500 mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700 mb-1">
              {createJobLanguage?.subServiceLabel}
            </label>
            <select
              className="text-text-primary w-full p-3 border border-gray-300 rounded-lg"
              {...register("type")}
              disabled={!selectedCategory || subCategories.length === 0}
            >
              <option value="">
                {createJobLanguage?.selectSubServicePlaceholder}
              </option>
              {subCategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-base font-medium text-gray-700 mb-1">
            {createJobLanguage?.serviceTitleLabel}
          </label>
          <input
            type="text"
            className="text-text-primary w-full p-3 border border-gray-300 rounded-lg"
            placeholder={createJobLanguage?.serviceTitlePlaceholder}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}

          <div className="mt-2 p-3 bg-[#f6f7f8] rounded-lg flex">
            <Info className="w-5 h-5 text-[#728197] mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-[0.875rem] leading-[1.65] text-[#728197]">
              <p className="font-medium mb-1">
                {createJobLanguage?.serviceTitleGuideHeader}
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>{createJobLanguage?.serviceTitleGuide1}</li>
                <li>{createJobLanguage?.serviceTitleGuide2}</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-base font-medium text-gray-700 mb-1">
            {createJobLanguage?.serviceDescriptionLabel}
          </label>
          <textarea
            className="text-text-primary w-full p-3 border border-gray-300 rounded-lg min-h-40"
            placeholder={createJobLanguage?.serviceDescriptionPlaceholder}
            {...register("description")}
          ></textarea>
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="flex justify-end">
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

export default Step1ServiceInfo;
