"use client";
import { Plus, X } from "lucide-react";
import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePrivateFetch, usePrivatePost } from "@/hooks/api-hooks";
import { API_ROUTES_SELLER } from "@/api/endpoints";
import LoadingMultiCircle from "@/components/LoadingMultiCircle";
import useNotification from "@/hooks/useNotification";

// Zod schema
const experienceSchema = z.object({
  experienceItems: z.array(
    z.object({
      id: z.string().optional(),
      company: z.string().min(1, "Vui lòng nhập tên công ty"),
      position: z.string().min(1, "Vui lòng nhập vị trí công việc"),
      startMonth: z.string(),
      startYear: z.string(),
      endMonth: z.string().nullable(),
      endYear: z.string().nullable(),
      isCurrent: z.boolean(),
    })
  ),
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

type ExperienceFromServer = {
  id: string;
  company_name: string;
  position: string;
  start_month: string;
  start_year: number;
  end_month: string | null;
  end_year: number | null;
  is_current: boolean;
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentYear = new Date().getFullYear();
const currentDate = new Date();
const defaultMonth = months[currentDate.getMonth()];
const defaultYear = currentDate.getFullYear().toString();
const years = Array.from({ length: 40 }, (_, i) =>
  (currentYear - i).toString()
);

const EditExperience = () => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      experienceItems: [],
    },
  });

  const { success_message } = useNotification();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experienceItems",
  });

  const { data, isLoading, mutate } = usePrivateFetch<{
    work_experiences: ExperienceFromServer[];
  }>(API_ROUTES_SELLER.profile.work_experience);

  const { trigger: sendExperience, isMutating } = usePrivatePost(
    API_ROUTES_SELLER.profile.work_experience
  );

  useEffect(() => {
    if (data?.work_experiences) {
      const mapped = data.work_experiences.map((item) => ({
        id: item.id,
        company: item.company_name,
        position: item.position,
        startMonth: item.start_month,
        startYear: item.start_year.toString(),
        endMonth: item.end_month ?? defaultMonth, // 👈 fix tại đây
        endYear: item.end_year?.toString() ?? defaultYear, // 👈 fix tại đây
        isCurrent: item.is_current,
      }));
      
      reset({ experienceItems: mapped });
    }
  }, [data, reset]);

  const watchExperience = watch("experienceItems");

