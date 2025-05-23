import React from "react";
import PreviewProfile from "./components/PreviewProfile";
import { ApplyToBeFreelancerLanguage } from "@/types/language";

interface StepFourProps {
  formData: {
    bio: string;
    username: string;
    display_name: string;
    avatar_url: string | null;
  };
  updateFormData: (data: { bio: string }) => void;
  nextStep: () => void;
  applyFreelancerLanguage:Partial<ApplyToBeFreelancerLanguage> | undefined | null;
}

const StepFour: React.FC<StepFourProps> = ({
  formData,
  updateFormData,
  nextStep,
  applyFreelancerLanguage
}) => {
  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData({ bio: e.target.value });
  };


  return (
    <div className="pt-8 md:p-0 h-full">
      <div className="flex flex-col md:flex-row h-full">
        <div className="flex flex-col items-center justify-center px-4 md:w-1/2 mb-6 md:mb-0">
          <div className="max-w-[440px]">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-text_primary">
                {applyFreelancerLanguage?.bio_instruction}
              </h2>
              <p className="text-text_secondary mt-2">
                {applyFreelancerLanguage?.bio_details}
              </p>
            </div>
            <div className="w-full md:pr-4 mb-6 md:mb-0">
              <div className="mb-4">
                <label className="block text-sm text-text_primary font-semibold mb-2">
                  {applyFreelancerLanguage?.freelancer_introduction}
                </label>
                <textarea
                  value={formData.bio}
                  onChange={handleBioChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third h-44 resize text-text_primary"
                  placeholder={applyFreelancerLanguage?.experience_skills_instruction}
                ></textarea>
                <p className="text-xs text-text_secondary mt-2">
                  {applyFreelancerLanguage?.experience_skills_details}
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-4 mt-8">
              <button
                onClick={nextStep}
                className="px-3 py-2 whitespace-nowrap border border-gray-300 rounded-lg text-text_primary"
              >
                {applyFreelancerLanguage?.skip}
              </button>
              <button
                onClick={nextStep}
                className="submit-button-skip py-3 flex justify-center items-center"
              >
                {applyFreelancerLanguage?.save_and_continue}
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <PreviewProfile language={applyFreelancerLanguage} formData={formData} />
      </div>
    </div>
  );
};

export default StepFour;
