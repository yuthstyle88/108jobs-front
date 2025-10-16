"use client";
import ImageUploadModal from "@/components/Common/Modal/AvatarUploadModal";
import PasswordChangeModal from "@/components/ChangePasswordModal";
import { ProfileImage } from "@/constants/images";
import { useMyUser } from "@/hooks/profile-api/useMyUser";
import { useHttpPost } from "@/hooks/useHttpPost";
import { useImagePicker } from "@/hooks/useImagePicker";
import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {useProfileForm} from "@/app/[lang]/(profile)/account-setting/hooks/useProfileForm";

export default function BasicInformation() {
    const { t } = useTranslation();
    const { execute: uploadUserAvatar } = useHttpPost("uploadUserAvatar");
    const { profileState, person, card } = useMyUser();

    // Avatar image picker
    const {
        selectedImage: selectedAvatar,
        setSelectedImage: setSelectedAvatar,
        isImageModalOpen: isAvatarModalOpen,
        fileInputRef: avatarFileInputRef,
        handleFileChange: handleAvatarFileChange,
        handleSelectFile: handleSelectAvatarFile,
        handleImageUpload: handleAvatarImageUpload,
        closeImageModal: closeAvatarImageModal,
    } = useImagePicker(profileState === "success" ? person?.avatar : undefined);

    const {
        register,
        handleSubmit,
        errors,
        isSubmitting,
        onSubmit,
    } = useProfileForm(person, card, selectedAvatar, uploadUserAvatar, setSelectedAvatar, [], []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="border border-border-primary rounded-lg bg-white py-6 mb-8"
            >
                <div className="border-b border-border-primary px-6">
                    <h2 className="text-[16px] font-medium mb-2 text-text-primary">
                        {t("profileInfo.sectionAccountInfo")}
                    </h2>
                    <p className="text-gray-600 mb-6 text-[14px] font-sans">
                        {t("profileInfo.subtitleAccountInfo")}
                    </p>
                </div>

                <div className="flex justify-center my-8 px-6">
                    <div className="relative">
                        <div
                            onClick={handleSelectAvatarFile}
                            className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer"
                        >
                            <input
                                type="file"
                                ref={avatarFileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleAvatarFileChange}
                            />
                            <Image
                                src={selectedAvatar ? selectedAvatar : ProfileImage.avatar}
                                alt="avatar"
                                className="w-full h-full rounded-full"
                                width={500}
                                height={500}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleSelectAvatarFile}
                            className="absolute bottom-0 right-0 bg-primary rounded-full p-2"
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
                        <label className="block text-sm text-text-primary font-semibold mb-2">
                            {t("profileInfo.labelUsername")}
                        </label>
                        <div className="flex items-center">
                            <span className="text-gray-500 mr-2">108jobs.com/user/</span>
                            <input
                                {...register("username")}
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-text-primary font-sans outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-text-primary font-semibold text-gray-600 mb-2">
                            {t("profileInfo.labelDisplayName")}
                        </label>
                        <p className="text-[12px] text-gray-500 mb-2">
                            {t("profileInfo.nameTrustNote")}
                        </p>
                        <input
                            {...register("displayName", {
                                required: t("profileInfo.accountInfo"),
                                validate: (value) =>
                                    value.trim().length > 0 || t("profileInfo.invalidDisplayName"),
                            })}
                            className="text-text-primary w-full px-4 py-2 border border-border-primary rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.displayName && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.displayName.message}
                            </p>
                        )}
                    </div>

                    <div className="col-span-2">
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                {t("profileInfo.bio")}
                            </label>
                            <textarea
                                {...register("bio")}
                                placeholder={t("profileInfo.bioPlaceholder")}
                                rows={5}
                                className="text-text-primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            ></textarea>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                {t("profileInfo.sectionCoreSkills")}
                            </label>
                            <p className="text-[12px] text-gray-500 mb-2">
                                {t("profileInfo.subtitleCoreSkills")}
                            </p>
                            <div className="flex items-center gap-4">
                                <input
                                    {...register("skills")}
                                    type="text"
                                    placeholder={t("profileInfo.coreSkillPlaceholder")}
                                    className="text-text-primary flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>

                        <div className="mt-6 text-text-primary">
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                {t("profileInfo.sectionContactInfo")}
                            </label>
                            <p className="text-[12px] text-gray-500 mb-2">
                                {t("profileInfo.subtitleContactInfo")}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                  <textarea
                      {...register("contacts")}
                      placeholder={t("profileInfo.customContactPlaceholder")}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                      rows={3}
                  />
                                    {errors.contacts && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.contacts.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="self-end w-fit">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="submit-button px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#063a68] transition-colors duration-200"
                        >
                            {isSubmitting ? (
                                <span>{t("profileInfo.saving")}...</span>
                            ) : (
                                t("profileInfo.save")
                            )}
                        </button>
                    </div>
                </div>
            </form>

            <div className="border border-border-primary rounded-lg bg-white p-6 flex flex-col gap-4 sm:gap-0 sm:flex-row justify-between">
                <div className="text-[16px] text-text-primary font-medium">
                    {t("profileInfo.sectionPassword")}
                    <p className="text-[14px] text-text-secondary font-normal">
                        {t("profileInfo.passwordDescription")}
                    </p>
                </div>
                <div className="self-end w-full sm:w-fit">
                    <button
                        onClick={openModal}
                        className="w-full bg-primary text-white font-medium py-2.5 px-4 rounded-lg hover:bg-[#063a68] transition-colors"
                    >
                        {t("profileInfo.buttonSetPassword")}
                    </button>
                </div>
            </div>

            <PasswordChangeModal isOpen={isModalOpen} onClose={closeModal} />
            <ImageUploadModal
                isOpen={isAvatarModalOpen}
                onClose={closeAvatarImageModal}
                onImageUpload={handleAvatarImageUpload}
                uploadImage={uploadUserAvatar}
            />
        </>
    );
}