useEffect(() => {
  watchExperience.forEach((item, index) => {
    if (!item.isCurrent) {
      if (!item.endMonth) {
        setValue(`experienceItems.${index}.endMonth`, defaultMonth);
      }
      if (!item.endYear) {
        setValue(`experienceItems.${index}.endYear`, defaultYear);
      }
    }
  });
}, [watchExperience, setValue]);

  const onSubmit = async (formData: ExperienceFormData) => {
    const body = {
      work_experiences: formData.experienceItems.map((item) => ({
        ...(item.id ? { id: item.id } : {}),
        company_name: item.company,
        position: item.position,
        start_month: item.startMonth,
        start_year: Number(item.startYear),
        end_month: item.isCurrent ? null : item.endMonth,
        end_year: item.isCurrent ? null : Number(item.endYear),
        is_current: item.isCurrent,
      })),
    };

    try {
      await sendExperience(body);
      success_message("profile", "update_education", null);
    } catch (error) {
      console.error("Lỗi khi lưu kinh nghiệm:", error);
    }
  };

  return (
    <div className="flex-1">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-blue-600 mb-8">
          Kinh nghiệm làm việc
        </h1>

        {isLoading || fields.length === 0 ? (
          <div className="bg-white w-full h-40 flex justify-center items-center">
            <LoadingMultiCircle />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            {fields.map((item, index) => {
              const isCurrent = watch(`experienceItems.${index}.isCurrent`);
              return (
                <div
                  key={item.id || index}
                  className="bg-white rounded-lg p-6 mb-6 shadow-sm"
                >
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Tên công ty
                      </label>
                      <input
                        type="text"
                        className="text-text_primary w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Chỉ định tên công ty"
                        {...register(`experienceItems.${index}.company`)}
                      />
                      {errors.experienceItems?.[index]?.company && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.experienceItems[index]?.company?.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Vị trí</label>
                      <input
                        type="text"
                        className="text-text_primary w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Chỉ định vị trí công việc"
                        {...register(`experienceItems.${index}.position`)}
                      />
                      {errors.experienceItems?.[index]?.position && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.experienceItems[index]?.position?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-4">
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Tháng bắt đầu
                      </label>
                      <select
                        className="text-text_primary w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white bg-no-repeat bg-right"
                        style={{
                          backgroundImage:
                            'url(\'data:image/svg+xml;charset=US-ASCII,<svg width="12" height="7" xmlns="http://www.w3.org/2000/svg"><path d="M1 1l5 5 5-5" stroke="%23999" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>\')',
                          backgroundPosition: "right 1rem center",
                        }}
                        {...register(`experienceItems.${index}.startMonth`)}
                      >
                        {months.map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Năm bắt đầu
                      </label>
                      <select
                        className="text-text_primary w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white bg-no-repeat bg-right"
                        style={{
                          backgroundImage:
                            'url(\'data:image/svg+xml;charset=US-ASCII,<svg width="12" height="7" xmlns="http://www.w3.org/2000/svg"><path d="M1 1l5 5 5-5" stroke="%23999" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>\')',
                          backgroundPosition: "right 1rem center",
                        }}
                        {...register(`experienceItems.${index}.startYear`)}
                      >
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="text-text_primary form-checkbox h-5 w-5 text-blue-600 rounded"
                        {...register(`experienceItems.${index}.isCurrent`)}
                      />
                      <span className="ml-2 text-gray-700">
                        Nơi làm việc hiện tại
                      </span>
                    </label>
                  </div>

                  {!isCurrent && (
                    <div className="grid grid-cols-2 gap-6 mb-4">
                      <div>
                        <label className="block text-gray-700 mb-2">
                          Tháng kết thúc
                        </label>
                        <select
                          className="text-text_primary w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white bg-no-repeat bg-right"
                          style={{
                            backgroundImage:
                              'url(\'data:image/svg+xml;charset=US-ASCII,<svg width="12" height="7" xmlns="http://www.w3.org/2000/svg"><path d="M1 1l5 5 5-5" stroke="%23999" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>\')',
                            backgroundPosition: "right 1rem center",
                          }}
                          {...register(`experienceItems.${index}.endMonth`)}
                        >
                          {months.map((month) => (
                            <option key={month} value={month}>
                              {month}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">
                          Năm kết thúc
                        </label>
                        <select
                          className="text-text_primary w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white bg-no-repeat bg-right"
                          style={{
                            backgroundImage:
                              'url(\'data:image/svg+xml;charset=US-ASCII,<svg width="12" height="7" xmlns="http://www.w3.org/2000/svg"><path d="M1 1l5 5 5-5" stroke="%23999" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>\')',
                            backgroundPosition: "right 1rem center",
                          }}
                          {...register(`experienceItems.${index}.endYear`)}
                        >
                          {years.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="mt-4 flex items-center text-red-500 text-sm"
                    >
                      <X className="w-4 h-4 mr-1" /> Xóa thông tin
                    </button>
                  )}
                </div>
              );
            })}

            <button
              type="button"
              onClick={() =>
                append({
                  id: undefined,
                  company: "",
                  position: "",
                  startMonth: defaultMonth,
                  startYear: defaultYear,
                  endMonth: defaultMonth,
                  endYear: defaultYear,
                  isCurrent: false,
                })
              }
              className="flex items-center justify-center text-blue-600 w-full py-3 border border-dashed border-blue-300 rounded-lg mb-8 hover:bg-blue-50"
            >
              <Plus className="w-5 h-5 mr-2" /> Thêm thông tin
            </button>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isMutating}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isMutating ? "Đang lưu..." : "Lưu thông tin"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditExperience;
