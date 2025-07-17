"use client";

import { API_ROUTES_SELLER } from "@/api/endpoints";
import LoadingBlur from "@/components/LoadingBlur";
import LoadingCircle from "@/components/LoadingCircle";
import { LanguageFile } from "@/constants/language";
import { usePrivatePost } from "@/hooks/api-hooks";
import { useTranslateFile } from "@/hooks/translation/useTranslateFile";
import { JobType } from "@/types/job";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSchema = (lang: any) =>
  z.object({
    worksteps: z
      .array(
        z.object({
          id: z.string().uuid().nullable().optional(),
          description: z
            .string()
            .min(
              1,
              lang?.workflowDescriptionError || "Vui lòng nhập mô tả bước"
            ),
        })
      )
      .min(2, lang?.workstepsMin || "Cần ít nhất 2 bước"),
  });

type FormData = z.infer<ReturnType<typeof getSchema>>;

type Props = {
  job: JobType;
  nextStep: () => void;
  prevStep: () => void;
  mutate: () => void;
  setIsFormDirty?: (dirty: boolean) => void;
};

const Step4WorkSteps = ({
  job,
  nextStep,
  prevStep,
  mutate,
  setIsFormDirty,
}: Props) => {
  const createJobLanguage = useTranslateFile(LanguageFile.SELLER_CREATE_JOBS);

  const schema = useMemo(
    () => getSchema(createJobLanguage),
    [createJobLanguage]
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    defaultValues: {
      worksteps: [
        { id: null, description: "" },
        { id: null, description: "" },
      ],
    },
    resolver: zodResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "worksteps",
  });

  const { trigger: sendWorksteps, isMutating } = usePrivatePost(
    API_ROUTES_SELLER.job.postJobStep4
  );

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        jobId: job.id,
        worksteps: data.worksteps.map((step, idx) => ({
          id: step.id ?? null,
          description: step.description,
          sortOrder: idx + 1,
        })),
      };

      await sendWorksteps(payload);
      await mutate();
      nextStep();
    } catch (err) {
      console.error("Submit step 4 error:", err);
    }
  };

  useEffect(() => {
    setIsFormDirty?.(isDirty);
  }, [isDirty, setIsFormDirty]);

  useEffect(() => {
    if (job?.worksteps?.length) {
      reset({
        worksteps: job.worksteps.map((step) => ({
          id: step.id,
          description: step.description,
        })),
      });
    }
  }, [job, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      {isMutating && <LoadingBlur text={"Đang lưu dữ liệu"} />}
      <h2 className="text-[32px] font-medium text-text_primary">
        {createJobLanguage?.workflowTitle}
      </h2>

      <div className="space-y-8 max-w-4xl mb-6">
        <p className="text-sm text-gray-600">
          {createJobLanguage?.defineWorkStepsDescription}
        </p>

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="border border-gray-200 rounded-lg p-6 relative"
          >
            <div className="absolute -top-3 left-4 bg-blue-600 text-white text-[16px] font-medium px-3 py-1 rounded-full">
              {createJobLanguage?.stepLabel} {index + 1}
            </div>

            {fields.length > 2 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <Trash2 className="w-5 h-5 text-red-600" />
              </button>
            )}

            <div className="mt-4">
              <label className="block text-base font-medium text-gray-700 mb-1">
                {createJobLanguage?.workflowDescriptionLabel}
              </label>
              <textarea
                className="text-text_primary w-full p-3 border border-gray-300 rounded-lg min-h-24"
                placeholder={
                  createJobLanguage?.workflowDescriptionPlaceholder
                }
                {...register(`worksteps.${index}.description`)}
              ></textarea>
              {errors.worksteps?.[index]?.description && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.worksteps[index]?.description?.message}
                </p>
              )}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ id: null, description: "" })}
          className="flex items-center gap-2 text-blue-600 font-medium"
        >
          <Plus className="w-4 h-4" />
          {createJobLanguage?.addStep}
        </button>

        {errors.worksteps && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600">
            {errors.worksteps.message?.toString()}
          </div>
        )}

        <div className="flex justify-between">
          <button
            type="button"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            onClick={prevStep}
          >
            {createJobLanguage?.backButton}
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            disabled={isMutating}
          >
            {isMutating ? <LoadingCircle /> : createJobLanguage?.nextButton}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Step4WorkSteps;
