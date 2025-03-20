"use client";
import Loading from "@/components/Loading";
import { LanguageFile } from "@/constants/language";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { useState } from "react";

export default function ContactPage() {
  const [selectedCountry, setSelectedCountry] = useState("foreign");

  const {
      data: contactInfoLanguageData,
      isLoading,
      error,
    } = useGlobalTranslate(LanguageFile.CONTACT);

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading language data</div>;

  return (
    <div className="">
      <div className="bg-white rounded-lg shadow-sm border-1 border-border_primary mb-6">
        <div className="border-b p-6">
          <h2 className="text-[16px] font-medium mb-2 text-text_primary">
            {contactInfoLanguageData?.section_contact_info}
          </h2>
          <p className="text-gray-600 text-[14px] font-sans">
            {contactInfoLanguageData?.subtitle_contact_info}
          </p>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-[14px] font-sans text-text_primary font-semibold mb-1">
              {contactInfoLanguageData?.label_contact_email}
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex-1 py-2 px-3 bg-gray-50 border border-gray-200 rounded text-gray-700">
                vutruonggiang452002@gmail.com
              </div>
              <button className="text-blue-600 hover:underline font-medium">
                เปลี่ยน
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm text-text_primary font-semibold text-gray-600 mb-1 font-sans">
              {contactInfoLanguageData?.label_contact_phone}
            </h3>
            <p className="text-[12px] text-gray-500 mb-2 font-sans">
              {contactInfoLanguageData?.note_contact_phone}
            </p>
            <div className="flex gap-4">
              <input
                type="tel"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                placeholder="ระบุเบอร์โทร"
                defaultValue="uykpfzno"
              />
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="">
        <div className="bg-white rounded-lg text-sm text-text_primary font-semibold font-sans mb-6">
          <div className="p-6 border-b">
            <h2 className="text-[16px] font-medium mb-2 text-text_primary">
              {contactInfoLanguageData?.section_address_info}
            </h2>
            <p className="text-gray-600 text-[14px] font-sans">
              {contactInfoLanguageData?.subtitle_address_info}
            </p>
          </div>

          <div className="p-6 flex flex-col border-b">
            <div>
              <h3 className="text-base font-medium mb-3">
                {contactInfoLanguageData?.label_current_location}
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <label
                  className={`flex items-center py-3 px-4 border border-gray-200 rounded-lg cursor-pointer ${
                    selectedCountry === "thailand"
                      ? "bg-blue-50 border-third"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="country"
                    value="thailand"
                    checked={selectedCountry === "thailand"}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="text-blue-600 mr-3"
                  />
                  <span>{contactInfoLanguageData?.option_thailand}</span>
                </label>
                <label
                  className={`flex items-center py-3 px-4 border border-gray-200 rounded-lg cursor-pointer ${
                    selectedCountry === "foreign"
                      ? "bg-blue-50 border-third"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="country"
                    value="foreign"
                    checked={selectedCountry === "foreign"}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="text-blue-600 mr-3"
                  />
                  <span>{contactInfoLanguageData?.option_foreign_country}</span>
                </label>
              </div>
            </div>
            {selectedCountry === "thailand" && (
              <>
                <div className="pb-6">
                  <h3 className="text-sm text-text_primary font-semibold text-gray-600 mb-1 font-sans">
                    รายละเอียดที่อยู่
                  </h3>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="ระบุเลขที่, หมู่, ถนน, ซอย"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm text-text_primary font-semibold text-gray-600 mb-1 font-sans">
                      รหัสไปรษณีย์
                    </h3>
                    <div className="flex gap-4">
                      <input
                        type="text"
                        placeholder="รหัสไปรษณีย์"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-text_primary font-semibold text-gray-600 mb-1 font-sans">
                      ตำบล/แขวง
                    </h3>
                    <div className="flex gap-4">
                      <input
                        type="text"
                        placeholder="ตำบล/แขวง"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-text_primary font-semibold text-gray-600 mb-1 font-sans">
                      อำเภอ/เขต
                    </h3>
                    <div className="flex gap-4">
                      <input
                        type="text"
                        placeholder="อำเภอ/เขต"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-text_primary font-semibold text-gray-600 mb-1 font-sans">
                      จังหวัด
                    </h3>
                    <div className="flex gap-4">
                      <input
                        type="text"
                        placeholder="จังหวัด"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {selectedCountry === "foreign" && (
              <div className="relative">
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 appearance-none bg-white pr-10">
                  <option>Vietnam</option>
                </select>
                <svg
                  className="w-5 h-5 text-gray-500 absolute right-3 top-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            )}

            <div className="self-end w-fit pt-8">
              <button className="w-full bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                บันทึก
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
