"use client";
import { API_ROUTES } from "@/api/endpoints";
import ChangeEmailModal from "@/components/ChangeEmailModal";
import ConfirmChangeEmailModal from "@/components/ConfirmChangeEmailModal";
import Loading from "@/components/Loading";
import LoadingCircle from "@/components/LoadingCircle";
import { ERROR_CONSTANTS } from "@/constants/error";
import { LanguageFile } from "@/constants/language";
import { usePrivateFetch, usePrivatePut } from "@/hooks/api-hooks";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import useNotification from "@/hooks/useNotification";
import { addressSchema } from "@/utils/validation/addressSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useBasicInfoForm } from "../hooks/useBasicInfoForm";
import ZipcodeSearch from "../components/SearchZipcode";
import { CountriesResponse } from "@/types/location";
import ErrorPage from "@/app/error";

const emailSchema = z.object({
  email: z.string().min(1, "กรุณากรอกอีเมลหรือเบอร์โทรศัพท์").optional(),
});

type VerifyEmailFormData = z.infer<typeof emailSchema>;

export interface AddressFormData {
  country: string;
  province?: string;
  districtOrSubdistrict?: string;
  subdistrictOrDistrict?: string;
  zipCode?: string;
  addressDetails?: string;
}

interface RawAddress {
  country?: string | null;
  province?: string | null;
  districtOrSubdistrict?: string | null;
  subdistrictOrDistrict?: string | null;
  zipCode?: string | null;
  addressDetails?: string | null;
}

function normalizeAddress(address: RawAddress | undefined): AddressFormData {
  return {
    country: address?.country ?? "Thailand",
    province: address?.province ?? "",
    districtOrSubdistrict: address?.districtOrSubdistrict ?? "",
    subdistrictOrDistrict: address?.subdistrictOrDistrict ?? "",
    zipCode: address?.zipCode ?? "",
    addressDetails: address?.addressDetails ?? "",
  };
}

