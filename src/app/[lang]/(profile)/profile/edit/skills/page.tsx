"use client";
import {Plus, Trash2} from "lucide-react";
import {useEffect, useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {usePrivateFetch} from "@/hooks/api-hooks";
import {API_ROUTES_SELLER} from "@/api/endpoints";
import LoadingMultiCircle from "@/components/LoadingMultiCircle";
import LoadingCircle from "@/components/LoadingCircle";
import useNotification from "@/hooks/useNotification";
import {useTranslation} from "react-i18next";
import {useHttpGet} from "@/hooks/useHttpGet";
import {useHttpPost} from "@/hooks/useHttpPost";
import {SkillsResponse} from "lemmy-js-client/dist/types/Skill";

type SkillLevel = {
  id: string;
  title: string;
};

const EditSkills = () => {
  const {t} = useTranslation();

  const skillSchema = z.object({
    skills: z.array(
      z.object({
        id: z.union([z.string(), z.number()]).optional(),
        skill: z.string().min(1, t("userEdit.skillsRequire")),
        level: z.string().min(1, "Vui lòng chọn cấp độ"),
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
    defaultValues: {skills: []},
  });

  const {successMessage} = useNotification();
  const {fields, append, remove, replace} = useFieldArray({
    control,
    name: "skills",
  });

  const [isFormReady, setIsFormReady] = useState(false);

  const {data: levelData, isLoading: isLevelLoading} = usePrivateFetch<{ levels: SkillLevel[] }>(
    API_ROUTES_SELLER.profile.skillLevel
  );

  const {data: skillData, isMutating: isSkillLoading} =
    useHttpGet("getUserSkills");

  const {execute: sendSkills, isMutating} =
    useHttpPost("upsertUserSkills");

  useEffect(() => {
    if (!isSkillLoading && !isLevelLoading) {
      const mapped =
        skillData?.skills.map((item) => {
          const title = levelData?.levels.find(l => l.id === String(item.levelId))?.title || "";
          return {
            id: item.id ?? undefined,
            skill: item.skillName,
            level: title,
          };
        }) || [];

      reset({skills: mapped});
      replace(mapped);
      setIsFormReady(true);
    }
  }, [skillData, levelData, isSkillLoading, isLevelLoading, reset, replace]);

  const onSubmit = async (data: SkillFormData) => {
    if (!levelData) return;

    const body: SkillsResponse = {
      skills: data.skills.map((item) => {
        const level = levelData.levels.find((lvl) => lvl.title === item.level);
        return {
          id: typeof item.id === "number" ? item.id : item.id ? Number(item.id) : undefined,
          skillName: item.skill,
          levelId: level ? Number(level.id) : 0,
        };
      }),
    };

    try {
      await sendSkills(body);
      successMessage("profile", "updateSkill");
    } catch (err) {
      console.error("Lỗi khi lưu kỹ năng:", err);
    }
  };

  const levelOptions = levelData?.levels || [];
  const isFetching = isSkillLoading || isLevelLoading || !isFormReady;

  return (
    <div className="flex-1">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-primary mb-8">
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
              className="flex items-center justify-center text-primary mx-auto py-3 px-6 border border-dashed border-blue-300 rounded-lg hover:bg-blue-50"
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
                      {...register(`skills.${index}.skill`)}
                    />
                    {errors.skills?.[index]?.skill && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.skills[index]?.skill?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">{t("userEdit.level")}</label>
                    <select
                      className="text-text-primary w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      {...register(`skills.${index}.level`)}
                    >
                      {levelOptions.map((level) => (
                        <option key={level.id} value={level.title}>
                          {levelMap[level.title] || level.title}
                        </option>
                      ))}
                    </select>
                    {errors.skills?.[index]?.level && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.skills[index]?.level?.message}
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
              className="flex items-center justify-center text-primary w-full py-3 border border-dashed border-blue-300 rounded-lg mb-8 hover:bg-blue-50"
            >
              <Plus className="w-5 h-5 mr-2"/> {t("userEdit.addMoreButton")}
            </button>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isMutating}
                className="min-w-[128px] px-2 py-2 bg-primary text-white rounded-lg hover:bg-[#063a68]"
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
