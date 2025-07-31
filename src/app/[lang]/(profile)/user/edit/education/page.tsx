"use client";
import {API_ROUTES_SELLER} from "@/api/endpoints";
import LoadingCircle from "@/components/LoadingCircle";
import LoadingMultiCircle from "@/components/LoadingMultiCircle";
import {LanguageFile} from "@/constants/language";
import {usePrivateFetch, usePrivatePost} from "@/hooks/api-hooks";
import {getNamespace} from "@/utils/i18nHelper";
import useNotification from "@/hooks/useNotification";
import {zodResolver} from "@hookform/resolvers/zod";
import {Plus, Trash2} from "lucide-react";
import {useEffect, useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {z} from "zod";

type EducationFromServer = {
  id: string;
  schoolName: string;
  major: string;
};

const EditEducation = () => {
  const userEditLanguage = getNamespace(LanguageFile.PROFILE_USER_EDIT);

  const educationSchema = z.object({
    educationItems: z.array(
      z.object({
        id: z.string().optional(),
        school: z.string().min(1,
          userEditLanguage.schoolNameRequire),
        major: z.string().min(1,
          userEditLanguage.majorRequire),
      })
    ),
  });

  type EducationFormData = z.infer<typeof educationSchema>;

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      educationItems: [],
    },
  });

  const {successMessage} = useNotification();
  const {fields, append, remove, replace} = useFieldArray({
    control,
    name: "educationItems",
  });

  const {data: educationData, isLoading} = usePrivateFetch<{
    educations: EducationFromServer[];
  }>(API_ROUTES_SELLER.profile.education);

  const {trigger: sendEducation, isMutating: isUpdateMuting} = usePrivatePost(
    API_ROUTES_SELLER.profile.education
  );

  const [hasInitializedForm, setHasInitializedForm] = useState(false);

  useEffect(() => {
      if (educationData?.educations) {
        const mapped = educationData.educations.map((edu) => ({
          id: edu.id,
          school: edu.schoolName,
          major: edu.major,
        }));

        reset({educationItems: mapped});
        replace(mapped);
        setHasInitializedForm(true);
      }
    },
    [educationData, reset, replace]);

  const onSubmit = async(data: EducationFormData) => {
    const body = {
      educations: data.educationItems.map((item) => ({
        ...(item.id ? {id: item.id} : {}),
        schoolName: item.school,
        major: item.major,
      })),
    };

    try {
      await sendEducation(body);
      successMessage("profile",
        "updateEducation");
    } catch (error) {
      console.error("Lỗi khi lưu thông tin học vấn:",
        error);
    }
  };

  const isFetchingInitialData =
    isLoading || !hasInitializedForm;

  return (
    <div className="flex-1">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-blue-600 mb-8">
          {userEditLanguage.education}
        </h1>

        {isFetchingInitialData ? (
          <div className="bg-white w-full h-40 flex justify-center items-center">
            <LoadingMultiCircle/>
          </div>
        ) : fields.length === 0 ? (
          <div className="bg-white w-full py-8 px-6 rounded-lg shadow-sm text-center">
            <p className="text-gray-500 mb-4">
              {userEditLanguage.noEducationInfo}
            </p>
            <button
              type="button"
              onClick={() => append({id: undefined, school: "", major: ""})}
              className="flex items-center justify-center text-blue-600 mx-auto py-3 px-6 border border-dashed border-blue-300 rounded-lg hover:bg-blue-50"
            >
              <Plus className="w-5 h-5 mr-2"/>{" "}
              {userEditLanguage.addMoreButton}
            </button>
            <div className="flex justify-end">
              <button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={isUpdateMuting}
                className="min-w-[128px] px-2 py-2 submit-button-custom"
              >
                {isUpdateMuting ? (
                  <LoadingCircle/>
                ) : (
                  userEditLanguage.saveButton
                )}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            {fields.map((item, index) => (
              <div
                key={item.id || index}
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
                      {...register(`educationItems.${index}.school`)}
                    />
                    {errors.educationItems?.[index]?.school && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.educationItems[index]?.school?.message}
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
                      {...register(`educationItems.${index}.major`)}
                    />
                    {errors.educationItems?.[index]?.major && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.educationItems[index]?.major?.message}
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
                    <Trash2 className="w-4"/>
                    <span className="ml-2 font-medium">
                      {userEditLanguage.deleteInfo}
                    </span>
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => append({id: undefined, school: "", major: ""})}
              className="flex items-center justify-center text-blue-600 w-full py-3 border border-dashed border-blue-300 rounded-lg mb-8 hover:bg-blue-50"
            >
              <Plus className="w-5 h-5 mr-2"/> {userEditLanguage.addInfo}
            </button>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isUpdateMuting}
                className="min-w-[128px] py-2 px-2 submit-button-custom whitespace-nowrap"
              >
                {isUpdateMuting ? (
                  <LoadingCircle/>
                ) : (
                  userEditLanguage.saveInfo
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditEducation;
