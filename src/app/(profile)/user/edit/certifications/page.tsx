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

type CertificationFromServer = {
  id: string;
  name: string;
  profile_id: string;
};

const EditCertifications = () => {
  const { data: userEditLanguage, isLoading: isCertLoading } =
    useGlobalTranslate(LanguageFile.PROFILE_USER_EDIT);

  const certificationSchema = z.object({
    certificationItems: z.array(
      z.object({
        id: z.string().optional(),
        name: z.string().min(1, "Vui lòng nhập tên chứng chỉ hoặc giải thưởng"),
      })
    ),
  });

  type CertificationFormData = z.infer<typeof certificationSchema>;

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CertificationFormData>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      certificationItems: [],
    },
  });

  const { success_message } = useNotification();
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "certificationItems",
  });

  const [isFormReady, setIsFormReady] = useState(false);

  const { data, isLoading } = usePrivateFetch<{
    cert_or_awards: CertificationFromServer[];
  }>(API_ROUTES_SELLER.profile.certificate);

  const { trigger: sendCertificates, isMutating } = usePrivatePost(
    API_ROUTES_SELLER.profile.certificate
  );

  useEffect(() => {
    if (data?.cert_or_awards) {
      const mapped = data.cert_or_awards.map((item) => ({
        id: item.id,
        name: item.name,
      }));
      reset({ certificationItems: mapped });
      replace(mapped);
      setIsFormReady(true);
    } else if (!isLoading) {
      setIsFormReady(true);
    }
  }, [data, reset, replace, isLoading]);

  const onSubmit = async (formData: CertificationFormData) => {
    const body = {
      cert_or_awards: formData.certificationItems.map((item) => ({
        ...(item.id ? { id: item.id } : {}),
        name: item.name,
      })),
    };

    try {
      await sendCertificates(body);
      success_message("profile", "update_certification", null);
    } catch (error) {
      console.error("Lỗi khi lưu chứng chỉ:", error);
    }
  };

  const isFetching = isLoading || !isFormReady || isCertLoading;

  return (
    <div className="flex-1">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-blue-600 mb-8">
          {userEditLanguage?.certificates_awards}
        </h1>

        {isFetching ? (
          <div className="bg-white w-full h-40 flex justify-center items-center">
            <LoadingMultiCircle />
          </div>
        ) : fields.length === 0 ? (
          <div className="bg-white w-full py-8 px-6 rounded-lg shadow-sm text-center">
            <p className="text-gray-500 mb-4">
              Chưa có chứng chỉ hoặc giải thưởng.
            </p>
            <button
              type="button"
              onClick={() => append({ id: undefined, name: "" })}
              className="flex items-center justify-center text-blue-600 mx-auto py-3 px-6 border border-dashed border-blue-300 rounded-lg hover:bg-blue-50"
            >
              <Plus className="w-5 h-5 mr-2" /> {userEditLanguage?.add_more_button}
            </button>

            <div className="flex justify-end">
              <button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={isMutating}
                className="w-[128px] py-2 submit-button-custom"
              >
                {isMutating ? <LoadingCircle /> : userEditLanguage?.save_button}
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
                <div>
                  <label className="block text-gray-700 mb-2">
                    Tên giải thưởng
                  </label>
                  <input
                    type="text"
                    className="text-text_primary w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={userEditLanguage?.award_placeholder}
                    {...register(`certificationItems.${index}.name`)}
                  />
                  {errors.certificationItems?.[index]?.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.certificationItems[index]?.name?.message}
                    </p>
                  )}
                </div>

                <div className="mt-4 w-full flex justify-end items-center">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="border-1 border-border_secondary w-fit flex flex-row px-3 rounded-[4px] items-center text-red-500 text-sm"
                  >
                    <Trash2 className="w-4" />
                    <span className="ml-2 font-medium">{userEditLanguage?.delete_info}</span>
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => append({ id: undefined, name: "" })}
              className="flex items-center justify-center text-blue-600 w-full py-3 border border-dashed border-blue-300 rounded-lg mb-8 hover:bg-blue-50"
            >
              <Plus className="w-5 h-5 mr-2" /> {userEditLanguage?.add_info}
            </button>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isMutating}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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

export default EditCertifications;
