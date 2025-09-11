"use client";
import {API_ROUTES_SELLER} from "@/api/endpoints";
import LoadingCircle from "@/components/LoadingCircle";
import LoadingMultiCircle from "@/components/LoadingMultiCircle";
import {LanguageFile} from "@/constants/language";
import {usePrivateFetch} from "@/hooks/api-hooks";
import {useHttpGet} from "@/hooks/useHttpGet";
import {useHttpPost} from "@/hooks/useHttpPost";
import useNotification from "@/hooks/useNotification";
import {LanguageProfilesResponse} from "@/lib/lemmy-js-client/dist/types/LanguageProfile";
import {getNamespace} from "@/utils/i18nHelper";
import {zodResolver} from "@hookform/resolvers/zod";
import {Plus, Trash2} from "lucide-react";
import {useEffect, useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {z} from "zod";

type LevelItem = {
  id: string;
  title: string;
};

const EditLanguages = () => {
  const userEditLanguage = getNamespace(LanguageFile.PROFILE_USER_EDIT);

  const languageSchema = z.object({
    languageProfiles: z.array(
      z.object({
        language: z.string().min(1, userEditLanguage.languagesRequire),
        level: z.string().min(1, "Vui lòng chọn cấp độ"),
      })
    ),
  });

  type LanguageFormData = z.infer<typeof languageSchema>;

  const levelMap: Record<string, string> = {
    Medium: userEditLanguage.mediumLevel,
    High: userEditLanguage.highLevel,
  };

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LanguageFormData>({
    resolver: zodResolver(languageSchema),
    defaultValues: {
      languageProfiles: [],
    },
  });

  const { successMessage } = useNotification();
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "languageProfiles",
  });

  const [isFormReady, setIsFormReady] = useState(false);

  const { data: levelData, isLoading: isLevelLoading } = usePrivateFetch<{
    levels: LevelItem[];
  }>(API_ROUTES_SELLER.profile.skillLevel);

  const {
    data: languageData,
    isMutating: isLangLoading,
  } = useHttpGet("getUserLanguages");

  const { execute: sendLanguages, isMutating } =
    useHttpPost("upsertUserLanguages");

  useEffect(() => {
    if (!isLangLoading && !isLevelLoading) {
      const mapped =
        languageData?.languageProfiles.map((item) => ({
          language: item.lang,
          level: item.level,
        })) || [];

      reset({ languageProfiles: mapped });
      replace(mapped);
      setIsFormReady(true);
    }
  }, [languageData, levelData, isLangLoading, isLevelLoading, reset, replace]);

  const onSubmit = async (data: LanguageFormData) => {
    if (!levelData) return;

    const body: LanguageProfilesResponse = {
      languageProfiles: data.languageProfiles.map((item) => ({
        lang: item.language,
        level: item.level,
      })),
    };

    try {
      await sendLanguages(body);
      successMessage("profile", "updateLanguage");
    } catch (error) {
      console.error("Lỗi khi lưu ngôn ngữ:", error);
    }
  };

  const levelOptions = levelData?.levels || [];

  const isFetching = isLangLoading || isLevelLoading || !isFormReady;

  return (
    <div className="flex-1">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-primary mb-8">
          {userEditLanguage.languages}
        </h1>

        {isFetching ? (
          <div className="bg-white w-full h-40 flex justify-center items-center">
            <LoadingMultiCircle />
          </div>
        ) : fields.length === 0 ? (
          <div className="bg-white w-full py-8 px-6 rounded-lg shadow-sm text-center">
            <p className="text-gray-500 mb-4">{userEditLanguage.noLanguagesInfo}.</p>
            <button
              type="button"
              onClick={() =>
                append({
                  language: "",
                  level: levelOptions[0]?.title || "",
                })
              }
              className="flex items-center justify-center text-primary mx-auto py-3 px-6 border border-dashed border-blue-300 rounded-lg hover:bg-blue-50"
            >
              <Plus className="w-5 h-5 mr-2" /> {userEditLanguage.addMoreButton}
            </button>

            <div className="flex justify-end">
              <button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={isMutating}
                className="w-[128px] py-2 submit-button-custom"
              >
                {isMutating ? <LoadingCircle /> : userEditLanguage.saveButton}
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
                      {userEditLanguage.languages}
                    </label>
                    <input
                      type="text"
                      className="text-text-primary w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={userEditLanguage.languagePlaceholder}
                      {...register(`languageProfiles.${index}.language`)}
                    />
                    {errors.languageProfiles?.[index]?.language && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.languageProfiles[index]?.language?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      {userEditLanguage.level}
                    </label>
                    <select
                      className="text-text-primary w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      {...register(`languageProfiles.${index}.level`)}
                    >
                      {levelOptions.map((lvl) => (
                        <option key={lvl.id} value={lvl.title}>
                          {levelMap[lvl.title] || lvl.title}
                        </option>
                      ))}
                    </select>
                    {errors.languageProfiles?.[index]?.level && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.languageProfiles[index]?.level?.message}
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
              onClick={() =>
                append({
                  language: "",
                  level: levelOptions[0]?.title || "",
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
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-[#063a68]"
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

export default EditLanguages;
