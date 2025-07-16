"use client";
import Error from "@/app/error";
import ImageUploadModal from "@/components/AvatarUploadModal";
import PasswordChangeModal from "@/components/ChangePasswordModal";
import Loading from "@/components/Loading";
import { ProfileImage } from "@/constants/images";
import { LanguageFile } from "@/constants/language";
import { usePrivateImagePost } from "@/hooks/api-hooks";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { useDateOptions } from "@/hooks/useDateOptions";
import Image from "next/image";
import { useState } from "react";
import { useBasicInfoForm } from "../hooks/useBasicInfoForm";
import { useImageUpload } from "../hooks/useImageUpload";
import { useProfileForm } from "../hooks/useProfileForm";
import { ImageUploadResponse } from "@/types/image";
import { API_ROUTES } from "@/api/endpoints";

export default function BasicInformation() {
  const { data: languageData } = useGlobalTranslate(LanguageFile.BASIC_INFO);
  const { days, months, years } = useDateOptions();
  const { trigger: uploadImage, isMutating: isUploadMuting } =
    usePrivateImagePost<ImageUploadResponse, FormData>(API_ROUTES.image.upload);

  const { profileData, isLoadingProfile, isErrorProfile, mutate } =
    useBasicInfoForm();

  const {
    selectedImage,
    setSelectedImage,
    isImageModalOpen,
    fileInputRef,
    handleFileChange,
    handleSelectFile,
    handleImageUpload,
    closeImageModal,
  } = useImageUpload(profileData?.user?.avatarUrl);

  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isUpdateMuting,
    onSubmit,
  } = useProfileForm(
    profileData,
    selectedImage,
    uploadImage,
    mutate,
    setSelectedImage
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (isLoadingProfile) return <Loading />;
  if (isErrorProfile) return <Error />;

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border-1 border-borderPrimary rounded-lg bg-white py-6"
      >
        <div className="border-b-1 px-6">
          <h2 className="text-[16px] font-medium mb-2 text-textPrimary">
            {languageData?.sectionAccountInfo}
          </h2>
          <p className="text-gray-600 mb-6 text-[14px] font-sans">
            {languageData?.subtitleAccountInfo}
          </p>
        </div>

        <div className="flex justify-center my-8 px-6">
          <div className="relative">
            <div
              onClick={handleSelectFile}
              className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer"
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <Image
                src={selectedImage ? selectedImage : ProfileImage.avatar}
                alt="avatar"
                className="w-full h-full rounded-full"
                width={500}
                height={500}
              />
            </div>
            <button
              type="button"
              onClick={handleSelectFile}
              className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2"
            >
              <svg
                className="w-4 h-4 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6 px-6 font-sans">
          <div>
            <label className="block text-sm text-textPrimary font-semibold mb-2">
              {languageData?.labelUsername}
            </label>
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">fastwork.co/user/</span>
              <input
                {...register("username")}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-textPrimary font-sans outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-textPrimary font-semibold text-gray-600 mb-2">
              {languageData?.labelDisplayName}
            </label>
            <p className="text-[12px] text-gray-500 mb-2">
              {languageData?.nameTrustNote}
            </p>
            <input
              {...register("displayName", {
                required: languageData?.accountInfo,
                validate: (value) =>
                  value.trim().length > 0 || "Invalid display name",
              })}
              className="text-textPrimary w-full px-4 py-2 border border-borderPrimary rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.displayName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.displayName.message}
              </p>
            )}
          </div>

          <div className="col-span-2">
            <label className="block text-sm text-textPrimary font-semibold text-gray-600 mb-2">
              {languageData?.labelBirthdate}
            </label>
            <div className="grid grid-cols-3 gap-4">
              <select
                {...register("birthDay")}
                defaultValue="Day"
                className="border border-gray-300 rounded-lg px-3 py-2 text-textPrimary"
              >
                <option disabled value="Day">
                  Day
                </option>
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              <select
                {...register("birthMonth")}
                defaultValue="Month"
                className="border border-gray-300 rounded-lg px-3 py-2 text-textPrimary"
              >
                <option disabled value="Month">
                  Month
                </option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                {...register("birthYear")}
                defaultValue="Year"
                className="border border-gray-300 rounded-lg px-3 py-2 text-textPrimary"
              >
                <option disabled value="Year">
                  Year
                </option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="self-end w-fit">
            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-button px-4 py-2"
            >
              {isSubmitting || isUpdateMuting || isUploadMuting ? (
                <span>{languageData?.save}...</span>
              ) : (
                languageData?.save
              )}
            </button>
          </div>
        </div>
      </form>

      <div className="border-1 border-borderPrimary rounded-lg bg-white mt-5 p-6 flex flex-col gap-4 sm:gap-0 sm:flex-row justify-between">
        <div className="text-[16px] text-textPrimary font-medium">
          {languageData?.sectionPassword}
          <p className="text-[14px] text-textSecondary font-normal">
            {languageData?.passwordDescription}
          </p>
        </div>
        <div className="self-end w-full sm:w-fit">
          <button
            onClick={openModal}
            className="w-full bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {languageData?.buttonSetPassword}
          </button>
        </div>
      </div>

      <PasswordChangeModal isOpen={isModalOpen} onClose={closeModal} languageData={languageData}/>
      <ImageUploadModal
        isOpen={isImageModalOpen}
        onClose={closeImageModal}
        onImageUpload={handleImageUpload}
      />
    </>
  );
}
