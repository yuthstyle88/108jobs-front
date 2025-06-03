"use client";

import Loading from "@/components/Loading";
import { LanguageFile } from "@/constants/language";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";

export default function LocationPage() {
  const {
    data: individualLanguageData,
    isLoading,
    error,
  } = useGlobalTranslate(LanguageFile.INDIVIDUAL);

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading language data</div>;

  return (
    <div>
      <div className="border-1 border-border_primary rounded-lg bg-white py-6">
        <div className="border-b-1 px-6">
          <h2 className="text-[16px] font-medium mb-2 text-text_primary">
            {individualLanguageData?.section_individual_hiring}
          </h2>
          <p className="text-gray-600 mb-6 text-[14px] font-sans">
            {individualLanguageData?.subtitle_individual_hiring}
          </p>
        </div>
        <div className="flex flex-col gap-6 px-6 pt-6 font-sans">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text_primary font-semibold text-gray-600 mb-2">
                {individualLanguageData?.label_first_name}
              </label>
              <input
                type="text"
                className="border w-full border-gray-300 rounded-lg px-3 py-2 text-text_secondary font-sans"
                defaultValue="uykpfzno"
                placeholder={individualLanguageData?.placeholder_first_name}
              />
            </div>
            <div>
              <label className="block text-sm text-text_primary font-semibold text-gray-600 mb-2">
                {individualLanguageData?.label_last_name}
              </label>
              <input
                type="text"
                className="border w-full border-gray-300 rounded-lg px-3 py-2 text-text_secondary font-sans"
                defaultValue="uykpfzno"
                placeholder={individualLanguageData?.placeholder_last_name}
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
