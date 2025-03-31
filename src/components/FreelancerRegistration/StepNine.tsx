import { FreelancerImage } from "@/constants/images";
import Image from "next/image";
import React, { useState } from "react";
import SwipeToConfirm from "./components/SlideToConfirm";
import { ApplyFreelancerFormData } from "@/types/applyFreelancer";

interface StepNineProps {
  formData: ApplyFreelancerFormData;
}

const StepNine: React.FC<StepNineProps> = ({ formData }) => {

  console.log("formData", formData);
  

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const simulateApiCall = () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 3000);
    });
  };

  const handleConfirm = async () => {
    setIsLoading(true);

    try {
      await simulateApiCall();
      setIsSuccess(true);
      setIsLoading(false);

        setTimeout(() => {
          setIsSuccess(false);
        }, 1500);
    } catch (error) {
      console.log("Error:", error);
      setIsLoading(false);
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

        <div className="w-full flex justify-center mb-8 relative ">
          <div className="w-[400px] ">
            <SwipeToConfirm
              onConfirm={handleConfirm}
              isLoading={isLoading}
              isSuccess={isSuccess}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepNine;
