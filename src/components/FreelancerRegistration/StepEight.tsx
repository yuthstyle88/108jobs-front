import { useFetchUser } from "@/app/apply-freelance/hooks/useFetchUserProfile";
import { ERROR_CONSTANTS } from "@/constants/error";
import { AssetIcon } from "@/constants/icons";
import { usePrivateFetch } from "@/hooks/api-hooks";
import { useUserStore } from "@/store/useUserProfileStore";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ChangeEmailModal from "../ChangeEmailModal";
import ConfirmChangeEmailModal from "../ConfirmChangeEmailModal";
import LoadingCircle from "../LoadingCircle";
import ZipcodeSearch from "./components/SearchZipcode";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { LanguageFile } from "@/constants/language";
import Loading from "../Loading";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "กรุณากรอกอีเมลหรือเบอร์โทรศัพท์"),
});

type VerifyForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface StepEightProps {
  formData: {
    email: string;
    countryType: "Thailand" | "Foreign";
    country: string;
    address_details: string;
    province: string;
    subdistrict_or_district: string;
    district_or_subdistrict: string;
    zip_code: string;
  };
  updateFormData: (data: Partial<StepEightProps["formData"]>) => void;
  nextStep: () => void;
}

interface Country {
  id: string;
  name: string;
}

interface CountriesResponse {
  countries: Country[];
}

const StepEight: React.FC<StepEightProps> = ({
  formData,
  updateFormData,
  nextStep,
}) => {
  const {
    data: contactInfoLanguageData,
    isLoading,
    error,
  } = useGlobalTranslate(LanguageFile.CONTACT);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: {
      email: formData.email,
    },
  });

  const { data: countriesData } =
    usePrivateFetch<CountriesResponse>("/profile/countries");
  const { mutate } = useFetchUser();
  const { user } = useUserStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmChange, setIsConfirmChange] = useState(false);
  const [isChangeModal, setIsChangeModal] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const COUNTRY_LABELS: Record<"Thailand" | "Foreign", string> = {
    Thailand: "ประเทศไทย",
    Foreign: "ต่างชาติ",
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleCountryTypeChange = (type: "Thailand" | "Foreign") => {
    if (type === "Thailand") {
      updateFormData({
        countryType: "Thailand",
        country: "Thailand", // ✅ Luôn set rõ ràng
        province: "",
        district_or_subdistrict: "",
        subdistrict_or_district: "",
        zip_code: "",
        address_details: "",
      });
    } else {
      updateFormData({
        countryType: "Foreign",
        country: "", // ✅ Reset lại để chọn quốc gia từ dropdown
        province: "",
        district_or_subdistrict: "",
        subdistrict_or_district: "",
        zip_code: "",
        address_details: "",
      });
    }
  };

  const isFormValid = () =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
    (formData.countryType === "Thailand" || formData.country);

  const onSubmit = async (data: VerifyForgotPasswordFormData) => {
    try {
      setApiError(null);
      const response = await fetch("/api/auth/resend-change-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error) setApiError(ERROR_CONSTANTS.EMAIL_NOT_EXIST);
        return;
      }

      setIsChangeModal(true);
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการลงทะเบียน"
      );
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading language data</div>;

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

          {/* Email confirm */}
          {isConfirmChange ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-6">
                <div className="flex gap-2 items-end w-full">
                  <div className="flex-1">
                    <label className="block text-sm text-text_primary font-semibold mb-2">
                      อีเมลติดต่อ
                    </label>
                    <input
                      type="email"
                      {...register("email")}
                      className={`text-text_primary w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                        apiError
                          ? "border-[#ea6357] text-[#ea6357]"
                          : "border-gray-300"
                      }`}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div className="justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-3 py-[8px] submit-button"
                    >
                      {isSubmitting ? <LoadingCircle /> : "ยืนยัน"}
                    </button>
                  </div>
                </div>
                {apiError && (
                  <div className="text-[#ea6357] text-[12px] font-sans">
                    {apiError}
                  </div>
                )}
              </div>
            </form>
          ) : (
            <div className="mb-6 flex gap-2 items-end w-full">
              <div className="flex-1">
                <label className="block text-sm text-text_primary font-semibold mb-2">
                  อีเมลติดต่อ
                </label>
                <input
                  type="email"
                  value={user?.contact.email ?? ""}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary disabled:cursor-not-allowed"
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="justify-end">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-3 py-[8px] rounded-md text-third border-gray-200 border-1"
                >
                  ยืนยัน
                </button>
              </div>
            </div>
          )}

          {/* Country type selector */}
          <div className="mb-6">
            <label className="block text-sm text-text_primary font-semibold mb-2">
              ที่อยู่ปัจจุบัน
            </label>
            <div className="flex space-x-4 mb-4">
              {(["Thailand", "Foreign"] as const).map((type) => (
                <label
                  key={type}
                  className={`flex items-center px-4 py-2 rounded-lg cursor-pointer border text-text_primary ${
                    formData.countryType === type
                      ? "border-third"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="countryType"
                    value={type}
                    checked={formData.countryType === type}
                    onChange={() => handleCountryTypeChange(type)}
                    className="mr-2 text-third"
                  />
                  {COUNTRY_LABELS[type]}
                </label>
              ))}
            </div>

            {/* Foreign country dropdown */}
            {formData.countryType === "Foreign" && countriesData && (
              <select
                value={formData.country}
                onChange={(e) => updateFormData({ country: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary"
              >
                <option value="" disabled>
                  เลือกประเทศ
                </option>
                {countriesData.countries.map((country: Country) => (
                  <option key={country.id} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            )}

            {/* Thailand address inputs */}
            {formData.countryType === "Thailand" && (
              <>
                <div className="mb-4">
                  <label className="block text-sm text-text_primary font-semibold mb-2">
                    รายละเอียดที่อยู่
                  </label>
                  <input
                    type="text"
                    name="address_details"
                    value={formData.address_details}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary"
                    placeholder="ระบุที่อยู่, หมู่, ถนน, ซอย"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <ZipcodeSearch
                    formData={formData}
                    onSelect={(selected) => {
                      updateFormData({
                        province: selected.province,
                        district_or_subdistrict:
                          selected.district_or_subdistrict,
                        subdistrict_or_district:
                          selected.subdistrict_or_district,
                        zip_code: selected.zip_code,
                      });
                    }}
                  />
                  <div>
                    <label className="block text-sm text-text_primary font-semibold mb-2">
                      ตำบล/แขวง
                    </label>
                    <input
                      type="text"
                      name="subdistrict_or_district"
                      value={formData.subdistrict_or_district}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary"
                      placeholder="ระบุตำบล/แขวง"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-text_primary font-semibold mb-2">
                      อำเภอ/เขต
                    </label>
                    <input
                      type="text"
                      name="district_or_subdistrict"
                      value={formData.district_or_subdistrict}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary"
                      placeholder="ระบุอำเภอ/เขต"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-text_primary font-semibold mb-2">
                      จังหวัด
                    </label>
                    <input
                      type="text"
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary"
                      placeholder="ระบุจังหวัด"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

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

      <ConfirmChangeEmailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        handleConfirmChange={() => {
          setIsConfirmChange(true);
          setIsModalOpen(false);
        }}
        language={contactInfoLanguageData}
      />
      <ChangeEmailModal
        formEmail={formData.email}
        isOpen={isChangeModal}
        onClose={() => setIsChangeModal(false)}
        handleConfirmChange={async () => {
          await mutate();
          setIsConfirmChange(false);
          setIsChangeModal(false);
        }}
        language={contactInfoLanguageData}
      />
    </div>
  );
};

export default StepEight;
