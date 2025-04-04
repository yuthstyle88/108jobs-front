import { useFormStorage } from "@/app/apply-freelance/hooks/useFormStorage";
import { FreelancerImage } from "@/constants/images";
import { usePrivatePost } from "@/hooks/api-hooks";
import { FreelancerFormData } from "@/types/applyFreelancer";
import Image from "next/image";
import React, { useState } from "react";
import SwipeToConfirm from "./components/SlideToConfirm";

interface StepNineProps {
  formData: FreelancerFormData;
  currentStep: number;
}

interface ApplyFreelancerResponse {
  jwt: string;
}

const StepNine: React.FC<StepNineProps> = ({ formData, currentStep }) => {
  console.log("formData", formData);

  const [isLogin, setIsLogin] = useState(false);
  const { clearFormStorage } = useFormStorage<FreelancerFormData>({
    currentStep,
    setCurrentStep: () => {},
    setFormData: () => {},
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { trigger: applyFreelancer, isMutating: isUpdateMuting } =
    usePrivatePost("/profile/apply/freelancer");

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
        return;
      }
      if (res?.jwt) {
        setIsLogin(true);
        const loginResponse = await fetch("/api/auth/token-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: res.jwt }),
        });

        if (!loginResponse.ok) {
          setApiError("สมัครฟรีแลนซ์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
          return;
        }

        clearFormStorage();
        setIsSuccess(true);
        setIsLogin(false);
        window.location.href = "/apply-freelance/landing";
      } else {
        setApiError("สมัครฟรีแลนซ์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      }
    } catch (error) {
      console.log("Error:", error);
      setApiError("สมัครฟรีแลนซ์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <div className="p-6 h-full">
      <div className="flex flex-col justify-between h-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-text_primary">
            การใช้ Fastlance อย่างถูกต้องช่วยลดความเสี่ยงในการถูกแบน
          </h2>
          <p className="text-text_secondary mt-2">
            การปฎิบัติตามกฎจะช่วยให้คุณหลีกเลี่ยงการถูกแบนและทำรายได้อย่างมั่นใจ
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
              การนำใบข้อมูลการติดต่อ
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
              ห้าม การเรียกร้อง/รับการชำระเงินนอกระบบ
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
              การห้าม ยอมรับงานที่ผิดกฎหมาย
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
              ดำเนินการใช้เครื่องมือที่ถูกต้อง
            </p>
          </div>
        </div>
        <div className="w-full flex flex-col items-center justify-center mb-8 relative ">
          <div className="w-[400px] ">
            <SwipeToConfirm
              onConfirm={handleConfirm}
              isLoading={isUpdateMuting || isLogin}
              isSuccess={isSuccess}
            />
          </div>
          {apiError && (
            <div className="text-center text-sm text-red-600 mt-2">
              {apiError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepNine;
