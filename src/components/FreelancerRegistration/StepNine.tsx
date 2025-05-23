import { AssetIcon } from "@/constants/icons";
import Image from "next/image";
import React from "react";
import BankCard from "./components/BankCard";
import { ApplyToBeFreelancerLanguage } from "@/types/language";

interface StepNightProps {
  nextStep: () => void;
  applyFreelancerLanguage:Partial<ApplyToBeFreelancerLanguage> | undefined | null;
}

const StepNight: React.FC<StepNightProps> = ({
  nextStep,
  applyFreelancerLanguage
}) => {

  return (
    <div className="py-8 md:p-0 h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 h-full">
        <div className="flex flex-col justify-center px-12">
          <div className="bg-[#ffffff] text-[#1A1F2C] shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">
                {applyFreelancerLanguage?.final_verification_step}
              </h3>
              <p className="text-sm text-[#8E9196]">
                {applyFreelancerLanguage?.transfer_verification_instruction}
              </p>
            </div>
            <div className="p-6 pt-0 space-y-6">
              <div className="space-y-2">
                <BankCard
                  accountName="Bangkok Freelancer"
                  accountNumber="1234567890123"
                />
                <p className="text-xs text-[#8E9196] mt-2">
                  {applyFreelancerLanguage?.transfer_to_verify}
                </p>
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
            <div className="flex items-center p-6 pt-0 justify-center text-xs text-[#8E9196]">
              <p>{applyFreelancerLanguage?.pay_later_verification}</p>
            </div>
          </div>
        </div>
        <div className="w-full h-full step2-gradient relative z-0 overflow-hidden hidden md:block">
          <Image
            src={AssetIcon.logo_icon}
            alt="icon"
            className="w-full h-full"
            width={500}
            height={500}
          />
        </div>
      </div>
    </div>
  );
};

export default StepNight;
