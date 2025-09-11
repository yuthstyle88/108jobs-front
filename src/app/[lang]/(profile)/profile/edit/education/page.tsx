"use client";
import LoadingCircle from "@/components/LoadingCircle";
import LoadingMultiCircle from "@/components/LoadingMultiCircle";
import {LanguageFile} from "@/constants/language";
import {getNamespace} from "@/utils/i18nHelper";
import useNotification from "@/hooks/useNotification";
import {zodResolver} from "@hookform/resolvers/zod";
import {Plus, Trash2} from "lucide-react";
import {useEffect, useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {z} from "zod";
import {useHttpGet} from "@/hooks/useHttpGet";
import {useHttpPost} from "@/hooks/useHttpPost";

const EditEducation = () => {
  const userEditLanguage = getNamespace(LanguageFile.PROFILE_USER_EDIT);

  const educationSchema = z.object({
    education: z.array(
      z.object({
        id: z.number().optional(),
        school: z
          .string()
          .min(1, userEditLanguage.schoolNameRequire),
        major: z
          .string()
          .min(1, userEditLanguage.majorRequire),
      })
    ),
  });

  type EducationFormData = z.infer<typeof educationSchema>;

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      education: [],
    },
  });

  const { successMessage } = useNotification();

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "education",
  });

  const {
    data: educationData,
    isMutating: isEducationLoading,
  } = useHttpGet("getUserEducation");

  const { execute: sendEducation, isMutating: isUpdateMuting } =
    useHttpPost("upsertUserEducation");

  const [hasInitializedForm, setHasInitializedForm] = useState(false);

  useEffect(() => {
    if (educationData && educationData.education) {
      const mapped = educationData.education.map((edu) => ({
        id: typeof edu.id === "number" ? edu.id : Number(edu.id),
        school: edu.school,
        major: edu.major,
      }));
      reset({ education: mapped });
      replace(mapped);
      setHasInitializedForm(true);
    }
  }, [educationData, reset, replace]);

  const onSubmit = async (data: EducationFormData) => {
    const body = {
      education: data.education.map((item) => ({
        ...(typeof item.id === "number" ? { id: item.id } : {}),
        school: item.school,
        major: item.major,
        createdAt: new Date().toISOString(),
      })),
    };

    try {
      await sendEducation(body);
      successMessage("profile", "updateEducation");
    } catch (error) {
      console.error("Lỗi khi lưu thông tin học vấn:", error);
    }
  };


  const isFetchingInitialData = isEducationLoading || !hasInitializedForm;

  return (
    <div className="flex-1">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-primary mb-8">
          {userEditLanguage.education}
        </h1>

        {isFetchingInitialData ? (
          <div className="bg-white w-full h-40 flex justify-center items-center">
            <LoadingMultiCircle />
          </div>
        ) : fields.length === 0 ? (
          <div className="bg-white w-full py-8 px-6 rounded-lg shadow-sm text-center">
            <p className="text-gray-500 mb-4">
              {userEditLanguage.noEducationInfo}
            </p>
            <button
              type="button"
              onClick={() =>
                append({ id: undefined, school: "", major: "" })
              }
              className="flex items-center justify-center text-primary mx-auto py-3 px-6 border border-dashed border-blue-300 rounded-lg hover:bg-blue-50"
            >
              <Plus className="w-5 h-5 mr-2" />{" "}
              {userEditLanguage.addMoreButton}
            </button>
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={isUpdateMuting}
                className="min-w-[128px] px-2 py-2 submit-button-custom"
              >
                {isUpdateMuting ? <LoadingCircle /> : userEditLanguage.saveButton}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="bg-white rounded-lg p-6 mb-6 shadow-sm"
              >
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      {userEditLanguage.schoolName}
                    </label>
                    <input
                      type="text"
                      className="text-text-primary w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={userEditLanguage.schoolNamePlaceholder}
                      {...register(`education.${index}.school`)}
                    />
                    {errors.education?.[index]?.school && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.education[index]?.school?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      {userEditLanguage.major}
                    </label>
                    <input
                      type="text"
                      className="text-text-primary w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={userEditLanguage.majorPlaceholder}
                      {...register(`education.${index}.major`)}
                    />
                    {errors.education?.[index]?.major && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.education[index]?.major?.message}
                      </p>
                    )}
                  </div>
                </div>

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
            ))}

            <button
              type="button"
              onClick={() => append({ id: undefined, school: "", major: "" })}
              className="flex items-center justify-center text-primary w-full py-3 border border-dashed border-blue-300 rounded-lg mb-8 hover:bg-blue-50"
            >
              <Plus className="w-5 h-5 mr-2" /> {userEditLanguage.addInfo}
            </button>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isUpdateMuting}
                className="min-w-[128px] py-2 px-2 submit-button-custom whitespace-nowrap"
              >
                {isUpdateMuting ? <LoadingCircle /> : userEditLanguage.saveInfo}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditEducation;
