import React from "react";
import PreviewProfile from "./components/PreviewProfile";
import { FreelancerFormData } from "@/types/applyFreelancer";
import { ApplyToBeFreelancerLanguage } from "@/types/language";

interface StepThreeProps {
  formData: {
    freelancer_type: string;
    username: string;
    bio: string;
    display_name: string;
    avatar_url: string | null;
  };
  updateFormData: (data: Partial<FreelancerFormData>) => void;
  nextStep: () => void;
  applyFreelancerLanguage:Partial<ApplyToBeFreelancerLanguage> | undefined | null;
}

const StepThree: React.FC<StepThreeProps> = ({
  formData,
  updateFormData,
  nextStep,
  applyFreelancerLanguage
}) => {
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ username: e.target.value });
  };

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ display_name: e.target.value });
  };

  const handleFreelanceTypeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateFormData({
      freelancer_type: e.target.value as "Parttime" | "Fulltime",
    });
  };
  const isFormValid = () => {
    return (
      formData.username.trim() !== "" && formData.display_name.trim() !== ""
    );
  };

  return (
    <div className="pt-8 md:p-0 h-full">
      <div className="flex flex-col md:flex-row h-full">
        <div className="flex flex-col items-center justify-center px-4 md:w-1/2 mb-6 md:mb-0">
          <div className="max-w-[440px]">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-text_primary">
                {applyFreelancerLanguage?.create_freelancer_profile}
              </h2>
              <p className="text-text_secondary mt-2">
                {applyFreelancerLanguage?.setup_basic_info}
              </p>
            </div>
            <div className="mb-4 w-full">
              <label className="block text-sm text-text_primary font-semibold mb-2">
                {applyFreelancerLanguage?.username}
              </label>
              <p className="text-xs text-text_secondary mb-2">
                {applyFreelancerLanguage?.username_description}
              </p>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  Fastwork.co/user/
                </span>
                <input
                  type="text"
                  value={formData.username}
                  onChange={handleUsernameChange}
                  className="w-full pl-36 text-text_primary pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third"
                  placeholder={applyFreelancerLanguage?.username}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-text_primary font-semibold mb-2">
                {applyFreelancerLanguage?.display_name}
              </label>
              <p className="text-xs text-text_secondary mb-2">
                {applyFreelancerLanguage?.display_name_tip}
              </p>
              <input
                type="text"
                value={formData.display_name}
                onChange={handleDisplayNameChange}
                className="w-full px-3 py-2 text-text_primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third"
                placeholder={applyFreelancerLanguage?.display_name}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-text_primary font-semibold mb-2">
                {applyFreelancerLanguage?.freelance_type}
              </label>
              <p className="text-xs text-text_secondary mb-2">
                {applyFreelancerLanguage?.freelance_type_instruction}
              </p>
              <div className="flex gap-4">
                <label
                  className={`flex items-center border rounded-md px-4 py-2 cursor-pointer ${
                    formData.freelancer_type === "Parttime" && "border-third"
                  }`}
                >
                  <input
                    type="radio"
                    name="workType"
                    value="Parttime"
                    checked={formData.freelancer_type === "Parttime"}
                    onChange={handleFreelanceTypeChange}
                    className="mr-2 text-third"
                  />
                  <span className="text-text_primary">{applyFreelancerLanguage?.part_time}</span>
                </label>
                <label
                  className={`flex items-center border rounded-md px-4 py-2 cursor-pointer ${
                    formData.freelancer_type === "Fulltime" && "border-third"
                  }`}
                >
                  <input
                    type="radio"
                    name="workType"
                    value="Fulltime"
                    checked={formData.freelancer_type === "Fulltime"}
                    onChange={handleFreelanceTypeChange}
                    className="mr-2 text-third"
                  />
                  <span className="text-text_primary">{applyFreelancerLanguage?.full_time}</span>
                </label>
              </div>
              <div className="w-full mt-8">
                <button
                  onClick={nextStep}
                  disabled={!isFormValid()}
                  className={`submit-button py-3 flex justify-center items-center ${
                    !isFormValid()
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-third text-white"
                  }`}
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
        </div>
        <PreviewProfile language={applyFreelancerLanguage} formData={formData} />
      </div>
    </div>
  );
};

export default StepThree;
