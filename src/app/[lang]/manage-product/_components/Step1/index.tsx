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
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import WarningLeaveModal from "../../../../../components/WarningLeaveModal";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSchema = (createJobLanguage: any) =>
  z.object({
    category: z
      .string()
      .nonempty(
        createJobLanguage?.select_service_category_error ||
          "Vui lòng chọn danh mục dịch vụ"
      ),
    type: z
      .string()
      .nonempty(
        createJobLanguage?.select_sub_service_error ||
          "Vui lòng chọn loại dịch vụ"
      ),
    name: z
      .string()
      .min(
        5,
        createJobLanguage?.service_title_error ||
          "Tiêu đề phải có ít nhất 5 ký tự"
      ),
    description: z
      .string()
      .min(
        10,
        createJobLanguage?.service_description_error ||
          "Mô tả phải có ít nhất 10 ký tự"
      ),
  });

type FormData = z.infer<ReturnType<typeof getSchema>>;

interface Props {
  onCreated?: (job: JobType) => void;
  job?: JobType;
  setJob?: (job: JobType) => void;
  nextStep?: () => void;
}

const Step1ServiceInfo = ({ onCreated, job, setJob, nextStep }: Props) => {
  const createJobLanguage = useTranslateFile(LanguageFile.SELLER_CREATE_JOBS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: jobsData, isLoading } = usePrivateFetch<ServiceCatalogData>(
    API_ROUTES.catalog.get_all_catalog
  );
  const { trigger: sendLanguages, isMutating } = usePrivatePost(
    API_ROUTES_SELLER.job.post_job_step_1
  );

  const schema = useMemo(
    () => getSchema(createJobLanguage),
    [createJobLanguage]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const selectedCategory = watch("category");

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const subCategories = useMemo(() => {
    const selected = jobsData?.service_catalogs.find(
      (c) => c.id === selectedCategory
    );
    return selected ? selected.sections.flatMap((s) => s.categories) : [];
  }, [jobsData, selectedCategory]);

  useEffect(() => {
    if (!job || !jobsData?.service_catalogs?.length) return;

    const catalogId = job.service_catalog?.id || "";
    const typeId = job.service_type?.id || "";

    setValue("category", catalogId);
    setValue("name", job.title);
    setValue("description", job.description);

    const selected = jobsData.service_catalogs.find((c) => c.id === catalogId);
    if (selected) {
      const subs = selected.sections.flatMap((s) => s.categories);
      const match = subs.find((c) => c.id === typeId);
      if (match) setTimeout(() => setValue("type", typeId), 0);
    }
  }, [job, jobsData, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      const res = await sendLanguages({
        ...(job?.id && { job_id: job.id }),
        service_type_id: data.type,
        job_title: data.name,
        job_description: data.description,
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      {isMutating && <LoadingBlur text="Đang lưu dữ liệu" />}
      {isLoading && <Loading />}
      <h2 className="text-[32px] font-medium mb-6 text-text_primary">
        {createJobLanguage?.service_info_title}
      </h2>

      <div className="space-y-6 max-w-4xl">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-base font-medium text-gray-700 mb-1">
              {createJobLanguage?.service_category_label}
            </label>
            <select
              className="text-text_primary w-full p-3 border border-gray-300 rounded-lg"
              {...register("category")}
              onChange={(e) => {
                setValue("category", e.target.value);
                setValue("type", "");
              }}
            >
              <option value="">
                {createJobLanguage?.select_service_category_placeholder}
              </option>
              {jobsData?.service_catalogs?.map((cat) => (
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
              {createJobLanguage?.sub_service_label}
            </label>
            <select
              className="text-text_primary w-full p-3 border border-gray-300 rounded-lg"
              {...register("type")}
              disabled={!selectedCategory || subCategories.length === 0}
            >
              <option value="">
                {createJobLanguage?.select_sub_service_placeholder}
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
            {createJobLanguage?.service_title_label}
          </label>
          <input
            type="text"
            className="text-text_primary w-full p-3 border border-gray-300 rounded-lg"
            placeholder={createJobLanguage?.service_title_placeholder}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}

          <div className="mt-2 p-3 bg-[#f6f7f8] rounded-lg flex">
            <Info className="w-5 h-5 text-[#728197] mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-[0.875rem] leading-[1.65] text-[#728197]">
              <p className="font-medium mb-1">
                {createJobLanguage?.service_title_guide_header}
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>{createJobLanguage?.service_title_guide_1}</li>
                <li>{createJobLanguage?.service_title_guide_2}</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-base font-medium text-gray-700 mb-1">
            {createJobLanguage?.service_description_label}
          </label>
          <textarea
            className="text-text_primary w-full p-3 border border-gray-300 rounded-lg min-h-40"
            placeholder={createJobLanguage?.service_description_placeholder}
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
            {isMutating ? <LoadingCircle /> : createJobLanguage?.next_button}
          </button>
        </div>
      </div>
      <WarningLeaveModal
        isOpen={isModalOpen}
        onClose={handleClose}
        handleConfirmChange={() => {
          
        }}
      />
    </form>
  );
};

export default Step1ServiceInfo;
