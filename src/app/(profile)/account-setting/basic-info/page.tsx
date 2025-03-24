"use client";
import ImageUploadModal from "@/components/AvatarUploadModal";
import PasswordChangeModal from "@/components/ChangePasswordModal";
import { ProfileImage } from "@/constants/images";
import { LanguageFile } from "@/constants/language";
import { usePrivatePost } from "@/hooks/api-hooks";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { convertBase64ToBlobUrl } from "@/utils/convertBase64ToBlobUrl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function BasicInformation() {
  const {
    data: languageData,
    isLoading,
    error,
  } = useGlobalTranslate(LanguageFile.BASIC_INFO);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageUpload = (imageUrl: string) => {
    setProfileImage(imageUrl);
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

  const { trigger, isMutating } = usePrivatePost("/image");

  const handleUpdateProfile = async () => {
    try {
      const res = await trigger({ profileImage });
      console.log("res", res);
    } catch (error) {
      console.error("Lỗi khi cập nhật hồ sơ:", error);
    }
  };

  useEffect(() => {
    const isChangingImage = localStorage.getItem("changingImage");
    if (isChangingImage) {
      localStorage.removeItem("changingImage");
      setTimeout(() => {
        handleSelectFile();
      }, 300);
    }
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (isMutating) return <p>Loading...</p>;
  if (error) return <p>Error loading data.</p>;

  return (
    <div>
      <div className="border-1 border-border_primary rounded-lg bg-white py-6">
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
                src={
                  profileImage
                    ? convertBase64ToBlobUrl(profileImage)
                    : ProfileImage.avatar
                }
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
                type="text"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-text_secondary font-sans"
                defaultValue="uykpfzno"
                readOnly
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
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-text_secondary"
              defaultValue="uykpfzno"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm text-text_primary font-semibold text-gray-600 mb-2">
              {languageData?.label_birthdate}
            </label>
            <div className="grid grid-cols-3 gap-4">
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-text_secondary">
                <option>14</option>
              </select>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-text_secondary">
                <option>ตุลาคม</option>
              </select>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-text_secondary">
                <option>2009</option>
              </select>
            </div>
          </div>
          <div className="self-end w-fit">
            <button
              onClick={handleUpdateProfile}
              className="w-full bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>
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
    </div>
  );
}
