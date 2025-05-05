import { AssetIcon } from "@/constants/icons";
import Image from "next/image";
import React from "react";
import CardZipcodeSearch from "./components/CardSearchZipcode";

interface StepSixProps {
  formData: {
    title: string;
    name: string;
    surname: string;
    card_number: string;
    card_address_details: string;
    card_zip_code: string;
    card_subdistrict_or_district: string;
    card_district_or_subdistrict: string;
    card_province: string;
  };
  updateFormData: (data: Partial<StepSixProps["formData"]>) => void;
  nextStep: () => void;
}

const StepSix: React.FC<StepSixProps> = ({
  formData,
  updateFormData,
  nextStep,
}) => {
  const [idNumberError, setIdNumberError] = React.useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleIdNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!/^\d*$/.test(value)) {
      setIdNumberError("กรุณากรอกเฉพาะตัวเลข");
      return;
    }

    if (value.length > 13) {
      return;
    }

    updateFormData({ card_number: value });

    if (value.length === 13) {
      setIdNumberError("");
    } else {
      setIdNumberError("ต้องมีเลข 13 หลัก");
    }
  };

  const isFormValid = () => {
    const idPattern = /^\d{13}$/;
    return (
      formData.title.trim() !== "" &&
      formData.name.trim() !== "" &&
      formData.surname.trim() !== "" &&
      idPattern.test(formData.card_number) &&
      formData.card_address_details.trim() !== "" &&
      formData.card_district_or_subdistrict.trim() !== "" &&
      formData.card_subdistrict_or_district.trim() !== "" &&
      formData.card_province.trim() !== "" &&
      formData.card_zip_code.trim() !== ""
    );
  };

  return (
    <div className="p-6 md:p-0 h-full font-sans">
      <div className="flex flex-col  md:flex-row h-full">
        <section className="flex-1 flex flex-col justify-center p-4 2xl:p-0 gap-4 mx-auto md:w-1/2 ">
          <article className="text-center">
            <h2 className="text-[20px] font-bold text-text_primary">
              ข้อมูลบัตรประชาชนเพื่อออกเอกสาร📑
            </h2>
            <p className="text-[14px] font-sans text-text_secondary mt-2">
              อย่าลืมเช็คความถูกต้องก่อนทำการบันทึก
            </p>
          </article>
          <div className="max-w-[440px] flex flex-col justify-center gap-4 mx-auto">
            <div>
              <label className="block text-sm text-text_primary font-semibold mb-2">
                คำนำหน้าชื่อ
              </label>
              <select
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary"
              >
                <option disabled value="">
                  เลือกคำนำหน้า
                </option>
                <option value="นาย">นาย</option>
                <option value="นาง">นาง</option>
                <option value="นางสาว">นางสาว</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-text_primary font-semibold mb-2">
                  ชื่อ
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary"
                  placeholder="ระบุชื่อจริง"
                />
              </div>

              <div>
                <label className="block text-sm text-text_primary font-semibold mb-2">
                  นามสกุล
                </label>
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary"
                  placeholder="ระบุนามสกุลจริง"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-text_primary font-semibold mb-2">
                เลขบัตรประชาชน
              </label>
              <input
                type="text"
                name="idNumber"
                value={formData.card_number}
                onChange={handleIdNumberChange}
                className={`w-full px-3 py-2 border ${
                  idNumberError
                    ? "border-red-500 focus:ring-red-100 "
                    : "border-gray-300 focus:ring-third"
                } rounded-md focus:outline-none focus:ring-2 text-text_primary`}
                placeholder="ระบุเลขบัตรประชาชน 13 หลัก"
                maxLength={13}
              />
              {idNumberError && (
                <p className="text-red-500 text-xs mt-1">{idNumberError}</p>
              )}
            </div>
            <h1 className="text-base text-text_primary font-semibold font-kanit leading-[18.4px] tracking-wide">
              ที่อยู่ตามบัตรประชาชน
            </h1>
            <div>
              <label className="block text-sm text-text_primary font-semibold mb-2">
                รายละเอียดที่อยู่
              </label>
              <input
                type="text"
                name="card_address_details"
                value={formData.card_address_details}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary"
                placeholder="ระบุที่อยู่, หมู่, ถนน, ซอย"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <CardZipcodeSearch
                formData={formData}
                onSelect={(selected) => {
                  updateFormData({
                    card_province: selected.card_province,
                    card_district_or_subdistrict:
                      selected.card_district_or_subdistrict,
                    card_subdistrict_or_district:
                      selected.card_subdistrict_or_district,
                    card_zip_code: selected.card_zip_code,
                  });
                }}
              />

              <div>
                <label className="block text-sm text-text_primary font-semibold mb-2">
                  ตำบล/แขวง
                </label>
                <input
                  type="text"
                  name="card_subdistrict_or_district"
                  value={formData.card_subdistrict_or_district}
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
                  name="card_district_or_subdistrict"
                  value={formData.card_district_or_subdistrict}
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
                  name="card_province"
                  value={formData.card_province}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary"
                  placeholder="ระบุจังหวัด"
                />
              </div>
            </div>
            <div className="w-full mt-8">
              <button
                onClick={nextStep}
                disabled={!isFormValid()}
                className={`w-full px-6 py-2 rounded-lg flex items-center justify-center ${
                  !isFormValid()
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-third text-white"
                }`}
              >
                บันทึก และไปต่อ
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
        </section>

        <section className="w-full md:w-1/2 md:pl-4 step2-gradient relative overflow-hidden">
          <div className="absolute top-[60px] left-[50px] right-0 mx-auto w-full h-full p-10 flex flex-col gap-2 shadow-recipeShadow overflow-hidden bg-white">
            <div className="">
              <figure className="border-b-1 border-gray-200 pb-2 mb-4">
                <h3 className="font-bold text-[24px] text-third flex items-center">
                  ใบเสร็จรับเงิน
                </h3>
                <Image
                  src={AssetIcon.logo_blue}
                  alt="logo"
                  width={60}
                  height={16}
                />
              </figure>
              <div className="flex flex-row gap-6 mb-4">
                <div className="flex flex-col gap-2 flex-[3_1]">
                  <p className="text-base text-text_primary font-semibold">
                    ผู้ขาย:
                  </p>
                  <p className="text-[12px] leading-[13.8px] text-text_primary">
                    {formData.title} {formData.name} {formData.surname}
                  </p>
                  <p className="text-[12px] leading-[13.8px] text-text_primary capitalize">
                    ที่อยู่: {formData.card_address_details}{" "}
                    {formData.card_subdistrict_or_district}{" "}
                    {formData.card_district_or_subdistrict}{" "}
                    {formData.card_province} {formData.card_zip_code}
                  </p>
                  <p className="text-[12px] leading-[13.8px] text-text_primary">
                    เลขประจำตัวผู้เสียภาษี: {formData.card_number}
                  </p>
                </div>
                <div className="flex-[2_1] flex flex-col gap-2">
                  <p className="text-base text-text_primary font-semibold mb-2">
                    ลูกค้า:
                  </p>
                  <div className="w-1/2 h-[10px] rounded-md skeleton-gray"></div>
                  <div className="w-full h-[10px] rounded-md skeleton-gray"></div>
                  <div className="w-full h-[10px] rounded-md skeleton-gray"></div>
                  <div className="w-full h-[10px] rounded-md skeleton-gray"></div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-2">
                <div className="w-1/2 h-[10px] rounded-md skeleton-gray"></div>
                <div className="w-1/2 h-[10px] rounded-md skeleton-gray"></div>
                <div className="w-full h-[10px] rounded-md skeleton-gray"></div>
                <div className="w-full h-[10px] rounded-md skeleton-gray"></div>
                <div className="w-full h-[10px] rounded-md skeleton-gray"></div>
              </div>

              <div className="mt-8">
                <div className="flex flex-row gap-2">
                  <div className="w-1/2 h-[10px] rounded-md skeleton-blue"></div>
                  <div className="w-1/4 h-[10px] rounded-md skeleton-blue"></div>
                  <div className="w-1/4 h-[10px] rounded-md skeleton-blue"></div>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <div className="w-1/2 h-[10px] rounded-md skeleton-gray"></div>
                  <div className="w-1/2 h-[10px] rounded-md skeleton-gray"></div>
                  <div className="w-1/2 h-[10px] rounded-md skeleton-gray"></div>
                  <div className="w-1/2 h-[10px] rounded-md skeleton-gray"></div>
                  <div className="w-1/2 h-[10px] rounded-md skeleton-gray"></div>
                  <div className="w-1/2 h-[10px] rounded-md skeleton-gray"></div>
                  <div className="w-1/2 h-[10px] rounded-md skeleton-gray"></div>
                  <div className="flex flex-row gap-2">
                    <div className="w-1/2 h-[10px] rounded-md skeleton-gray"></div>
                    <div className="w-1/4 h-[10px] rounded-md skeleton-gray"></div>
                    <div className="w-1/4 h-[10px] rounded-md skeleton-gray"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StepSix;
