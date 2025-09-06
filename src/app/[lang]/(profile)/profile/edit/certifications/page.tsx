"use client";
import {Plus, Trash2} from "lucide-react";
import {useEffect, useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import LoadingMultiCircle from "@/components/LoadingMultiCircle";
import LoadingCircle from "@/components/LoadingCircle";
import useNotification from "@/hooks/useNotification";
import {useTranslation} from "react-i18next";
import {useHttpGet} from "@/hooks/useHttpGet";
import {useHttpPost} from "@/hooks/useHttpPost";
import {CertificatesResponse} from "lemmy-js-client/dist/types/Certificate";

const EditCertifications = () => {
  const {t} = useTranslation();

  const certificationSchema = z.object({
    certificates: z.array(
      z.object({
        id: z.union([z.string(), z.number()]).optional(),
        name: z.string().min(1, t("userEdit.certificatesPlaceholder")),
        achievedDate: z.string().min(1, t("userEdit.achievedDateRequired")),
        expiresDate: z.string().nullable(),
        url: z.string().url(t("userEdit.urlInvalid")),
      })
    ),
  });

  type CertificationFormData = z.infer<typeof certificationSchema>;

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<CertificationFormData>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      certificates: [],
    },
  });

  const {successMessage} = useNotification();
  const {fields, append, remove, replace} = useFieldArray({
    control,
    name: "certificates",
  });

  const [isFormReady, setIsFormReady] = useState(false);

  const {data: certData, isMutating: isCertLoading} =
    useHttpGet("getUserCertificates");

  const {execute: sendCertificates, isMutating} =
    useHttpPost("upsertUserCertificates");

  useEffect(() => {
    if (certData?.certificates) {
      const mapped = certData.certificates.map((item) => ({
        id: item.id ?? undefined,
        name: item.name,
        achievedDate: item.achievedDate,
        expiresDate: item.expiresDate,
        url: item.url,
      }));
      reset({certificates: mapped});
      replace(mapped);
      setIsFormReady(true);
    } else if (!isCertLoading) {
      setIsFormReady(true);
    }
  }, [certData, reset, replace, isCertLoading]);

  const onSubmit = async (formData: CertificationFormData) => {
    const body: CertificatesResponse = {
      certificates: formData.certificates.map((item) => ({
        id: typeof item.id === "number" ? item.id : item.id ? Number(item.id) : undefined,
        name: item.name,
        achievedDate: item.achievedDate,
        expiresDate: item.expiresDate,
        url: item.url,
      })),
    };

    try {
      await sendCertificates(body);
      successMessage("profile", "updateCertification");
    } catch (error) {
      console.error("Lỗi khi lưu chứng chỉ:", error);
    }
  };

  const isFetching = isCertLoading || !isFormReady;

  return (
    <div className="flex-1">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-blue-600 mb-8">
          {t("userEdit.certificatesAwards")}
        </h1>

        {isFetching ? (
          <div className="bg-white w-full h-40 flex justify-center items-center">
            <LoadingMultiCircle/>
          </div>
        ) : fields.length === 0 ? (
          <div className="bg-white w-full py-8 px-6 rounded-lg shadow-sm text-center">
            <p className="text-gray-500 mb-4">
              {t("userEdit.noCertificatesInfo")}
            </p>
            <button
              type="button"
              onClick={() =>
                append({
                  id: undefined,
                  name: "",
                  achievedDate: "",
                  expiresDate: null,
                  url: "",
                })
              }
              className="flex items-center justify-center text-blue-600 mx-auto py-3 px-6 border border-dashed border-blue-300 rounded-lg hover:bg-blue-50"
            >
              <Plus className="w-5 h-5 mr-2"/> {t("userEdit.addMoreButton")}
            </button>

            <div className="flex justify-end">
              <button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={isMutating}
                className="w-[128px] py-2 submit-button-custom"
              >
                {isMutating ? <LoadingCircle/> : t("userEdit.saveButton")}
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
                    {t("userEdit.certificatesName")}
                  </label>
                  <input
                    type="text"
                    className="text-text-primary w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t("userEdit.awardPlaceholder")}
                    {...register(`certificates.${index}.name`)}
                  />
                  {errors.certificates?.[index]?.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.certificates[index]?.name?.message}
                    </p>
                  )}
                </div>
                <div className="mt-4">
                  <label className="block text-gray-700 mb-2">
                    {t("userEdit.achievedDate")}
                  </label>
                  <input
                    type="date"
                    className="text-text-primary w-full px-4 py-2 border border-gray-300 rounded-md"
                    {...register(`certificates.${index}.achievedDate`)}
                  />
                  {errors.certificates?.[index]?.achievedDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.certificates[index]?.achievedDate?.message}
                    </p>
                  )}
                </div>
                <div className="mt-4">
                  <label className="block text-gray-700 mb-2">
                    {t("userEdit.expiresDate")}
                  </label>
                  <input
                    type="date"
                    className="text-text-primary w-full px-4 py-2 border border-gray-300 rounded-md"
                    {...register(`certificates.${index}.expiresDate`)}
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-gray-700 mb-2">
                    {t("userEdit.url")}
                  </label>
                  <input
                    type="url"
                    className="text-text-primary w-full px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="https://example.com"
                    {...register(`certificates.${index}.url`)}
                  />
                  {errors.certificates?.[index]?.url && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.certificates[index]?.url?.message}
                    </p>
                  )}
                </div>

                <div className="mt-4 w-full flex justify-end items-center">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="border-1 border-border-secondary w-fit flex flex-row px-3 rounded-[4px] items-center text-red-500 text-sm"
                  >
                    <Trash2 className="w-4"/>
                    <span className="ml-2 font-medium">{t("userEdit.deleteInfo")}</span>
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                append({
                  id: undefined,
                  name: "",
                  achievedDate: "",
                  expiresDate: null,
                  url: "",
                })
              }
              className="flex items-center justify-center text-blue-600 w-full py-3 border border-dashed border-blue-300 rounded-lg mb-8 hover:bg-blue-50"
            >
              <Plus className="w-5 h-5 mr-2"/> {t("userEdit.addInfo")}
            </button>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isMutating}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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

export default EditCertifications;
