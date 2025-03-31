import { AssetIcon } from "@/constants/icons";
import { useUserStore } from "@/store/useUserProfileStore";
import Image from "next/image";
import React, { useState } from "react";
import ChangeEmailModal from "./components/ChangeEmailModal";

interface StepEightProps {
  formData: {
    email: string;
    country: string;
    province_or_city: string;
  };
  updateFormData: (data: Partial<StepEightProps["formData"]>) => void;
  nextStep: () => void;
}

const StepEight: React.FC<StepEightProps> = ({
  formData,
  updateFormData,
  nextStep,
}) => {
  const { user } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmChange, setIsConfirmChange] = useState(false);

  const COUNTRY_OPTIONS = ["Thailand", "Foreign"];

  const thaiProvinces = [
    { id: 1, name_en: "Bangkok", name_th: "กรุงเทพมหานคร" },
    { id: 2, name_en: "Chiang Mai", name_th: "เชียงใหม่" },
    { id: 3, name_en: "Phuket", name_th: "ภูเก็ต" },
  ];

  const countries = [
    { id: 1, name_en: "Vietnam", name_th: "เวียดนาม" },
    { id: 2, name_en: "Singapore", name_th: "สิงคโปร์" },
    { id: 3, name_en: "Malaysia", name_th: "มาเลเซีย" },
  ];

  const COUNTRY_LABELS: Record<string, string> = {
    Thailand: "ประเทศไทย",
    Foreign: "ต่างชาติ",
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleConfirmChange = () => {
    setIsConfirmChange(true);
    closeModal();
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ email: e.target.value });
  };

  const handleCountryChange = (country: string) => {
    updateFormData({ country, province_or_city: "" });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFormData({ province_or_city: e.target.value });
  };

  const isFormValid = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  return (
    <div className="py-8 md:p-0 h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 h-full">
        <div className="flex flex-col justify-center px-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-text_primary">
              ยืนยันข้อมูลการติดต่อของคุณ
            </h2>
            <p className="text-text_secondary mt-2">
              เพื่อให้ทางเราส่งข้อมูลการติดต่อกลับคุณได้
            </p>
          </div>

          {/* Email Section */}
          <div className="mb-6 flex flex-row gap-2 items-end w-full">
            <div className="flex-1">
              <label className="block text-sm text-text_primary font-semibold mb-2">
                อีเมลติดต่อ
              </label>
              <input
                type="email"
                value={isConfirmChange ? formData.email : user?.contact.email}
                onChange={isConfirmChange ? handleEmailChange : undefined}
                disabled={!isConfirmChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary disabled:cursor-not-allowed"
                placeholder="your.email@example.com"
              />
            </div>
            <button
              onClick={openModal}
              className="px-3 py-[8px] rounded-md text-third border-gray-200 border-1"
            >
              ยืนยัน
            </button>
          </div>

          {/* Country Selection */}
          <div className="mb-6">
            <label className="block text-sm text-text_primary font-semibold mb-2">
              ที่อยู่ปัจจุบัน
            </label>
            <div className="flex space-x-4 mb-4">
              {COUNTRY_OPTIONS.map((country) => (
                <div
                  key={country}
                  onClick={() => handleCountryChange(country)}
                  className={`flex items-center px-4 py-2 rounded-lg cursor-pointer border text-text_primary ${
                    formData.country === country
                      ? "border-third"
                      : "border-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border mr-2 flex items-center justify-center ${
                      formData.country === country
                        ? "border-third"
                        : "border-gray-400"
                    }`}
                  >
                    {formData.country === country && (
                      <div className="w-2 h-2 rounded-full bg-third"></div>
                    )}
                  </div>
                  <span>{COUNTRY_LABELS[country]}</span>
                </div>
              ))}
            </div>

            {/* City/Country Selection */}
            <select
              value={formData.province_or_city}
              onChange={handleCityChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary"
            >
              <option value="" disabled>
                {formData.country === "Thailand"
                  ? "เลือกจังหวัด"
                  : "เลือกประเทศ"}
              </option>

              {formData.country === "Thailand"
                ? 
                  thaiProvinces.map((province) => (
                    <option key={province.id} value={province.name_en}>
                      {province.name_th}
                    </option>
                  ))
                : 
                  countries.map((country) => (
                    <option key={country.id} value={country.name_en}>
                      {country.name_th}
                    </option>
                  ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-between mt-8">
            <button
              onClick={nextStep}
              disabled={!isFormValid()}
              className={`w-full px-6 py-2 rounded-lg flex items-center justify-center ${
                !isFormValid()
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-third text-white"
              }`}
            >
              บันทึกและส่งข้อมูล
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

        {/* Image Section */}
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

      {/* Change Email Modal */}
      <ChangeEmailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        handleConfirmChange={handleConfirmChange}
      />
    </div>
  );
};

export default StepEight;
