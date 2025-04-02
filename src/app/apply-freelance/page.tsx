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
import Loading from "@/components/Loading";
import { AssetIcon } from "@/constants/icons";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFetchUser } from "./hooks/useFetchUserProfile";
import { useUserStore } from "@/store/useUserProfileStore";

const FreelancerRegistration = () => {
  const { user: userData } = useUserStore();
  const { isLoading, isError } = useFetchUser();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    sourceTypes: [] as string[],
    avatar_url: null as string | null,
    username: "",
    display_name: "",
    bio: "",
    freelancer_type: "Parttime",
    apply_fee: false,
    birth_date: "",
    email: "",
    country: "Thailand",

    card_number: "",
    card_address_details: "",
    card_zip_code: "",
    card_subdistrict_or_district: "",
    card_district_or_subdistrict: "",
    card_province: "",

    front_card: null as string | null,
    back_card: null as string | null,
    title: "",
    name: "",
    surname: "",
    address_details: "",
    province: "",
    subdistrict_or_district: "",
    district_or_subdistrict: "",
    zip_code: "",
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

  useEffect(() => {
    if (userData) {
      setFormData((prev) => ({
        ...prev,
        avatar_url: userData.user.avatar_url || null,
        username: userData.user.username || prev.username,
        display_name: userData.user.display_name || prev.display_name,
        birth_date: userData.user.birth_date
          ? new Date(userData.user.birth_date).toISOString().split("T")[0]
          : prev.birth_date,
        email: userData.contact?.email || prev.email,
        country: userData.address?.country || prev.country,
        province: userData.address?.province || prev.province,
      }));
    }
  }, [userData]);

  if (isLoading) return <Loading />;
  if (isError) return <p>Error loading profile</p>;

  console.log("userData", formData);

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
          />
        );
      case 3:
        return (
          <StepThree
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
          />
        );
      case 4:
        return (
          <StepFour
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
          />
        );
      case 5:
        return (
          <StepFive
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
          />
        );
      case 6:
        return (
          <StepSix
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
          />
        );
      case 7:
        return (
          <StepSeven
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
          />
        );
      case 8:
        return (
          <StepEight
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
          />
        );
      case 9:
        return <StepNine formData={formData} />;
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
    <div className="md:h-[100dvh] min-h-screen bg-white items-center">
      <div className="sm:w-[80vw] w-full h-full  m-0 sm:mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <button onClick={prevStep} className="text-third">
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
            </button>
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
