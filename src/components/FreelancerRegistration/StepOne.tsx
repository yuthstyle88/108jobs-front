import { ApplyFreelancerIcon } from "@/constants/icons";
import { ApplyToBeFreelancerLanguage } from "@/types/language";
import Image from "next/image";
import React from "react";

interface StepOneProps {
  formData: {
    sourceTypes: string[];
  };
  updateFormData: (data: { sourceTypes: string[] }) => void;
  nextStep: () => void;
  applyFreelancerLanguage:Partial<ApplyToBeFreelancerLanguage> | undefined | null;
}

const StepOne: React.FC<StepOneProps> = ({
  formData,
  updateFormData,
  nextStep,
  applyFreelancerLanguage
}) => {
  const sources = [
    { id: "google", name: "Google", icon: ApplyFreelancerIcon.google },
    { id: "instagram", name: "Instagram", icon: ApplyFreelancerIcon.ig },
    { id: "tiktok", name: "TikTok", icon: ApplyFreelancerIcon.tiktok },
    { id: "facebook", name: "Facebook", icon: ApplyFreelancerIcon.facebook },
    { id: "twitter", name: "X (Twitter)", icon: ApplyFreelancerIcon.x },
    { id: "youtube", name: "Youtube", icon: ApplyFreelancerIcon.youtube },
    { id: "linkedin", name: "LinkedIn", icon: ApplyFreelancerIcon.linkedin },
    { id: "ck", name: "CK", icon: ApplyFreelancerIcon.ck },
    { id: "friend", name: "มีคนแนะนำ", icon: ApplyFreelancerIcon.referral },
  ];

  const toggleSource = (sourceId: string) => {
    if (formData.sourceTypes.includes(sourceId)) {
      updateFormData({
        sourceTypes: formData.sourceTypes.filter((id) => id !== sourceId),
      });
    } else {
      updateFormData({
        sourceTypes: [...formData.sourceTypes, sourceId],
      });
    }
  };

  const isSelected = (sourceId: string) =>
    formData.sourceTypes.includes(sourceId);

  return (
    <div className="p-2 md:p-6 flex flex-col h-full justify-center items-center">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text_primary">
          {applyFreelancerLanguage?.how_did_you_hear_about_us} 😊
        </h2>
        <p className="text-text_secondary mt-2">{applyFreelancerLanguage?.multiple_options}</p>
      </div>

      <div className="grid grid-cols-[repeat(2,minmax(0px,1fr))] md:grid-cols-[repeat(3,minmax(0px,1fr))] gap-4 mb-8">
        {sources.map((source) => (
          <div
            key={source.id}
            onClick={() => toggleSource(source.id)}
            className={`flex flex-col items-center justify-center px-4 sm:px-10 py-6 gap-4 rounded-lg cursor-pointer transition-colors duration-200 ${
              isSelected(source.id)
                ? "bg-secondary border-1 border-third text-black"
                : "bg-gray-100 border-1 text-text_primary hover:bg-gray-200"
            }`}
          >
            <Image src={source.icon} alt={source.id} width={24} height={24} />
            <span className="text-sm">{source.name}</span>
          </div>
        ))}
        <div className="flex flex-row gap-4 col-start-1 col-end-[-1] w-full pt-8">
          <button onClick={nextStep} className="whitespace-nowrap text-gray-400 px-6 py-2 rounded-md text-third border-gray-200 border-1 hover:bg-gray-200 duration-300">
            {applyFreelancerLanguage?.skip}
          </button>
          <button
            onClick={nextStep}
            className="flex items-center justify-center submit-button-skip py-2 px-4"
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
  );
};

export default StepOne;
