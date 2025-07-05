"use client";
import StepEight from "@/components/FreelancerRegistration/StepEight";
import StepFive from "@/components/FreelancerRegistration/StepFive";
import StepFour from "@/components/FreelancerRegistration/StepFour";
import StepNine from "@/components/FreelancerRegistration/StepNine";
import StepOne from "@/components/FreelancerRegistration/StepOne";
import StepSeven from "@/components/FreelancerRegistration/StepSeven";
import StepSix from "@/components/FreelancerRegistration/StepSix";
import StepTen from "@/components/FreelancerRegistration/StepTen";
import StepThree from "@/components/FreelancerRegistration/StepThree";
import StepTwo from "@/components/FreelancerRegistration/StepTwo";
import Loading from "@/components/Loading";
import { AssetIcon } from "@/constants/icons";
import { LanguageFile } from "@/constants/language";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { useUserStore } from "@/store/useUserProfileStore";
import { FreelancerFormData } from "@/types/applyFreelancer";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFetchUser } from "./hooks/useFetchUserProfile";
import { useFormStorage } from "./hooks/useFormStorage";
import Error from "@/app/error";

const FreelancerRegistration = () => {
  const { user: userData } = useUserStore();
  const { isLoading, isError } = useFetchUser();
  const [isInitialized, setIsInitialized] = useState(false);

  const {
      data: applyFreelancerLanguage,
      isLoading:isLanguageLoading,
      error,
    } = useGlobalTranslate(LanguageFile.APPLY_TO_BE_FREELANCER);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FreelancerFormData>({
    sourceTypes: [],
    avatar_url: null,
    username: "",
    display_name: "",
    bio: "",
    freelancer_type: "Parttime",
    apply_fee: false,
    birth_date: "",
    email: "",
    countryType: "Thailand",
    country: "Thailand",

    card_number: "",
    card_address_details: "",
    card_zip_code: "",
    card_subdistrict_or_district: "",
    card_district_or_subdistrict: "",
    card_province: "",

    front_card: null,
    back_card: null,
    title: "",
    name: "",
    surname: "",
    address_details: "",
    province: "",
    subdistrict_or_district: "",
    district_or_subdistrict: "",
    zip_code: "",
  });

  const { saveFormToStorage } = useFormStorage<FreelancerFormData>({
    setFormData,
    currentStep,
    setCurrentStep,
  });

  const updateFormData = (data: Partial<FreelancerFormData>) => {
    const updated = { ...formData, ...data };
    setFormData(updated);
    saveFormToStorage(updated);
  };

  const nextStep = () => {
    setCurrentStep((prev) => {
      const newStep = Math.min(prev + 1, 10);
      localStorage.setItem("freelancerCurrentStep", newStep.toString());
      return newStep;
    });
  };

  const prevStep = () => {
    setCurrentStep((prev) => {
      const newStep = Math.max(prev - 1, 1);
      localStorage.setItem("freelancerCurrentStep", newStep.toString());
      return newStep;
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (userData && !isInitialized) {
      const userCountry = userData.address?.country ?? "Thailand";
      const countryType: "Thailand" | "Foreign" =
        userCountry === "Thailand" ? "Thailand" : "Foreign";
  
      setFormData((prev) => {
        const updated = {
          ...prev,
          avatar_url: userData.user.avatar_url || prev.avatar_url,
          username: userData.user.username || prev.username,
          display_name: userData.user.display_name || prev.display_name,
          birth_date: userData.user.birth_date
            ? new Date(userData.user.birth_date).toISOString().split("T")[0]
            : prev.birth_date,
          email: userData.contact?.email || prev.email,
          countryType,
          country: userCountry,
        };
        saveFormToStorage(updated);
        return updated;
      });
  
      setIsInitialized(true); 
    }
  }, [userData, isInitialized, saveFormToStorage]);

  if (isLoading || isLanguageLoading) return <Loading />;
  if (isError || error) return <Error/>;

  const renderStep = () => {
    const stepProps = { formData, updateFormData, nextStep,applyFreelancerLanguage };
    switch (currentStep) {
      case 1:
        return <StepOne {...stepProps} />;
      case 2:
        return <StepTwo {...stepProps} />;
      case 3:
        return <StepThree {...stepProps} />;
      case 4:
        return <StepFour {...stepProps} />;
      case 5:
        return <StepFive {...stepProps} />;
      case 6:
        return <StepSix {...stepProps} />;
      case 7:
        return <StepSeven {...stepProps} />;
      case 8:
        return <StepEight {...stepProps} />;
      case 9:
        return <StepNine applyFreelancerLanguage={applyFreelancerLanguage} nextStep={nextStep} />;
      case 10:
        return <StepTen applyFreelancerLanguage={applyFreelancerLanguage} formData={formData} currentStep={currentStep} />;
      default:
        return <StepOne {...stepProps} />;
    }
  };

  return (
    <div className="md:h-[100dvh] min-h-screen bg-white items-center">
      <div className="sm:w-[80vw] w-full h-full m-0 sm:mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <button onClick={prevStep} className="text-third">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <div className="flex items-center">
            <Image src={AssetIcon.logo_blue} alt="Logo" className="w-full" />
          </div>
          <button className="text-gray-400">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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

        <div className="mb-8 relative">
          <div className="w-full h-1 bg-gray-200" />
          <div
            className="absolute top-0 left-0 h-1 bg-third"
            style={{ width: `${(currentStep / 9) * 100}%` }}
          />
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
