import { FreelancerImage } from "@/constants/images";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

interface StepNineProps {
  formData: {
    termsAccepted: boolean;
  };
  updateFormData: (data: { termsAccepted: boolean }) => void;
  prevStep: () => void;
}

const StepNine: React.FC<StepNineProps> = ({
  updateFormData,
  prevStep,
}) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const sliderRef = useRef<HTMLInputElement>(null);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setSliderValue(value);

    if (value === 100) {
      setIsCompleted(true);
      updateFormData({ termsAccepted: true });
    }
  };

  useEffect(() => {
    if (isCompleted) {
      const timer = setTimeout(() => {
        window.location.href = "/apply-freelance/landing";
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isCompleted]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {isCompleted ? (
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-text_primary mb-4">
            ลงทะเบียนสำเร็จ!
          </h3>
          <p className="text-text_secondary mb-8">
            คุณได้ลงทะเบียนเป็นฟรีแลนซ์เรียบร้อยแล้ว
          </p>
          <div className="flex justify-center">
            <Link
              href="/"
              className="px-8 py-3 bg-third text-white rounded-lg font-medium"
            >
              เริ่มต้นประกาศงาน
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-text_primary">
              การใช้ Fastlance อย่างถูกต้องช่วยลดความเสี่ยงในการถูกแบน
            </h2>
            <p className="text-text_secondary mt-2">
              การปฎิบัติตามกฎจะช่วยให้คุณหลีกเลี่ยงการถูกแบนและทำรายได้อย่างมั่นใจ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-red-50 rounded-lg p-4 relative">
              <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                <svg
                  className="w-4 h-4"
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
              </div>
              <div className="h-32 flex items-center justify-center">
                <Image
                  src={FreelancerImage.leakage1}
                  alt="leakage1"
                  className="w-full"
                />
              </div>
              <p className="text-center text-sm font-medium text-red-500 mt-2">
                การนำใบข้อมูลการติดต่อ
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-4 relative">
              <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                <svg
                  className="w-4 h-4"
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
              </div>
              <div className="h-32 flex items-center justify-center">
                <Image
                  src={FreelancerImage.leakage2}
                  alt="leakage1"
                  className="w-full"
                />
              </div>
              <p className="text-center text-sm font-medium text-red-500 mt-2">
                ห้าม การเรียกร้อง/รับการชำระเงินนอกระบบ
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-4 relative">
              <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                <svg
                  className="w-4 h-4"
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
              </div>
              <div className="h-32 flex items-center justify-center">
                <Image
                  src={FreelancerImage.leakage3}
                  alt="leakage1"
                  className="w-full"
                />
              </div>
              <p className="text-center text-sm font-medium text-red-500 mt-2">
                การห้าม ยอมรับงานที่ผิดกฎหมาย
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4 relative">
              <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="h-32 flex items-center justify-center">
                <Image
                  src={FreelancerImage.leakage4}
                  alt="leakage1"
                  className="w-full"
                />
              </div>
              <p className="text-center text-sm font-medium text-green-500 mt-2">
                ดำเนินการใช้เครื่องมือที่ถูกต้อง
              </p>
            </div>
          </div>

          <div className="mb-8 relative">
            <div className="h-14 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
              <div
                className="absolute left-0 top-0 bottom-0 bg-third transition-all duration-200"
                style={{ width: `${sliderValue}%` }}
              ></div>

              <input
                ref={sliderRef}
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={handleSliderChange}
                className="absolute w-full h-full opacity-0 cursor-pointer z-20"
              />

              <div
                className="absolute h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-md z-10 transition-all duration-200"
                style={{
                  left: `calc(${sliderValue}% - ${
                    sliderValue > 0 ? "20px" : "5px"
                  })`,
                }}
              >
                <svg
                  className="w-5 h-5 text-third"
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
              </div>

              <div className="relative z-5 text-white font-medium select-none">
                {sliderValue > 50 ? "ปล่อยเพื่อยอมรับ" : "สไลด์เพื่อยอมรับ"}
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={prevStep}
              className="px-6 py-2 border border-gray-300 rounded-lg text-text_primary"
            >
              ย้อนกลับ
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StepNine;
