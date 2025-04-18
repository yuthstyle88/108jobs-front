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

// Schema
const skillSchema = z.object({
  skillItems: z.array(
    z.object({
      id: z.string().optional(),
      skill: z.string().min(1, "Vui lòng nhập kỹ năng"),
      level: z.string().min(1, "Vui lòng chọn cấp độ"),
    })
  ),
});

type SkillFormData = z.infer<typeof skillSchema>;

type SkillLevel = {
  id: string;
  title: string;
};

type SkillFromServer = {
  id: string;
  skill_name: string;
  level_name: string;
};

const levelMap: Record<string, string> = {
  Medium: "Trình độ trung bình",
  High: "Chuyên môn cao",
};

const EditSkills = () => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: { skillItems: [] },
  });

  const { success_message } = useNotification();
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "skillItems",
  });

  const [isFormReady, setIsFormReady] = useState(false);

  const { data: levelData, isLoading: isLevelLoading } = usePrivateFetch<{
    levels: SkillLevel[];
  }>(API_ROUTES_SELLER.profile.skill_level);

  const {
    data: skillData,
    isLoading: isSkillLoading,
  } = usePrivateFetch<{ skill_profiles: SkillFromServer[] }>(
    API_ROUTES_SELLER.profile.skills
  );

  const { trigger: sendSkills, isMutating } = usePrivatePost(
    API_ROUTES_SELLER.profile.skills
  );

  useEffect(() => {
    if (!isSkillLoading && !isLevelLoading) {
      const mapped =
        skillData?.skill_profiles.map((item) => ({
          id: item.id,
          skill: item.skill_name,
          level: item.level_name,
        })) || [];

      reset({ skillItems: mapped });
      replace(mapped);
      setIsFormReady(true);
    }
  }, [skillData, levelData, isSkillLoading, isLevelLoading, reset, replace]);

  const onSubmit = async (data: SkillFormData) => {
    if (!levelData) return;

    const body = {
      skills: data.skillItems.map((item) => {
        const level = levelData.levels.find((lvl) => lvl.title === item.level);
        return {
          ...(item.id ? { id: item.id } : {}),
          skill_name: item.skill,
          level_name: item.level,
          level_id: level?.id || "",
        };
      }),
    };

    try {
      await sendSkills(body);
      success_message("profile", "update_skill", null);
    } catch (err) {
      console.error("Lỗi khi lưu kỹ năng:", err);
    }
  };

  const levelOptions = levelData?.levels || [];

  const isFetching = isSkillLoading || isLevelLoading || !isFormReady;

  return (
    <div className="flex-1">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-blue-600 mb-8">Kỹ năng</h1>

        {isFetching ? (
          <div className="bg-white w-full h-40 flex justify-center items-center">
            <LoadingMultiCircle />
          </div>
        ) : fields.length === 0 ? (
          <div className="bg-white w-full py-8 px-6 rounded-lg shadow-sm text-center">
            <p className="text-gray-500 mb-4">Chưa có kỹ năng nào.</p>
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
              <Plus className="w-5 h-5 mr-2" /> Thêm thông tin
            </button>

            <div className="flex justify-end">
              <button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={isMutating}
                className="w-[128px] py-2 submit-button-custom"
              >
                {isMutating ? <LoadingCircle /> : "Lưu thông tin"}
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
                    <label className="block text-gray-700 mb-2">Kỹ năng</label>
                    <input
                      type="text"
                      className="text-text_primary w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <label className="block text-gray-700 mb-2">Cấp độ</label>
                    <select
                      className="text-text_primary w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="border-1 border-border_secondary w-fit flex flex-row px-3 rounded-[4px] items-center text-red-500 text-sm"
                  >
                    <Trash2 className="w-4" />
                    <span className="ml-2 font-medium">Xóa thông tin</span>
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
              <Plus className="w-5 h-5 mr-2" /> Thêm thông tin
            </button>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isMutating}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {isMutating ? <LoadingCircle /> : "Lưu thông tin"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditSkills;
