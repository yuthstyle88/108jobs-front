import { API_ROUTES } from "@/api/endpoints";
import { useFormStorage } from "@/app/[lang]/apply-freelance/hooks/useFormStorage";
import { FreelancerImage } from "@/constants/images";
import { usePrivatePost } from "@/hooks/api-hooks";
import { FreelancerFormData } from "@/types/applyFreelancer";
import { signIn } from "@/lib/auth";
import Image from "next/image";
import React, { useState } from "react";
import ConfirmTermsFreelancerModal from "../ConfirmTermsFreelancerModal";
import SwipeToConfirm from "./components/SlideToConfirm";
import { ApplyToBeFreelancerLanguage } from "@/types/language";
import LoadingBlur from "../LoadingBlur";

interface StepTenProps {
  formData: FreelancerFormData;
  currentStep: number;
  applyFreelancerLanguage:
    | Partial<ApplyToBeFreelancerLanguage>
    | undefined
    | null;
}

interface ApplyFreelancerResponse {
  jwt: string;
}

const StepTen: React.FC<StepTenProps> = ({
  formData,
  currentStep,
  applyFreelancerLanguage,
}) => {
  const [isLogin, setIsLogin] = useState(false);
  const { clearFormStorage } = useFormStorage<FreelancerFormData>({
    currentStep,
    setCurrentStep: () => {},
    setFormData: () => {},
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isOpenTerm, setIsOpenTerm] = useState(false);
  const [isLoadingSwipe, setIsLoadingSwipe] = useState(false);

  const { trigger: applyFreelancer, isMutating: isUpdateMuting } =
    usePrivatePost(API_ROUTES.profile.apply_freelancer);

  const handleCheckTerms = () => {
    setApiError(null);
    setIsLoadingSwipe(true);
    setTimeout(() => {
      setIsLoadingSwipe(false);
      setIsSuccess(true);
      setIsOpenTerm(true);
    }, 800);
  };

  const handleCloseTerms = () => {
    setIsSuccess(false);
    setIsOpenTerm(false);
  };

  const handleConfirm = async () => {
    setApiError(null);
    try {
      const payload = {
        user_info: {
          avatar_url: formData.avatar_url,
          username: formData.username,
          display_name: formData.display_name,
          freelancer_type: formData.freelancer_type,
        },
        bio: formData.bio,
        card_info: {
          front_card: formData.front_card,
          back_card: formData.back_card,
          title: formData.title,
          name: formData.name,
          surname: formData.surname,
          card_number: formData.card_number,
          card_address_details: formData.card_address_details,
          card_zip_code: formData.card_zip_code,
          card_subdistrict_or_district: formData.card_subdistrict_or_district,
          card_district_or_subdistrict: formData.card_district_or_subdistrict,
          card_province: formData.card_province,
        },
        birth_date: formData.birth_date,
        contact_address_info:
          formData.country === "Thailand"
            ? {
                email: formData.email,
                country: formData.country,
                address_details: formData.address_details,
                zip_code: formData.zip_code,
                subdistrict_or_district: formData.subdistrict_or_district,
                district_or_subdistrict: formData.district_or_subdistrict,
                province: formData.province,
              }
            : {
                email: formData.email,
                country: formData.country,
                province: formData.province,
              },
      };

      const res = (await applyFreelancer(payload)) as ApplyFreelancerResponse;

      if (!res) {
        setApiError("สมัครฟรีแลนซ์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        setIsOpenTerm(false);
        return;
      }

      if (res?.jwt) {
        setIsLogin(true);
        const signInResult = await signIn("credentials", {
          token: res.jwt,
          redirect: false,
          callbackUrl: "/apply-freelance/landing",
        });

        if (signInResult?.url) {
          const path = new URL(signInResult.url).pathname;
          clearFormStorage();
          setIsSuccess(true);
          setIsLogin(false);
          setIsOpenTerm(false);
          window.location.href = path;
        } else {
          setIsOpenTerm(false);
          setApiError("สมัครฟรีแลนซ์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        }
      } else {
        setIsOpenTerm(false);
        setApiError("สมัครฟรีแลนซ์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      }
    } catch (error) {
      setIsOpenTerm(false);
      console.log("Error:", error);
      setApiError("สมัครฟรีแลนซ์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    }
  };

  if (isLogin) return <LoadingBlur text="" />;

  return (
    <div className="p-6 h-full">
      <div className="flex flex-col justify-between h-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-text_primary">
            {applyFreelancerLanguage?.fastwork_usage_tip}
          </h2>
          <p className="text-text_secondary mt-2">
            {applyFreelancerLanguage?.compliance_tip}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="">
            <Image
              src={FreelancerImage.leakage1}
              alt="leakage1"
              className="w-full"
              width={400}
              height={400}
            />
            <p className="text-center text-base font-medium text-red-500 mt-2">
              {applyFreelancerLanguage?.contact_info_usage}
            </p>
          </div>

          <div className="">
            <Image
              src={FreelancerImage.leakage2}
              alt="leakage1"
              className="w-full"
              width={400}
              height={400}
            />
            <p className="text-center text-base font-medium text-red-500 mt-2">
              {applyFreelancerLanguage?.no_off_platform_payment}
            </p>
          </div>

          <div className="">
            <Image
              src={FreelancerImage.leakage3}
              alt="leakage1"
              className="w-full"
              width={400}
              height={400}
            />
            <p className="text-center text-base font-medium text-red-500 mt-2">
              {applyFreelancerLanguage?.no_illegal_jobs}
            </p>
          </div>

          <div className="">
            <Image
              src={FreelancerImage.leakage4}
              alt="leakage1"
              className="w-full"
              width={400}
              height={400}
            />
            <p className="text-center text-base font-medium text-green-500 mt-2">
              {applyFreelancerLanguage?.use_tools_correctly}
            </p>
          </div>
        </div>
        <div className="w-full flex flex-col items-center justify-center mb-8 relative ">
          <div className="w-[400px] ">
            <SwipeToConfirm
              onConfirm={handleCheckTerms}
              isLoading={isLoadingSwipe}
              isSuccess={isSuccess}
              language={applyFreelancerLanguage}
            />
          </div>
          {apiError && (
            <div className="text-center text-sm text-red-600 mt-2">
              {apiError}
            </div>
          )}
        </div>
      </div>
      <ConfirmTermsFreelancerModal
        isOpen={isOpenTerm}
        onClose={handleCloseTerms}
        handleConfirmChange={handleConfirm}
        isLoading={isUpdateMuting}
      />
    </div>
  );
};

export default StepTen;
