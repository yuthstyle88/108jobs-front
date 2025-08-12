"use client";
import {Plus, Trash2} from "lucide-react";
import {useEffect, useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {usePrivateFetch, usePrivatePost} from "@/hooks/api-hooks";
import {API_ROUTES_SELLER} from "@/api/endpoints";
import LoadingMultiCircle from "@/components/LoadingMultiCircle";
import LoadingCircle from "@/components/LoadingCircle";
import useNotification from "@/hooks/useNotification";
import {useTranslation} from "react-i18next";
import { useHttpGet } from "@/hooks/useHttpGet";

type SkillLevel = {
  id: string;
  title: string;
};

type SkillFromServer = {
  id: string;
  skillName: string;
  levelName: string;
};

const EditSkills = () => {
  const {t} = useTranslation()
  const skillSchema = z.object({
    skillItems: z.array(
      z.object({
        id: z.string().optional(),
        skill: z.string().min(1,
          t("userEdit.skillsRequire")),
        level: z.string().min(1,
          "Vui lòng chọn cấp độ"),
      })
    ),
  });

  type SkillFormData = z.infer<typeof skillSchema>;

  const levelMap: Record<string, string> = {
    Medium: t("userEdit.mediumLevel") || "",
    High: t("userEdit.highLevel") || "",
  };

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {skillItems: []},
  });

  const {successMessage} = useNotification();
  const {fields, append, remove, replace} = useFieldArray({
    control,
    name: "skillItems",
  });

  const [isFormReady, setIsFormReady] = useState(false);

  const {data: levelData, isLoading: isLevelLoading} = usePrivateFetch<{
    levels: SkillLevel[];
  }>(API_ROUTES_SELLER.profile.skillLevel);

  const {
        data: skillData,
        isMutating: isSkillLoading,
      } = useHttpGet("getUserSkills");


  const {trigger: sendSkills, isMutating} = usePrivatePost(
    API_ROUTES_SELLER.profile.skills
  );

  useEffect(() => {
      if (!isSkillLoading && !isLevelLoading) {
        const mapped =
          skillData?.skills.map((item) => ({
            id: item.id,
            skill: item.skillName,
            level: item.skillName,
          })) || [];

        reset({skillItems: mapped});
        replace(mapped);
        setIsFormReady(true);
      }
    },
    [skillData, levelData, isSkillLoading, isLevelLoading, reset, replace]);

  const onSubmit = async(data: SkillFormData) => {
    if (!levelData) return;

    const body = {
      skills: data.skillItems.map((item) => {
        const level = levelData.levels.find((lvl) => lvl.title === item.level);
        return {
          ...(item.id ? {id: item.id} : {}),
          skillName: item.skill,
          levelName: item.level,
          levelId: level?.id || "",
        };
      }),
    };

    try {
      await sendSkills(body);
      successMessage("profile",
        "updateSkill");
    } catch (err) {
      console.error("Lỗi khi lưu kỹ năng:",
        err);
    }
  };

  const levelOptions = levelData?.levels || [];

  const isFetching =
    isSkillLoading || isLevelLoading || !isFormReady;

  return (
    <div className="flex-1">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-blue-600 mb-8">
          {t("userEdit.skills")}
        </h1>

        {isFetching ? (
          <div className="bg-white w-full h-40 flex justify-center items-center">
            <LoadingMultiCircle/>
          </div>
        ) : fields.length === 0 ? (
          <div className="bg-white w-full py-8 px-6 rounded-lg shadow-sm text-center">
            <p className="text-gray-500 mb-4">{t("userEdit.noSkillsInfo")}.</p>
            <button
              type="button"
              onClick={() =>
                append({
                  id: undefined,
                  skill: "",
                  level: levelOptions[0]?.title || "",
                })
              }
              className="flex items-center justify-center text-blue-600 mx-auto py-3 px-6 border border-dashed border-blue-300 rounded-lg hover:bg-blue-50"
            >
              <Plus className="w-5 h-5 mr-2"/> {t("userEdit.addInfo")}
            </button>

            <div className="flex justify-end">
              <button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={isMutating}
                className="min-w-[128px] px-2 py-2 submit-button-custom"
              >
                {isMutating ? <LoadingCircle/> : t("userEdit.saveInfo")}
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
                      {t("userEdit.skills")}
                    </label>
                    <input
                      type="text"
                      className="text-text-primary w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ví dụ: Photoshop, AutoCAD"
                      {...register(`skillItems.${index}.skill`)}
                    />
                    {errors.skillItems?.[index]?.skill && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.skillItems[index]?.skill?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">{t("userEdit.level")}</label>
                    <select
                      className="text-text-primary w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      {...register(`skillItems.${index}.level`)}
                    >
                      {levelOptions.map((level) => (
                        <option key={level.id} value={level.title}>
                          {levelMap[level.title] || level.title}
                        </option>
                      ))}
                    </select>
                    {errors.skillItems?.[index]?.level && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.skillItems[index]?.level?.message}
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
                      {t("userEdit.deleteButton")}
                    </span>
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                append({
                  id: undefined,
                  skill: "",
                  level: levelOptions[0]?.title || "",
                })
              }
              className="flex items-center justify-center text-blue-600 w-full py-3 border border-dashed border-blue-300 rounded-lg mb-8 hover:bg-blue-50"
            >
              <Plus className="w-5 h-5 mr-2"/>{" "}
              {t("userEdit.addMoreButton")}
            </button>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isMutating}
                className="min-w-[128px] px-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {isMutating ? <LoadingCircle/> : t("userEdit.saveInfo")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditSkills;
