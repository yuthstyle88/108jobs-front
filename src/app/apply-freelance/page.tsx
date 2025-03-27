"use client";
import StepEight from "@/components/FreelancerRegistration/StepEight";
import StepFive from "@/components/FreelancerRegistration/StepFive";
import StepFour from "@/components/FreelancerRegistration/StepFour";
import StepNine from "@/components/FreelancerRegistration/StepNine";
import StepOne from "@/components/FreelancerRegistration/StepOne";
import StepSeven from "@/components/FreelancerRegistration/StepSeven";
import StepSix from "@/components/FreelancerRegistration/StepSix";
import StepThree from "@/components/FreelancerRegistration/StepThree";
import StepTwo from "@/components/FreelancerRegistration/StepTwo";
import { AssetIcon } from "@/constants/icons";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const FreelancerRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    sourceTypes: [] as string[],
    profileImage: null as string | null,
    username: "",
    displayName: "",
    bio: "",
    workType: "Part-time",
    nationalIdFront: null as string | null,
    nationalIdBack: null as string | null,
    title: "",
    firstName: "",
    lastName: "",
    idNumber: "",
    address: "",
    district: "",
    province: "",
    postalCode: "",
    birthDay: "",
    birthMonth: "",
    birthYear: "",
    email: "",
    nationality: "เวียดนาม",
    currentCity: "",
    termsAccepted: false,
  });

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 9));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepOne
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <StepTwo
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <StepThree
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 4:
        return (
          <StepFour
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 5:
        return (
          <StepFive
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 6:
        return (
          <StepSix
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 7:
        return (
          <StepSeven
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 8:
        return (
          <StepEight
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 9:
        return (
          <StepNine
            formData={formData}
            updateFormData={updateFormData}
            prevStep={prevStep}
          />
        );
      default:
        return (
          <StepOne
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
          />
        );
    }
  };

  return (
    <div className="h-[100dvh] bg-white items-center">
      <div className="w-[80vw] h-full max-h-[calc(100%-6rem)] m-0 mx-auto pt-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Link href="/" className="text-third">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </Link>
          </div>
          <div className="flex items-center">
            <Image src={AssetIcon.logo_blue} alt="Group" className="w-full" />
          </div>
          <div>
            <button className="text-gray-400">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="mb-8">
          <div className="relative">
            <div className="w-full h-1 bg-gray-200"></div>
            <div
              className="absolute top-0 left-0 h-1 bg-third"
              style={{ width: `${(currentStep / 9) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="h-full max-h-[calc(100%-6rem)] w-full">
          <div className="bg-white rounded-lg shadow-jobCard h-full">
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerRegistration;
