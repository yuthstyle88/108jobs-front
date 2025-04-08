"use client";
import ChangeEmailModal from "@/components/ChangeEmailModal";
import ConfirmChangeEmailModal from "@/components/ConfirmChangeEmailModal";
import Loading from "@/components/Loading";
import LoadingCircle from "@/components/LoadingCircle";
import { ERROR_CONSTANTS } from "@/constants/error";
import { LanguageFile } from "@/constants/language";
import { usePrivateFetch } from "@/hooks/api-hooks";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  useForm
} from "react-hook-form";
import { z } from "zod";
import ZipcodeSearch from "../components/SearchZipcode";
import { useBasicInfoForm } from "../hooks/useBasicInfoForm";

const emailSchema = z.object({
  email: z.string().min(1, "กรุณากรอกอีเมลหรือเบอร์โทรศัพท์").optional(),
});

type VerifyEmailFormData = z.infer<typeof emailSchema>;

interface Country {
  id: string;
  name: string;
}

interface CountriesResponse {
  countries: Country[];
}

export interface AddressFormData {
  country: string;
  province?: string;
  district_or_subdistrict?: string;
  subdistrict_or_district?: string;
  zip_code?: string;
  address_details?: string;
}

interface RawAddress {
  country?: string | null;
  province?: string | null;
  district_or_subdistrict?: string | null;
  subdistrict_or_district?: string | null;
  zip_code?: string | null;
  address_details?: string | null;
}

function normalizeAddress(address: RawAddress | undefined): AddressFormData {
  return {
    country: address?.country ?? "Thailand",
    province: address?.province ?? "",
    district_or_subdistrict: address?.district_or_subdistrict ?? "",
    subdistrict_or_district: address?.subdistrict_or_district ?? "",
    zip_code: address?.zip_code ?? "",
    address_details: address?.address_details ?? "",
  };
}

export default function ContactPage() {
  const { profileData, mutate } = useBasicInfoForm();
  const [isReady, setIsReady] = useState(false);

  const form = useForm<AddressFormData>({
    defaultValues: {
      country: "Thailand",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    reset,
    formState: { isSubmitting },
  } = form;

  const {
    register: emailRegister,
    handleSubmit: handleEmailSubmit,
    reset: resetEmail,
    formState: { isSubmitting: isSubmittingEmail },
    getValues: getEmailValues,
  } = useForm({
    resolver: zodResolver(emailSchema),
    mode: "onChange",
    defaultValues: {
      email: profileData?.contact.email,
    },
  });

  const { data: countriesData } =
    usePrivateFetch<CountriesResponse>("/profile/countries");
  const {
    data: contactInfoLanguageData,
    isLoading,
    error,
  } = useGlobalTranslate(LanguageFile.CONTACT);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmChange, setIsConfirmChange] = useState(false);
  const [isChangeModal, setIsChangeModal] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const country = watch("country");
  const province = watch("province");

  useEffect(() => {
    if (profileData?.address && !isReady) {
      reset(normalizeAddress(profileData.address));
      setIsReady(true);
    }
  }, [profileData?.address,isReady, reset]);

  useEffect(() => {
    if (isConfirmChange) {
      resetEmail({ email: profileData?.contact.email ?? "" });
    }
  }, [isConfirmChange, profileData, resetEmail]);

  const onSubmitEmail = async (data: VerifyEmailFormData) => {
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

  const onSubmitAddress = async (data: AddressFormData) => {
    console.log("Address data:", data);
  };

  if (isLoading || !isReady) return <Loading />;
  if (error) return <div>Error loading language data</div>;

  return (
    <div>
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
          {isConfirmChange ? (
            <form onSubmit={handleEmailSubmit(onSubmitEmail)}>
              <div className="mb-6">
                <div className="flex gap-2 items-end w-full">
                  <div className="flex-1">
                    <label className="block text-sm text-text_primary font-semibold mb-2">
                      อีเมลติดต่อ
                    </label>
                    <input
                      type="email"
                      {...emailRegister("email")}
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
                      disabled={isSubmittingEmail}
                      className="px-3 py-[8px] submit-button"
                    >
                      {isSubmittingEmail ? <LoadingCircle /> : "ยืนยัน"}
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
                  value={profileData?.contact.email ?? ""}
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

      <form
        onSubmit={handleSubmit(onSubmitAddress)}
        className="bg-white rounded-lg text-sm text-text_primary font-semibold font-sans mb-6"
      >
        <div className="p-6 border-b">
          <h2 className="text-[16px] font-medium mb-2 text-text_primary">
            {contactInfoLanguageData?.section_address_info}
          </h2>
          <p className="text-gray-600 text-[14px] font-sans font-normal">
            {contactInfoLanguageData?.subtitle_address_info}
          </p>
        </div>
        <div className="p-6 flex flex-col border-b">
          <h3 className="text-base font-medium mb-3">
            {contactInfoLanguageData?.label_current_location}
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {["Thailand", "Foreign"].map((option) => (
              <label
                key={option}
                className={`flex items-center py-3 px-4 border rounded-lg cursor-pointer ${
                  country === option ? "border-third" : "border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  value={option}
                  {...register("country")}
                  className="text-blue-600 mr-3"
                />
                {option === "Thailand" ? "ประเทศไทย" : "ต่างชาติ"}
              </label>
            ))}
          </div>

          {country === "Foreign" ? (
            <select
              {...register("province")}
              value={province}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary"
            >
              <option value="">เลือกประเทศ</option>
              {countriesData?.countries.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm text-text_primary font-semibold mb-2">
                  รายละเอียดที่อยู่
                </label>
                <input
                  {...register("address_details")}
                  className="w-full px-3 py-2 border placeholder:font-normal placeholder:font-sans border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary"
                  placeholder="ระบุที่อยู่, หมู่, ถนน, ซอย"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <ZipcodeSearch control={control} setValue={setValue} />
                <div>
                  <label className="block font-semibold mb-1">ตำบล/แขวง</label>
                  <input
                    {...register("subdistrict_or_district")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">อำเภอ/เขต</label>
                  <input
                    {...register("district_or_subdistrict")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">จังหวัด</label>
                  <input
                    {...register("province")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary"
                  />
                </div>
              </div>
            </>
          )}

          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {isSubmitting ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </div>
        </div>
      </form>

      <ConfirmChangeEmailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        handleConfirmChange={() => {
          setIsConfirmChange(true);
          setIsModalOpen(false);
        }}
      />

      <ChangeEmailModal
        formEmail={getEmailValues("email")}
        isOpen={isChangeModal}
        onClose={() => setIsChangeModal(false)}
        handleConfirmChange={async () => {
          await mutate();
          setIsConfirmChange(false);
          setIsChangeModal(false);
        }}
      />
    </div>
  );
}