const ContactInfo = () => {
  const { profileData, isLoadingProfile, isErrorProfile, mutate } =
    useBasicInfoForm();

  const { data: sellerContactLanguage } = useGlobalTranslate(
    LanguageFile.SELLER_CONTACT_INFO
  );

  const { data: contactInfoLanguageData } = useGlobalTranslate(
    LanguageFile.CONTACT
  );

  const { data: global } = useGlobalTranslate(LanguageFile.GLOBAL);

  const [isReady, setIsReady] = useState(false);
  const [defaultForeignCountry, setDefaultForeignCountry] =
    useState<string>("");

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
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
    formState: { errors, isSubmitting },
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

  const { trigger: updateAddressProfile, isMutating: isUpdateMuting } =
    usePrivatePut<AddressFormData>(API_ROUTES.profile.updateAddressProfile);

  const { successMessage } = useNotification();
  const LOCATION_OPTIONS = ["Thailand", "Foreign"] as const;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmChange, setIsConfirmChange] = useState(false);
  const [isChangeModal, setIsChangeModal] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  type LocationType = (typeof LOCATION_OPTIONS)[number];
  const [locationType, setLocationType] = useState<LocationType>("Thailand");

  const country = watch("country");

  const countryOptions = useMemo(() => {
    return (
      countriesData?.countries.map((c) => ({
        label: c.name,
        value: c.name,
      })) ?? []
    );
  }, [countriesData]);

  useEffect(() => {
    if (profileData?.address && !isReady) {
      const normalized = normalizeAddress(profileData.address);

      if (normalized.country !== "Thailand") {
        setLocationType("Foreign");
        setDefaultForeignCountry(normalized.country);
      } else {
        setLocationType("Thailand");
      }

      reset(normalized);
      setIsReady(true);
    }
  }, [profileData?.address, isReady, reset]);

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
    try {
      let payload: Partial<AddressFormData>;

      if (data.country === "Thailand") {
        payload = data;
      } else {
        payload = { country: data.country };
      }

      await updateAddressProfile(payload);
      await mutate();
      successMessage("profile", "update");
      if (data.country !== "Thailand") {
        setDefaultForeignCountry(data.country);
        reset({
          country: data.country,
          addressDetails: "",
          districtOrSubdistrict: "",
          subdistrictOrDistrict: "",
          zipCode: "",
          province: "",
        });
      } else {
        setDefaultForeignCountry("");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  if (isLoadingProfile || !isReady) return <Loading />;
  if (isErrorProfile) return <ErrorPage />;

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <div className="border-b border-gray-200 p-5">
        <h2 className="text-lg font-medium text-gray-800">
          {sellerContactLanguage?.contactInfoTitle}
        </h2>
        <p className="text-sm text-gray-500">
          {sellerContactLanguage?.contactInfoDescription}
        </p>
      </div>

      <div className="p-6">
        {isConfirmChange ? (
          <form onSubmit={handleEmailSubmit(onSubmitEmail)}>
            <div className="mb-6">
              <div className="flex gap-2 items-end w-full">
                <div className="flex-1">
                  <label className="block text-sm text-text-primary font-semibold mb-2">
                    {sellerContactLanguage?.emailContact}
                  </label>
                  <input
                    type="email"
                    {...emailRegister("email")}
                    className={`text-text-primary w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
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
                    {isSubmittingEmail ? (
                      <LoadingCircle />
                    ) : (
                      global?.buttonChange
                    )}
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
              <label className="block text-sm text-text-primary font-semibold mb-2">
                {sellerContactLanguage?.emailContact}
              </label>
              <input
                type="email"
                value={profileData?.contact.email ?? ""}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text-primary disabled:cursor-not-allowed"
                placeholder="your.email@example.com"
              />
            </div>
            <div className="justify-end">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-3 py-[8px] rounded-md text-third border-gray-200 border-1"
              >
                {global?.buttonEdit}
              </button>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmitAddress)}
          className="bg-white rounded-lg text-sm text-text-primary font-semibold font-sans mb-6"
        >
          <div className="pb-4 pt-4 border-b">
            <h2 className="text-[16px] font-medium mb-2 text-text-primary">
              {sellerContactLanguage?.addressInfoTitle}
            </h2>
            <p className="text-gray-600 text-[14px] font-sans font-normal">
              {sellerContactLanguage?.addressInfoDescription}
            </p>
          </div>
          <div className="pt-6 flex flex-col">
            <h3 className="text-base font-medium mb-3">
              {sellerContactLanguage?.currentAddress}
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {LOCATION_OPTIONS.map((option) => (
                <label
                  key={option}
                  className={`flex items-center py-3 px-4 border rounded-lg cursor-pointer ${
                    locationType === option ? "border-third" : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    checked={locationType === option}
                    onChange={() => {
                      setLocationType(option);
                      if (option === "Thailand") {
                        setValue("country", "Thailand");
                      } else {
                        setValue("country", defaultForeignCountry || "");
                      }
                    }}
                    className="text-blue-600 mr-3"
                  />
                  {option === "Thailand"
                    ? sellerContactLanguage?.thailand
                    : sellerContactLanguage?.international}
                </label>
              ))}
            </div>

            {locationType === "Foreign" ? (
              <>
                <label className="block text-sm mb-1">
                  {sellerContactLanguage?.selectCountry}
                </label>
                <select
                  {...register("country")}
                  value={country}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text-primary ${
                    errors.country ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">-- เลือกประเทศ --</option>
                  {countryOptions.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.country.message}
                  </p>
                )}
              </>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm text-text-primary font-semibold mb-2">
                    {sellerContactLanguage?.addressDetail}
                  </label>
                  <input
                    {...register("addressDetails")}
                    className="w-full px-3 py-2 border placeholder:font-normal placeholder:font-sans border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text-primary"
                    placeholder={sellerContactLanguage?.addressPlaceholder}
                  />
                  {errors.addressDetails && (
                    <p className="text-red-500 text-[12px] font-normal font-sans mt-1">
                      {errors.addressDetails.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <ZipcodeSearch
                    error={errors.zipCode}
                    control={control}
                    setValue={setValue}
                    language={sellerContactLanguage}
                  />
                  <div>
                    <label className="block font-semibold mb-1">
                      {sellerContactLanguage?.subDistrict}
                    </label>
                    <input
                      placeholder={sellerContactLanguage?.subDistrict}
                      {...register("subdistrictOrDistrict")}
                      className="placeholder:font-normal w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text-primary"
                    />
                    {errors.subdistrictOrDistrict && (
                      <p className="text-red-500 text-[12px] font-normal font-sans mt-1">
                        {errors.subdistrictOrDistrict.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">
                      {sellerContactLanguage?.district}
                    </label>
                    <input
                      placeholder={sellerContactLanguage?.district}
                      {...register("districtOrSubdistrict")}
                      className="placeholder:font-normal w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text-primary"
                    />
                    {errors.districtOrSubdistrict && (
                      <p className="text-red-500 text-[12px] font-normal font-sans mt-1">
                        {errors.districtOrSubdistrict.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">
                      {sellerContactLanguage?.province}
                    </label>
                    <input
                      placeholder={sellerContactLanguage?.province}
                      {...register("province")}
                      className="placeholder:font-normal w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text-primary"
                    />
                    {errors.province && (
                      <p className="text-red-500 text-[12px] font-normal font-sans mt-1">
                        {errors.province.message}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="pt-10 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {isSubmitting || isUpdateMuting ? (
                  <span>{global?.buttonSave}...</span>
                ) : (
                  global?.buttonSave
                )}
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
          language={contactInfoLanguageData}
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
          language={contactInfoLanguageData}
        />
      </div>
    </div>
  );
};

export default ContactInfo;
