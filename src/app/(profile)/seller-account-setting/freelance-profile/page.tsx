"use client";
import { API_ROUTES } from "@/api/endpoints";
import Error from "@/app/error";
import ImageUploadModal from "@/components/AvatarUploadModal";
import Loading from "@/components/Loading";
import { ProfileImage } from "@/constants/images";
import { usePrivateImagePost } from "@/hooks/api-hooks";
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

  const {
    selectedImage,
    setSelectedImage,
    isImageModalOpen,
    fileInputRef,
    handleFileChange,
    handleSelectFile,
    handleImageUpload,
    closeImageModal,
  } = useImageUpload(profileData?.user?.avatar_url);

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

  console.log(isUploadMuting, errors, isSubmitting, isUpdateMuting);

  if (isLoadingProfile) return <Loading />;
  if (isErrorProfile) return <Error />;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-md shadow-sm overflow-hidden"
    >
      <div className="border-b border-gray-200 p-5">
        <h2 className="text-lg font-medium text-gray-800">
          Thông tin tài khoản freelancer
        </h2>
        <p className="text-sm text-gray-500">
          Thiết lập thông tin cơ bản của bạn
        </p>
      </div>

      <div className="p-6 grid grid-cols-1 gap-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6 mb-6">
          <div className="md:w-2/3">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Username sẽ hiển thị trong URL, chỉnh sửa username có thể ảnh
                hưởng đến kết quả tìm kiếm trên Google
              </p>
              <div className="flex">
                <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  Fastlance.vn/user/
                </span>
                <input
                  {...register("username")}
                  className="text-text_primary flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                Tên hiển thị trên hệ thống
              </label>
              <p className="text-xs text-gray-500 mb-2 ">
                Nên sử dụng tên thật để tăng độ uy tín
              </p>
              <input
                {...register("display_name")}
                className="text-text_primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.display_name && (
                <p className="text-red-500 text-[12px] font-sans mt-1">
                  {errors.display_name.message}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại freelancer
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Chỉ sử dụng để cài thiện hệ thống, nếu bạn còn là sinh viên, vui
                lòng chọn Bán thời gian
              </p>
              <div className="flex space-x-4">
                <label
                  className={`flex items-center border rounded-md px-4 py-2 cursor-pointer ${
                    watch("freelancer_type") === "Parttime" && "border-third"
                  }`}
                >
                  <input
                    type="radio"
                    className="mr-2 text-third"
                    value="Parttime"
                    {...register("freelancer_type")}
                  />
                  <span className="text-text_primary">Part-time</span>
                </label>
                <label
                  className={`flex items-center border rounded-md px-4 py-2 cursor-pointer ${
                    watch("freelancer_type") === "Fulltime" && "border-third"
                  }`}
                >
                  <input
                    type="radio"
                    {...register("freelancer_type")}
                    value="Fulltime"
                    className="mr-2 text-third"
                  />
                  <span className="text-text_primary">Full-time</span>
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
            Về freelancer
          </label>
          <textarea
            {...register("bio")}
            placeholder="Mô tả ngắn gọn điểm mạnh của bạn để giúp khách hàng quyết định"
            rows={5}
            className="text-text_primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || isUpdateMuting || isUploadMuting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting || isUpdateMuting || isUploadMuting ? (
              <span>บันทึก...</span>
            ) : (
              "บันทึก"
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
