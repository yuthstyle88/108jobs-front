"use client";
import Error from "@/app/error";
import Loading from "@/components/Loading";
import { ProfileIcon } from "@/constants/icons";
import { LanguageFile } from "@/constants/language";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import Image from "next/image";

export default function BusinessPage() {
  const {
    data: companyInfoLanguageData,
    isLoading,
    error,
  } = useGlobalTranslate(LanguageFile.COMPANY);

  if (isLoading) return <Loading/>;
  if (error) return <Error />;

  return (
    <div>
      <div className="mb-6">
        <Image
          src={ProfileIcon.hiring_info}
          alt="hiring-info"
          className="w-full h-full rounded-tl-lg rounded-tr-lg"
        />
        <div className="px-3 py-2 bg-[#E3EDFD] rounded-br-lg rounded-bl-lg">
          <ul className="font-sans">
            {companyInfoLanguageData?.note_requirements?.map((note, index) => (
              <li key={index}>
                <p className="text-[0.75rem] text-third">• {note}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-1 border-border_primary rounded-lg bg-white py-6">
        <div className="border-b-1 px-6">
          <h2 className="text-[16px] font-medium mb-2 text-text_primary">
            {companyInfoLanguageData?.section_company_hiring}
          </h2>
          <p className="text-gray-600 mb-6 text-[14px] font-sans">
            {companyInfoLanguageData?.subtitle_company_hiring}
          </p>
        </div>
        <div className="p-6">
  <label className="block text-sm text-text_primary font-semibold text-gray-600 mb-2">
    {companyInfoLanguageData?.label_tax_id}
  </label>
  
  <div className="flex flex-col sm:flex-row gap-4">
    <input
      type="text"
      className="sm:flex-1 border border-gray-300 rounded-lg px-3 py-2"
      placeholder={companyInfoLanguageData?.placeholder_tax_id}
      defaultValue=""
    />
    <button className="sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap">
      {companyInfoLanguageData?.button_search_company}
    </button>
  </div>
</div>

      </div>
    </div>
  );
}
