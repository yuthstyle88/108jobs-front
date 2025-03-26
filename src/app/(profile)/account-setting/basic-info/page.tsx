"use client";
import ImageUploadModal from "@/components/AvatarUploadModal";
import PasswordChangeModal from "@/components/ChangePasswordModal";
import { ProfileImage } from "@/constants/images";
import { LanguageFile } from "@/constants/language";
import {
  usePrivateFetch,
  usePrivateImagePost,
  usePrivatePut,
} from "@/hooks/api-hooks";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { useDateOptions } from "@/hooks/useDateOptions";
import { ProfileData } from "@/types/userData";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

interface FormValues {
  display_name: string;
  username: string;
  birth_day: string;
  birth_month: string;
  birth_year: string;
}

interface ImageUploadResponse {
  image_url: string;
}

export default function BasicInformation() {
  const {
    data: languageData,
    isLoading,
    error,
  } = useGlobalTranslate(LanguageFile.BASIC_INFO);

  const { trigger: uploadImage, isMutating: isUploadMuting } =
    usePrivateImagePost<ImageUploadResponse>("/image");
  const { trigger: updateProfile, isMutating: isUpdateMuting } =
    usePrivatePut<ImageUploadResponse>("/profile/info");

  const {
    data: profileData,
    isLoading: isLoadingProfile,
    error: isErrorProfile,
    mutate,
  } = usePrivateFetch<ProfileData>("/profile");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>();

  console.log("register", profileData);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { days, months, years } = useDateOptions();

  // Initialize form from API data
  useEffect(() => {
    if (profileData?.user) {
      const birthDate = profileData.user.birth_date;
      if (birthDate) {
        const [year, month, day] = birthDate.split("-");
        reset({
          display_name: profileData.user.display_name,
          username: profileData.user.username,
          birth_day: day || "day",
          birth_month: month || "month",
          birth_year: year || "year",
        });
      } else {
        reset({
          display_name: profileData.user.display_name,
          username: profileData.user.username,
          birth_day: "day",
          birth_month: "month",
          birth_year: "year",
        });
      }
      setSelectedImage(profileData.user.avatar_url);
    }
  }, [profileData, reset]);

  // console.log("profile",profileData.user.avatar_url);

  const onSubmit = async (formData: FormValues) => {
    try {
      let avatarUrl = profileData?.user.avatar_url;

      if (selectedImage) {
        const formData = new FormData();
        const blob = await fetch(selectedImage).then((res) => res.blob());

        formData.append("images[]", blob, "profile.jpg");
        const result = await uploadImage(formData);
        if (!result?.image_url) throw new Error("Image upload failed");
        avatarUrl = result.image_url;
      }

      const updateData = {
        display_name: formData.display_name,
        username: formData.username,
        birth_date:
          formData.birth_day === "Day" ||
          formData.birth_month === "Month" ||
          formData.birth_year === "Year"
            ? null
            : `${formData.birth_year}-${formData.birth_month}-${formData.birth_day}`,
        avatar_url: avatarUrl || null,
      };

      const response = await updateProfile(updateData);
      console.log("updated profile", response);

      if (!response) throw new Error("Profile update failed");

      await mutate();
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageUpload = async (imageUrl: string) => {
    const blob = await fetch(imageUrl).then((res) => res.blob());
    const formData = new FormData();
    formData.append("image", blob, "profile.jpg");

    setSelectedImage(URL.createObjectURL(blob));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        if (imageData) {
          localStorage.setItem("tempImageData", imageData);
          setIsImageModalOpen(true);
        }
      };
      reader.readAsDataURL(file);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  if (isLoading || isLoadingProfile) return <p>Loading...</p>;
  if (error || isErrorProfile) return <p>Error loading data.</p>;

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border-1 border-border_primary rounded-lg bg-white py-6"
      >
        <div className="border-b-1 px-6">
          <h2 className="text-[16px] font-medium mb-2 text-text_primary">
            {languageData?.section_account_info}
          </h2>
          <p className="text-gray-600 mb-6 text-[14px] font-sans">
            {languageData?.subtitle_account_info}
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
            <label className="block text-sm text-text_primary font-semibold mb-2">
              {languageData?.label_username}
            </label>
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">fastwork.co/user/</span>
              <input
                {...register("username")}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-text_secondary font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-text_primary font-semibold text-gray-600 mb-2">
              {languageData?.label_display_name}
            </label>
            <p className="text-[12px] text-gray-500 mb-2">
              ตรงนี้คือชื่อที่ผู้บันทึกการเพื่อสร้างความน่าเชื่อถือ
            </p>
            <input
              {...register("display_name", {
                required: languageData?.account_info,
                validate: (value) =>
                  value.trim().length > 0 || "Invalid display name",
              })}
              className="text-text_primary w-full px-4 py-2 border border-border_primary rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.display_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.display_name.message}
              </p>
            )}
          </div>

          <div className="col-span-2">
            <label className="block text-sm text-text_primary font-semibold text-gray-600 mb-2">
              {languageData?.label_birthdate}
            </label>
            <div className="grid grid-cols-3 gap-4">
              <select
                {...register("birth_day", {
                  required: languageData?.account_info,
                })}
                className="border border-gray-300 rounded-lg px-3 py-2 text-text_secondary"
              >
                <option disabled value="">Day</option>
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              <select
                {...register("birth_month", {
                  required: languageData?.account_info,
                })}
                className="border border-gray-300 rounded-lg px-3 py-2 text-text_secondary"
              >
                <option disabled value="">Month</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                {...register("birth_year", {
                  required: languageData?.account_info,
                })}
                className="border border-gray-300 rounded-lg px-3 py-2 text-text_secondary"
              >
                <option disabled value="">Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            {(errors.birth_day || errors.birth_month || errors.birth_year) && (
              <p className="text-red-500 text-sm mt-1">
                {languageData?.account_info}
              </p>
            )}
          </div>
          <div className="self-end w-fit">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isSubmitting || isUpdateMuting || isUploadMuting ? (
                <span>บันทึก...</span>
              ) : (
                "บันทึก"
              )}
            </button>
          </div>
        </div>
      </form>
      <div className="border-1 border-border_primary rounded-lg bg-white mt-5 p-6 flex flex-row justify-between">
        <div className="text-[16px] text-text_primary font-medium">
          {languageData?.section_password}
          <p className="text-[14px] text-text_secondary font-normal">
            {languageData?.password_description}
          </p>
        </div>
        <div className="self-end w-fit">
          <button
            onClick={openModal}
            className="w-full bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {languageData?.button_set_password}
          </button>
        </div>
      </div>
      <PasswordChangeModal isOpen={isModalOpen} onClose={closeModal} />
      <ImageUploadModal
        isOpen={isImageModalOpen}
        onClose={closeImageModal}
        onImageUpload={handleImageUpload}
      />
    </>
  );
}
