"use client";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePrivateFetch, usePrivatePost } from "@/hooks/api-hooks";
import { API_ROUTES_SELLER } from "@/api/endpoints";
import LoadingMultiCircle from "@/components/LoadingMultiCircle";
import LoadingCircle from "@/components/LoadingCircle";
import useNotification from "@/hooks/useNotification";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { LanguageFile } from "@/constants/language";

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

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const defaultMonth = months[currentDate.getMonth()];
const defaultYear = currentYear.toString();
const years = Array.from({ length: 40 }, (_, i) =>
  (currentYear - i).toString()
);

const EditExperience = () => {
  const { data: userEditLanguage, isLoading: isExperienceLoading } =
    useGlobalTranslate(LanguageFile.PROFILE_USER_EDIT);

  const experienceSchema = z.object({
    experienceItems: z.array(
      z.object({
        id: z.string().optional(),
        company: z.string().min(1, userEditLanguage?.company_name_required),
        position: z.string().min(1, userEditLanguage?.job_title_required),
        startMonth: z.string(),
        startYear: z.string(),
        endMonth: z.string().nullable(),
        endYear: z.string().nullable(),
        isCurrent: z.boolean(),
      })
    ),
  });

  type ExperienceFormData = z.infer<typeof experienceSchema>;

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: { experienceItems: [] },
  });

  const { success_message } = useNotification();
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "experienceItems",
  });

  const { data, isLoading } = usePrivateFetch<{
    work_experiences: ExperienceFromServer[];
  }>(API_ROUTES_SELLER.profile.work_experience);

  const { trigger: sendExperience, isMutating } = usePrivatePost(
    API_ROUTES_SELLER.profile.work_experience
  );

  const [isFormReady, setIsFormReady] = useState(false);

  useEffect(() => {
    if (data?.work_experiences) {
      const mapped = data.work_experiences.map((item) => ({
        id: item.id,
        company: item.company_name,
        position: item.position,
        startMonth: item.start_month,
        startYear: item.start_year.toString(),
        endMonth: item.end_month ?? defaultMonth,
        endYear: item.end_year?.toString() ?? defaultYear,
        isCurrent: item.is_current,
      }));

      reset({ experienceItems: mapped });
      replace(mapped);
      setIsFormReady(true);
    }
  }, [data, reset, replace]);

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
      success_message("profile", "update_work_experience");
    } catch (error) {
      console.error("Lỗi khi lưu kinh nghiệm:", error);
    }
  };

  const isFetching = isLoading || !isFormReady || isExperienceLoading;

  return (
    <div className="flex-1">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-blue-600 mb-8">
          {userEditLanguage?.work_experience}
        </h1>

        {isFetching ? (
          <div className="bg-white w-full h-40 flex justify-center items-center">
            <LoadingMultiCircle />
          </div>
        ) : fields.length === 0 ? (
          <div className="bg-white w-full py-8 px-6 rounded-lg shadow-sm text-center">
            <p className="text-gray-500 mb-4">
              {userEditLanguage?.no_work_experience_info}
            </p>
            <button
              type="button"
              onClick={() => {
                append({
                  id: undefined,
                  company: "",
                  position: "",
                  startMonth: defaultMonth,
                  startYear: defaultYear,
                  endMonth: defaultMonth,
                  endYear: defaultYear,
                  isCurrent: false,
                });
                setIsFormReady(true);
              }}
              className="flex items-center justify-center text-blue-600 mx-auto py-3 px-6 border border-dashed border-blue-300 rounded-lg hover:bg-blue-50"
            >
              <Plus className="w-5 h-5 mr-2" />{" "}
              {userEditLanguage?.add_more_button}
            </button>
            <div className="flex justify-end">
              <button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={isMutating}
                className="min-w-[128px] px-2 py-2 submit-button-custom"
              >
                {isMutating ? <LoadingCircle /> : userEditLanguage?.save_button}
              </button>
            </div>
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
                        {userEditLanguage?.company_name}
                      </label>
                      <input
                        type="text"
                        className="text-text_primary w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={userEditLanguage?.company_name_placeholder}
                        {...register(`experienceItems.${index}.company`)}
                      />
                      {errors.experienceItems?.[index]?.company && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.experienceItems[index]?.company?.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">
                        {userEditLanguage?.job_title}
                      </label>
                      <input
                        type="text"
                        className="text-text_primary w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={userEditLanguage?.job_title_placeholder}
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
                        {userEditLanguage?.start_month}
                      </label>
                      <select
                        className="text-text_primary w-full px-4 py-2 border border-gray-300 rounded-md"
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
                        {userEditLanguage?.start_year}
                      </label>
                      <select
                        className="text-text_primary w-full px-4 py-2 border border-gray-300 rounded-md"
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
                        className="form-checkbox h-5 w-5 text-blue-600 rounded"
                        {...register(`experienceItems.${index}.isCurrent`)}
                      />
                      <span className="ml-2 text-gray-700">
                        {userEditLanguage?.current_workplace}
                      </span>
                    </label>
                  </div>

                  {!isCurrent && (
                    <div className="grid grid-cols-2 gap-6 mb-4">
                      <div>
                        <label className="block text-gray-700 mb-2">
                          {userEditLanguage?.end_month}
                        </label>
                        <select
                          className="text-text_primary w-full px-4 py-2 border border-gray-300 rounded-md"
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
                          {userEditLanguage?.end_year}
                        </label>
                        <select
                          className="text-text_primary w-full px-4 py-2 border border-gray-300 rounded-md"
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

                  <div className="mt-4 w-full flex justify-end items-center">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="border-1 border-border_secondary w-fit flex flex-row px-3 rounded-[4px] items-center text-red-500 text-sm"
                    >
                      <Trash2 className="w-4" />
                      <span className="ml-2 font-medium">
                        {userEditLanguage?.delete_info}
                      </span>
                    </button>
                  </div>
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
              <Plus className="w-5 h-5 mr-2" /> {userEditLanguage?.add_info}
            </button>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isMutating}
                className="min-w-[128px] px-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isMutating ? <LoadingCircle /> : userEditLanguage?.save_info}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditExperience;
