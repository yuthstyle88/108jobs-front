"use client";

import Error from "@/app/error";
import Loading from "@/components/Loading";
import { LanguageFile } from "@/constants/language";
import { getNamespace } from "@/utils/i18nHelper";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";

export default function LocationPage() {
  const {
    data: individualLanguageData,
    isLoading,
    error,
  } = useGlobalTranslate(LanguageFile.INDIVIDUAL);

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <div>
      <div className="border-1 border-border-primary rounded-lg bg-white py-6">
        <div className="border-b-1 px-6">
          <h2 className="text-[16px] font-medium mb-2 text-text-primary">
            {individualLanguageData?.sectionIndividualHiring}
          </h2>
          <p className="text-gray-600 mb-6 text-[14px] font-sans">
            {individualLanguageData?.subtitleIndividualHiring}
          </p>
        </div>
        <div className="flex flex-col gap-6 px-6 pt-6 font-sans">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-primary font-semibold text-gray-600 mb-2">
                {individualLanguageData?.labelFirstName}
              </label>
              <input
                type="text"
                className="border w-full border-gray-300 rounded-lg px-3 py-2 text-text-secondary font-sans"
                defaultValue="uykpfzno"
                placeholder={individualLanguageData?.placeholderFirstName}
              />
            </div>
            <div>
              <label className="block text-sm text-text-primary font-semibold text-gray-600 mb-2">
                {individualLanguageData?.labelLastName}
              </label>
              <input
                type="text"
                className="border w-full border-gray-300 rounded-lg px-3 py-2 text-text-secondary font-sans"
                defaultValue="uykpfzno"
                placeholder={individualLanguageData?.placeholderLastName}
              />
            </div>
          </div>
          <div className="self-end w-fit">
            <button className="w-full bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
