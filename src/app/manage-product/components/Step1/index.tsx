// Step1ServiceInfo.tsx
import { API_ROUTES, API_ROUTES_SELLER } from "@/api/endpoints";
import LoadingBlur from "@/components/LoadingBlur";
import { usePrivateFetch, usePrivatePost } from "@/hooks/api-hooks";
import { ServiceCatalogData } from "@/types/catalog";
import { JobType } from "@/types/job";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  category: z.string().nonempty("Vui lòng chọn danh mục dịch vụ"),
  type: z.string().nonempty("Vui lòng chọn loại dịch vụ"),
  name: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự"),
  description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự"),
});

type FormData = z.infer<typeof schema>;

type Props = {
  setJob: (job: JobType) => void;
  nextStep: () => void;
};

const Step1ServiceInfo = ({ setJob, nextStep }: Props) => {
  const { data: jobsData } = usePrivateFetch<ServiceCatalogData>(
    API_ROUTES.catalog.get_all_catalog
  );
  const { trigger: sendLanguages, isMutating } = usePrivatePost(
    API_ROUTES_SELLER.job.post_job_step_1
  );

  const [selectedCatalogId, setSelectedCatalogId] = useState<string>("");
  const [subCategories, setSubCategories] = useState<
    { id: string; name: string }[]
  >([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const selectedCategory = useWatch({
    control,
    name: "category",
  });

  useEffect(() => {
    setSelectedCatalogId(selectedCategory);
  }, [selectedCategory]);
  useEffect(() => {
    if (!selectedCatalogId || !jobsData?.service_catalogs) return;
    const selected = jobsData.service_catalogs.find(
      (c) => c.id === selectedCatalogId
    );
    if (selected) {
      const allCategories = selected.sections.flatMap((s) => s.categories);
      setSubCategories(allCategories);
    }
  }, [selectedCatalogId, jobsData]);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await sendLanguages({
        service_type_id: data.type,
        job_title: data.name,
        job_description: data.description,
      });
      setJob(response as JobType);

      nextStep();
    } catch (error) {
      console.error("Submit error", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      {isMutating && <LoadingBlur text={"Đang lưu dữ liệu"} />}
      <h2 className="text-[32px] font-medium mb-6 text-text_primary">
        Thông tin dịch vụ
      </h2>

      <div className="space-y-6 max-w-4xl">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-base font-medium text-gray-700 mb-1">
              Danh mục dịch vụ
            </label>
            <select
              className="text-text_primary w-full p-3 border border-gray-300 rounded-lg"
              {...register("category")}
              onChange={(e) => {
                setValue("category", e.target.value);
                setValue("type", "");
              }}
            >
              <option value="">Chọn danh mục</option>
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
              Dịch vụ con
            </label>
            <select
              className="text-text_primary w-full p-3 border border-gray-300 rounded-lg"
              {...register("type")}
              disabled={!selectedCatalogId}
            >
              <option value="">Chọn loại dịch vụ</option>
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
            Tiêu đề dịch vụ
          </label>
          <input
            type="text"
            className="text-text_primary w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Ví dụ: Thiết kế website chuyên nghiệp, tối ưu SEO"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}

          <div className="mt-2 p-3 bg-[#f6f7f8] rounded-lg flex">
            <Info className="w-5 h-5 text-[#728197] mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-[0.875rem] leading-[1.65] text-[#728197]">
              <p className="font-medium mb-1">Hướng dẫn đặt tiêu đề dịch vụ:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  • Sử dụng tiêu đề rõ ràng và chính xác để người thuê dễ dàng
                  tìm thấy dịch vụ của bạn. Ví dụ: &quot;Thiết kế Logo Nhà
                  Hàng/Công ty phong cách Tối giản và Hiện đại.&quot;
                </li>
                <li>
                  • Đảm bảo sử dụng tiêu đề khác nhau cho các dịch vụ tương tự
                  trong cùng một danh mục. Tiêu đề trùng lặp sẽ không được phê
                  duyệt.
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-base font-medium text-gray-700 mb-1">
            Mô tả dịch vụ
          </label>
          <textarea
            className="text-text_primary w-full p-3 border border-gray-300 rounded-lg min-h-40"
            placeholder="Mô tả chi tiết dịch vụ của bạn..."
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
            {isMutating ? "Đang gửi..." : "Lưu và tiếp tục"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Step1ServiceInfo;
