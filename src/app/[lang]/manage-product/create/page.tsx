"use client";
import {LanguageFile} from "@/constants/language";
import {getNamespace} from "@/utils/i18nHelper";
import {useRouter} from "next/navigation";

const CreateService = () => {
  const router = useRouter();

  const createJobLanguage = getNamespace(LanguageFile.SELLER_CREATE_JOBS);

  return (
    <div className="min-h-screen pt-[4.5rem] bg-[#F8F9FB]">
      <div className="container mx-auto px-6 py-6">
        {/* Step indicator (step 1 active) */}
        <div className="max-w-4xl mx-auto flex justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
          <div
            className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 z-0"
            style={{width: `0%`}}
          ></div>

          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="z-10 flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 1
                    ? "bg-blue-600 text-white"
                    : "bg-white border-2 border-gray-300 text-gray-400 opacity-60"
                }`}
              >
                {step}
              </div>
              <span
                className={`text-xs mt-2 ${
                  step === 1 ? "text-gray-700" : "text-gray-500"
                }`}
              >
                {step === 1 && createJobLanguage?.step1}
                {step === 2 && createJobLanguage?.step2}
                {step === 3 && createJobLanguage?.step3}
                {step === 4 && createJobLanguage?.step4}
                {step === 5 && createJobLanguage?.step5}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default CreateService;
