"use client";
import Error from "@/app/error";
import Loading from "@/components/Loading";
import { LanguageFile } from "@/constants/language";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { Upload } from "lucide-react";
import Link from "next/link";

const CommitmentLetter = () => {
  const {
    data: sellerCommitmentLanguage,
    isLoading,
    error,
  } = useGlobalTranslate(LanguageFile.SELLER_COMMITMENT_LETTER);

  const { data: global } = useGlobalTranslate(LanguageFile.GLOBAL);

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
          {sellerCommitmentLanguage?.taxInfoTitle}
        </h2>
        <p className="text-sm text-gray-500">
          {sellerCommitmentLanguage?.taxInfoDescription}
        </p>
      </div>

      <div className="p-6">
        <p className="text-sm text-gray-700 mb-6">
          {sellerCommitmentLanguage?.incomeTaxDescription}
        </p>

        <ol className="mb-8 space-y-8">
          <li className="flex">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">
              1
            </div>
            <div className="ml-4">
              <h3 className="text-base font-medium text-gray-800">
                {sellerCommitmentLanguage?.step1Title}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                {sellerCommitmentLanguage?.step1Note}
              </p>
              <input
                type="text"
                placeholder={sellerCommitmentLanguage?.step1Placeholder}
                className="text-text_primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </li>

          <li className="flex">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">
              2
            </div>
            <div className="ml-4">
              <h3 className="text-base font-medium text-gray-800">
                {sellerCommitmentLanguage?.step2Title}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                {sellerCommitmentLanguage?.step2Note} {""}
                <Link prefetch={false} href="#" className="text-blue-600 font-medium">
                  {sellerCommitmentLanguage?.step2Link}
                </Link>
              </p>
            </div>
          </li>

          <li className="flex">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">
              3
            </div>
            <div className="ml-4">
              <h3 className="text-base font-medium text-gray-800">
                {sellerCommitmentLanguage?.step3Title}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                {sellerCommitmentLanguage?.step3Note}
              </p>
            </div>
          </li>

          <li className="flex">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">
              4
            </div>
            <div className="ml-4">
              <h3 className="text-base font-medium text-gray-800">
                {sellerCommitmentLanguage?.step4Title}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                {sellerCommitmentLanguage?.step4Note}
              </p>
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <Upload className="w-5 h-5 mr-2" />
                {sellerCommitmentLanguage?.uploadButton}
              </button>
            </div>
          </li>
        </ol>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {global?.buttonSave}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommitmentLetter;
