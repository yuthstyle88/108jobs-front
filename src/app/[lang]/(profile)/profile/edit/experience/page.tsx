"use client";
import {Plus, Trash2} from "lucide-react";
import {useEffect, useMemo, useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import LoadingMultiCircle from "@/components/LoadingMultiCircle";
import LoadingCircle from "@/components/LoadingCircle";
import useNotification from "@/hooks/useNotification";
import {getNamespace} from "@/utils/i18nHelper";
import {LanguageFile} from "@/constants/language";
import {useHttpGet} from "@/hooks/useHttpGet";
import {useHttpPost} from "@/hooks/useHttpPost";
import {WorkExperience, WorkExperiencesResponse} from "lemmy-js-client";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const monthToMM = (m: string) => {
  const idx = months.indexOf(m);
  return idx >= 0 ? String(idx + 1).padStart(2, "0") : "01";
};

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const defaultMonth = months[currentDate.getMonth()];
const defaultYear = String(currentYear);
const years = Array.from({ length: 40 }, (_, i) => String(currentYear - i));

const makeSchema = (lang: any) =>
  z.object({
    experienceItems: z.array(
      z.object({
        id: z.number().nullable().optional(),
        company: z.string().min(1, lang.companyNameRequired),
        position: z.string().min(1, lang.jobTitleRequired),
        startMonth: z.string(),
        startYear: z.string(),    
        endMonth: z.string(),     
        endYear: z.string(),    
        isCurrent: z.boolean(),
      })
    ),
  });

type ExperienceFormData = z.infer<ReturnType<typeof makeSchema>>;

const EditExperience = () => {
  const userEditLanguage = getNamespace(LanguageFile.PROFILE_USER_EDIT);

  const experienceSchema = useMemo(
    () => makeSchema(userEditLanguage),
    [userEditLanguage]
  );

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

  const { successMessage } = useNotification();
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "experienceItems",
  });

  const {
    data: experienceData,
    isMutating: isLoading,
  } = useHttpGet("getUserExperience");

  const { execute: sendExperience, isMutating } =
    useHttpPost("upsertUserExperience");

  const [isFormReady, setIsFormReady] = useState(false);

  useEffect(() => {
    if (experienceData?.workExperience) {
      const mapped = experienceData.workExperience.map((item) => ({
        id: item.id ?? undefined,
        company: item.companyName,
        position: item.position,
        startMonth: item.startMonth,
        startYear: String(item.startYear),
        endMonth: item.endMonth || defaultMonth,
        endYear: String(item.endYear ?? currentYear),
        isCurrent: item.isCurrent,
      }));
      reset({ experienceItems: mapped });
      replace(mapped);
      setIsFormReady(true);
    }
  }, [experienceData, reset, replace]);

  const watchExperience = watch("experienceItems");
  useEffect(() => {
    watchExperience.forEach((item, index) => {
      if (!item.endMonth) {
        setValue(`experienceItems.${index}.endMonth`, defaultMonth);
      }
      if (!item.endYear) {
        setValue(`experienceItems.${index}.endYear`, defaultYear);
      }
    });
  }, [watchExperience, setValue]);

  const onSubmit = async (formData: ExperienceFormData) => {
    const payloadItems: WorkExperience[] = formData.experienceItems.map(
      (item) => {
        const startYearNum = Number(item.startYear);
        const endYearNum = Number(item.endYear);
        const startDate = `${startYearNum}-${monthToMM(item.startMonth)}-01`;

        return {
          id: item.id ?? undefined,
          companyName: item.company,
          position: item.position,
          startDate,
          startMonth: item.startMonth,
          startYear: startYearNum,
          endMonth: item.endMonth,    
          endYear: endYearNum,       
          isCurrent: item.isCurrent,
        };
      }
    );

    const body: WorkExperiencesResponse = {
      workExperience: payloadItems,
    };

    try {
      await sendExperience(body);
      successMessage("profile", "updateWorkExperience");
    } catch (error) {
      console.error("Lỗi khi lưu kinh nghiệm:", error);
    }
  };

  const isFetching = isLoading || !isFormReady;

  return (
    <div className="flex-1">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-primary mb-8">
          {userEditLanguage.workExperience}
        </h1>

        {isFetching ? (
          <div className="bg-white w-full h-40 flex justify-center items-center">
            <LoadingMultiCircle />
          </div>
        ) : fields.length === 0 ? (
          <div className="bg-white w-full py-8 px-6 rounded-lg shadow-sm text-center">
            <p className="text-gray-500 mb-4">
              {userEditLanguage.noWorkExperienceInfo}
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
              className="flex items-center justify-center text-primary mx-auto py-3 px-6 border border-dashed border-blue-300 rounded-lg hover:bg-blue-50"
            >
              <Plus className="w-5 h-5 mr-2" /> {userEditLanguage.addMoreButton}
            </button>
            <div className="flex justify-end">
              <button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={isMutating}
                className="min-w-[128px] px-2 py-2 submit-button-custom"
              >
                {isMutating ? <LoadingCircle /> : userEditLanguage.saveButton}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            {fields.map((field, index) => {
              const isCurrent = watch(`experienceItems.${index}.isCurrent`);
              return (
                <div
                  key={field.id} 
                  className="bg-white rounded-lg p-6 mb-6 shadow-sm"
                >
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-gray-700 mb-2">
                        {userEditLanguage.companyName}
                      </label>
                      <input
                        type="text"
                        className="text-text-primary w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={userEditLanguage.companyNamePlaceholder}
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
                        {userEditLanguage.jobTitle}
                      </label>
                      <input
                        type="text"
                        className="text-text-primary w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={userEditLanguage.jobTitlePlaceholder}
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
                        {userEditLanguage.startMonth}
                      </label>
                      <select
                        className="text-text-primary w-full px-4 py-2 border border-gray-300 rounded-md"
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
                        {userEditLanguage.startYear}
                      </label>
                      <select
                        className="text-text-primary w-full px-4 py-2 border border-gray-300 rounded-md"
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
                        className="form-checkbox h-5 w-5 text-primary rounded"
                        {...register(`experienceItems.${index}.isCurrent`)}
                      />
                      <span className="ml-2 text-gray-700">
                        {userEditLanguage.currentWorkplace}
                      </span>
                    </label>
                  </div>

                  {!isCurrent && (
                    <div className="grid grid-cols-2 gap-6 mb-4">
                      <div>
                        <label className="block text-gray-700 mb-2">
                          {userEditLanguage.endMonth}
                        </label>
                        <select
                          className="text-text-primary w-full px-4 py-2 border border-gray-300 rounded-md"
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
                          {userEditLanguage.endYear}
                        </label>
                        <select
                          className="text-text-primary w-full px-4 py-2 border border-gray-300 rounded-md"
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
                      className="border-1 border-border-secondary w-fit flex flex-row px-3 rounded-[4px] items-center text-red-500 text-sm"
                    >
                      <Trash2 className="w-4" />
                      <span className="ml-2 font-medium">
                        {userEditLanguage.deleteInfo}
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
              className="flex items-center justify-center text-primary w-full py-3 border border-dashed border-blue-300 rounded-lg mb-8 hover:bg-blue-50"
            >
              <Plus className="w-5 h-5 mr-2" /> {userEditLanguage.addInfo}
            </button>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isMutating}
                className="min-w-[128px] px-2 py-2 bg-primary text-white rounded-lg hover:bg-[#063a68] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isMutating ? <LoadingCircle /> : userEditLanguage.saveInfo}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditExperience;
