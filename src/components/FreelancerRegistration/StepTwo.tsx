"use client";
import Image from "next/image";
import React from "react";
import { useSingleImageUpload } from "./hooks/useSingleImageUpload";
import { ApplyToBeFreelancerLanguage } from "@/types/language";

interface StepTwoProps {
  formData: {
    avatar_url: string | null;
  };
  updateFormData: (data: { avatar_url: string | null }) => void;
  nextStep: () => void;
  applyFreelancerLanguage:Partial<ApplyToBeFreelancerLanguage> | undefined | null;
}

const StepTwo: React.FC<StepTwoProps> = ({
  formData,
  updateFormData,
  nextStep,
  applyFreelancerLanguage
}) => {
  const {
    imageUrl,
    isUploading,
    error,
    fileInputRef,
    handleFileChange,
    handleSelectFile,
    resetImage,
  } = useSingleImageUpload(formData.avatar_url, (uploadedUrl) => {
    updateFormData({ avatar_url: uploadedUrl });
  });

  return (
    <div className="p-6 flex flex-col h-full justify-center">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text_primary">
          {applyFreelancerLanguage?.choose_profile_picture}
        </h2>
        <p className="text-text_secondary mt-2">
         {applyFreelancerLanguage?.profile_picture_tip}
        </p>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* LEFT: Image upload */}
        <div className="w-full md:w-1/2 mb-6 md:mb-0">
          <div className="flex items-center justify-center flex-col">
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
            />

            {imageUrl ? (
              <div className="relative">
                <div className="w-48 h-48 bg-gray-200 rounded-full overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                    width={500}
                    height={500}
                  />
                </div>
                {isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full ">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <button
                  onClick={handleSelectFile}
                  className="absolute bottom-2 right-2 bg-third text-white p-2 rounded-full shadow-md"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div
                onClick={handleSelectFile}
                className="w-48 h-48 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
              >
                <div className="text-center">
                  <svg
                    className="w-12 h-12 mx-auto text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span className="text-sm text-gray-500 mt-2 block">
                    {applyFreelancerLanguage?.upload_profile_picture}
                  </span>
                </div>
              </div>
            )}

            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

            {imageUrl && (
              <button
                onClick={() => {
                  resetImage();
                  updateFormData({ avatar_url: null });
                }}
                className="mt-4 text-red-500 hover:text-red-700 text-sm"
              >
                {applyFreelancerLanguage?.delete_image}
              </button>
            )}
          </div>
        </div>

        {/* RIGHT: Preview card */}
        <div className="w-full md:w-1/2">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-lg text-text_primary mb-4">
              {applyFreelancerLanguage?.preview_profile}
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 flex items-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden mr-4">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    width={500}
                    height={500}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300" />
                )}
              </div>
              <div>
                <div className="h-4 w-32 bg-gray-300 rounded mb-2" />
                <div className="h-3 w-24 bg-gray-300 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NEXT BUTTON */}
      <div className="flex justify-center mt-16">
        <button
          onClick={nextStep}
          disabled={!imageUrl || isUploading}
          className={`px-6 py-2 rounded-lg flex items-center ${
            !imageUrl || isUploading
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-third text-white"
          }`}
        >
          {applyFreelancerLanguage?.save_and_continue}
          <svg
            className="w-5 h-5 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default StepTwo;
