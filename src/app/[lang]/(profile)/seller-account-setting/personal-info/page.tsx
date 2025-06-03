"use client";
import { API_ROUTES } from "@/api/endpoints";
import Error from "@/app/error";
import Loading from "@/components/Loading";
import { ProfileImage } from "@/constants/images";
import { usePrivateImagePost } from "@/hooks/api-hooks";
import { useDateOptions } from "@/hooks/useDateOptions";
import { ImageUploadResponse } from "@/types/image";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { useBasicInfoForm } from "../hooks/useBasicInfoForm";
import { useImagePreviewOnly } from "../hooks/useImagePreviewOnly";
import { usePersonalInfoForm } from "../hooks/usePersonalInfoForm";
import { InputError } from "@/components/ui/InputError";
import ErrorModal from "@/components/ui/ErrorModal";
import { LanguageFile } from "@/constants/language";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";

const PersonalInfo = () => {
  const { trigger: uploadImage, isMutating: isUploadMuting } =
    usePrivateImagePost<ImageUploadResponse, FormData>(API_ROUTES.image.upload);

  const { profileData, isLoadingProfile, isErrorProfile, mutate } =
    useBasicInfoForm();

  const { data: sellerPersonalInfoLanguage } = useGlobalTranslate(
      LanguageFile.SELLER_PERSONAL_INFO
    );

    const { data: global } = useGlobalTranslate(
        LanguageFile.GLOBAL
      );

  const { days, months, years } = useDateOptions();
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const {
    file: frontFile,
    previewUrl: frontPreview,
    handleSelectImage: handleSelectFront,
    setPreviewUrl: setSelectedFront,
  } = useImagePreviewOnly(profileData?.card.front_card);

  const {
    file: backFile,
    previewUrl: backPreview,
    handleSelectImage: handleSelectBack,
    setPreviewUrl: setSelectedBack,
  } = useImagePreviewOnly(profileData?.card.back_card);

  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isUpdateMuting,
    onSubmit,
  } = usePersonalInfoForm(
    profileData,
    frontFile,
    backFile,
    frontPreview,
    backPreview,
    uploadImage,
    mutate,
    setSelectedFront,
    setSelectedBack
  );

  if (isLoadingProfile) return <Loading />;
  if (isErrorProfile) return <Error />;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-md shadow-sm overflow-hidden"
    >
      <div className="border-b border-gray-200 p-5">
        <h2 className="text-lg font-medium text-gray-800">
          {sellerPersonalInfoLanguage?.id_info_title}
        </h2>
        <p className="text-sm text-gray-500">{sellerPersonalInfoLanguage?.id_info_description}</p>
      </div>

      <div className="p-6">
        <div className="pb-2">
          {errors.root && <ErrorModal message={errors.root.message} />}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* ID front */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
            <h4 className="text-sm font-medium mb-1 text-text_primary">
              {sellerPersonalInfoLanguage?.front_id_image}
            </h4>
            <p className="text-xs text-gray-500 mb-3">{sellerPersonalInfoLanguage?.image_hint}</p>
            <div className="relative border border-gray-200 rounded-lg overflow-hidden mb-3">
              {frontPreview ? (
                <>
                  <Image
                    src={frontPreview}
                    alt="ID front"
                    className="w-full h-60 object-contain"
                    width={500}
                    height={500}
                  />
                  <button
                    onClick={() => setSelectedFront("")}
                    className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 rounded-full p-1 text-white hover:bg-opacity-90"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <Image
                  src={ProfileImage.front_card}
                  alt="ID back"
                  className="w-full h-60 object-contain"
                  width={500}
                  height={500}
                />
              )}
            </div>
            <input
              type="file"
              ref={frontInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleSelectFront(file);
              }}
            />
            <button
              type="button"
              onClick={() => frontInputRef.current?.click()}
              className="w-full py-2 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {frontPreview ?  sellerPersonalInfoLanguage?.change_image : sellerPersonalInfoLanguage?.change_image}
            </button>
          </div>

          {/* ID back */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
            <h4 className="text-sm font-medium mb-1 text-text_primary">
              {sellerPersonalInfoLanguage?.back_id_image}
            </h4>
            <p className="text-xs text-gray-500 mb-3">{sellerPersonalInfoLanguage?.image_hint}</p>
            <div className="relative border border-gray-200 rounded-lg overflow-hidden mb-3">
              {backPreview ? (
                <>
                  <Image
                    src={backPreview}
                    alt="ID back"
                    className="w-full h-60 object-contain"
                    width={500}
                    height={500}
                  />
                  <button
                    onClick={() => setSelectedBack("")}
                    className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 rounded-full p-1 text-white hover:bg-opacity-90"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <Image
                  src={ProfileImage.back_card}
                  alt="ID back"
                  className="w-full h-60 object-contain"
                  width={500}
                  height={500}
                />
              )}
            </div>
            <input
              type="file"
              ref={backInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleSelectBack(file);
              }}
            />
            <button
              type="button"
              onClick={() => backInputRef.current?.click()}
              className="w-full py-2 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {backPreview ? sellerPersonalInfoLanguage?.change_image : sellerPersonalInfoLanguage?.change_image}
            </button>
          </div>
        </div>

        {/* ... Các phần form còn lại ... */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {sellerPersonalInfoLanguage?.first_name}
            </label>
            <input
              {...register("name")}
              className="text-text_primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <InputError message={errors.name?.message} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {sellerPersonalInfoLanguage?.last_name}
            </label>
            <input
              {...register("surname")}
              className="text-text_primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <InputError message={errors.surname?.message} />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {sellerPersonalInfoLanguage?.id_number}
          </label>
          <input
            {...register("card_number")}
            className="text-text_primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <InputError message={errors.card_number?.message} />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {sellerPersonalInfoLanguage?.date_of_birth}
          </label>
          <div className="grid grid-cols-3 gap-4">
            <select
              {...register("birth_day")}
              className="border border-gray-300 rounded-lg px-3 py-2 text-text_primary"
            >
              <option disabled value="Day">
                วัน
              </option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <select
              {...register("birth_month")}
              className="border border-gray-300 rounded-lg px-3 py-2 text-text_primary"
            >
              <option disabled value="Month">
                เดือน
              </option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <select
              {...register("birth_year")}
              className="border border-gray-300 rounded-lg px-3 py-2 text-text_primary"
            >
              <option disabled value="Year">
                ปี
              </option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <InputError
            message={
              errors.birth_day?.message ||
              errors.birth_month?.message ||
              errors.birth_year?.message
            }
          />
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            {sellerPersonalInfoLanguage?.address_info_title}
          </h3>
          <p className="text-sm text-gray-500 mb-2">
            {sellerPersonalInfoLanguage?.address_info_note}
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {sellerPersonalInfoLanguage?.address_detail}
            </label>
            <input
              {...register("card_address_details")}
              className="text-text_primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <InputError message={errors.card_address_details?.message} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
               {sellerPersonalInfoLanguage?.postal_code}
              </label>
              <input
                {...register("card_zip_code")}
                className="text-text_primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <InputError message={errors.card_zip_code?.message} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {sellerPersonalInfoLanguage?.sub_district}
              </label>
              <input
                {...register("card_subdistrict_or_district")}
                className="text-text_primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <InputError
                message={errors.card_subdistrict_or_district?.message}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {sellerPersonalInfoLanguage?.district}
              </label>
              <input
                {...register("card_district_or_subdistrict")}
                className="text-text_primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <InputError
                message={errors.card_district_or_subdistrict?.message}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {sellerPersonalInfoLanguage?.province}
              </label>
              <input
                {...register("card_province")}
                className="text-text_primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <InputError message={errors.card_province?.message} />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || isUpdateMuting || isUploadMuting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isSubmitting || isUpdateMuting || isUploadMuting ? (
              <span>{global?.button_save}...</span>
            ) : (
              global?.button_save
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PersonalInfo;
