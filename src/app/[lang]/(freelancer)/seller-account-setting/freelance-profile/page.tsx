"use client";
import { API_ROUTES } from "@/api/endpoints";
import Error from "@/app/error";
import ImageUploadModal from "@/components/AvatarUploadModal";
import Loading from "@/components/Loading";
import { ProfileImage } from "@/constants/images";
import { LanguageFile } from "@/constants/language";
import { usePrivateImagePost } from "@/hooks/api-hooks";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { ImageUploadResponse } from "@/types/image";
import Image from "next/image";
import { useBasicInfoForm } from "../hooks/useBasicInfoForm";
import { useImageUpload } from "../hooks/useImageUpload";
import { useProfileForm } from "../hooks/useProfileForm";

const AccountSettings = () => {
  const { trigger: uploadImage, isMutating: isUploadMuting } =
    usePrivateImagePost<ImageUploadResponse, FormData>(API_ROUTES.image.upload);

  const { profileData, isLoadingProfile, isErrorProfile, mutate } =
    useBasicInfoForm();

  const { data: sellerProfileLanguage } = useGlobalTranslate(
    LanguageFile.SELLER_FREELANCER_PROFILE
  );

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
    watch,
  } = useProfileForm(
    profileData,
    selectedImage,
    uploadImage,
    mutate,
    setSelectedImage
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
          {sellerProfileLanguage?.freelancerAccountInfoTitle}
        </h2>
        <p className="text-sm text-gray-500">
          {sellerProfileLanguage?.freelancerAccountInfoSubtitle}
        </p>
      </div>

      <div className="p-6 grid grid-cols-1 gap-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6 mb-6">
          <div className="md:w-2/3">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {sellerProfileLanguage?.usernameLabel}
              </label>
              <p className="text-xs text-gray-500 mb-2">
                {sellerProfileLanguage?.usernameNote}
              </p>
              <div className="flex">
                <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  Fastjob.co/user/
                </span>
                <input
                  {...register("username")}
                  className="text-text-primary flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-[12px] font-sans mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {sellerProfileLanguage?.displayNameLabel}
              </label>
              <p className="text-xs text-gray-500 mb-2 ">
                {sellerProfileLanguage?.displayNameNote}
              </p>
              <input
                {...register("displayName")}
                className="text-text-primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.displayName && (
                <p className="text-red-500 text-[12px] font-sans mt-1">
                  {errors.displayName.message}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {sellerProfileLanguage?.freelancerTypeLabel}
              </label>
              <p className="text-xs text-gray-500 mb-2">
                {sellerProfileLanguage?.freelancerTypeNote}
              </p>
              <div className="flex space-x-4">
                <label
                  className={`flex items-center border rounded-md px-4 py-2 cursor-pointer ${
                    watch("freelancerType") === "Parttime" && "border-third"
                  }`}
                >
                  <input
                    type="radio"
                    className="mr-2 text-third"
                    value="Parttime"
                    {...register("freelancerType")}
                  />
                  <span className="text-text-primary">
                    {sellerProfileLanguage?.partTime}
                  </span>
                </label>
                <label
                  className={`flex items-center border rounded-md px-4 py-2 cursor-pointer ${
                    watch("freelancerType") === "Fulltime" && "border-third"
                  }`}
                >
                  <input
                    type="radio"
                    {...register("freelancerType")}
                    value="Fulltime"
                    className="mr-2 text-third"
                  />
                  <span className="text-text-primary">
                    {sellerProfileLanguage?.fullTime}
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="md:w-1/3 flex flex-col items-center">
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
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {sellerProfileLanguage?.aboutFreelancerLabel}
          </label>
          <textarea
            {...register("bio")}
            placeholder="Mô tả ngắn gọn điểm mạnh của bạn để giúp khách hàng quyết định"
            rows={5}
            className="text-text-primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || isUpdateMuting || isUploadMuting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting || isUpdateMuting || isUploadMuting ? (
              <span>{sellerProfileLanguage?.saveButton}...</span>
            ) : (
              sellerProfileLanguage?.saveButton
            )}
          </button>
        </div>
      </div>
      <ImageUploadModal
        isOpen={isImageModalOpen}
        onClose={closeImageModal}
        onImageUpload={handleImageUpload}
      />
    </form>
  );
};

export default AccountSettings;
