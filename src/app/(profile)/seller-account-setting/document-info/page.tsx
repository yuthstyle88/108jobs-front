"use client";

import Error from "@/app/error";
import Loading from "@/components/Loading";
import { LanguageFile } from "@/constants/language";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";

const DocumentInfo = () => {
  const {
    data: sellerDocumentLanguage,
    isLoading,
    error,
  } = useGlobalTranslate(LanguageFile.SELLER_DOCUMENT_INFO);

  const { data: global } = useGlobalTranslate(
      LanguageFile.GLOBAL
    );

  const handleSave = () => {
    console.log("Saving account settings");
    // Logic to save data would go here
  };
  if (isLoading) return <Loading />;
  if (error) return <Error />;
  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <div className="border-b border-gray-200 p-5">
        <h2 className="text-lg font-medium text-gray-800">
          {sellerDocumentLanguage?.title}
        </h2>
        <p className="text-sm text-gray-500">
          {sellerDocumentLanguage?.subtitle}
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {sellerDocumentLanguage?.firstname_label}
            </label>
            <input
              type="text"
              placeholder={sellerDocumentLanguage?.firstname_placeholder}
              className="text-text_primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {sellerDocumentLanguage?.lastname_label}
            </label>
            <input
              type="text"
              placeholder={sellerDocumentLanguage?.lastname_placeholder}
              className="text-text_primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {global?.button_save}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentInfo;
