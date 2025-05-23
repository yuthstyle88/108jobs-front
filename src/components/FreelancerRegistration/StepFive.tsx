"use client";
import Image from "next/image";
import React from "react";
import { useSingleImageUpload } from "./hooks/useSingleImageUpload";
import { ApplyToBeFreelancerLanguage } from "@/types/language";
import LoadingCircle from "../LoadingCircle";

interface StepFiveProps {
  formData: {
    front_card: string | null;
    back_card: string | null;
  };
  updateFormData: (data: {
    front_card?: string | null;
    back_card?: string | null;
  }) => void;
  nextStep: () => void;
  applyFreelancerLanguage:
    | Partial<ApplyToBeFreelancerLanguage>
    | undefined
    | null;
}

const StepFive: React.FC<StepFiveProps> = ({
  formData,
  updateFormData,
  nextStep,
  applyFreelancerLanguage,
}) => {
  const {
    imageUrl: frontImage,
    fileInputRef: frontInputRef,
    handleFileChange: handleFrontChange,
    handleSelectFile: selectFrontFile,
    resetImage: resetFront,
    isUploading: isFrontUploading,
    error: frontError,
  } = useSingleImageUpload(formData.front_card, (url) =>
    updateFormData({ front_card: url })
  );

  const {
    imageUrl: backImage,
    fileInputRef: backInputRef,
    handleFileChange: handleBackChange,
    handleSelectFile: selectBackFile,
    resetImage: resetBack,
    isUploading: isBackUploading,
    error: backError,
  } = useSingleImageUpload(formData.back_card, (url) =>
    updateFormData({ back_card: url })
  );

  const isFormValid = frontImage && backImage;

  return (
    <div className="flex flex-col w-full min-h-60 bg-white rounded-lg shadow-jobCard">
      <div className="py-0 md:py-6 2xl:py-12 flex flex-1 flex-col mx-auto gap-4 w-full max-w-screen-lg h-full">
        <div className="flex flex-col gap-2 justify-between h-full w-full px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-text_primary">
              {applyFreelancerLanguage?.verify_identity}
            </h2>
            <p className="text-text_secondary mt-2">
              {applyFreelancerLanguage?.upload_id_instruction}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* FRONT CARD */}
            <div className="border border-gray-200 rounded-lg p-4 shadow-categoryMenu">
              <h3 className="font-medium text-lg text-text_primary">
                {applyFreelancerLanguage?.upload_id_front}
              </h3>
              <p className="text-[12px] text-text_secondary mb-6">
                {applyFreelancerLanguage?.id_front_instruction}
              </p>

              <input
                type="file"
                className="hidden"
                ref={frontInputRef}
                onChange={handleFrontChange}
                accept="image/*"
              />

              {frontImage ? (
                <div className="relative mb-4">
                  <Image
                    src={frontImage}
                    alt="National ID Front"
                    className="w-full h-60 object-contain border border-gray-200 rounded-lg bg-gray-50"
                    width={500}
                    height={500}
                  />
                  {isFrontUploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  <button
                    onClick={resetFront}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <div
                  onClick={selectFrontFile}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-14 mb-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <svg
                    className="w-12 h-12 mx-auto text-gray-400 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-gray-500">
                    {applyFreelancerLanguage?.choose_id_front}
                  </p>
                </div>
              )}

              <button
                onClick={selectFrontFile}
                className="w-full py-2 bg-third text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={isFrontUploading}
              >
                {isFrontUploading ? (
                  <LoadingCircle />
                ) : (
                  applyFreelancerLanguage?.change_image
                )}
              </button>

              {frontError && (
                <p className="text-sm text-red-500 mt-2">{frontError}</p>
              )}
            </div>

            {/* BACK CARD */}
            <div className="border border-gray-200 rounded-lg p-4 shadow-categoryMenu">
              <h3 className="font-medium text-lg text-text_primary">
                {applyFreelancerLanguage?.upload_id_back}
              </h3>
              <p className="text-[12px] text-text_secondary mb-6">
                {applyFreelancerLanguage?.id_back_instruction}
              </p>

              <input
                type="file"
                className="hidden"
                ref={backInputRef}
                onChange={handleBackChange}
                accept="image/*"
              />

              {backImage ? (
                <div className="relative mb-4">
                  <Image
                    src={backImage}
                    alt="National ID Back"
                    className="w-full h-60 object-contain border border-gray-200 rounded-lg bg-gray-50"
                    width={500}
                    height={500}
                  />
                  {isBackUploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  <button
                    onClick={resetBack}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <div
                  onClick={selectBackFile}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-14 mb-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <svg
                    className="w-12 h-12 mx-auto text-gray-400 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-gray-500">
                    {applyFreelancerLanguage?.choose_id_back}
                  </p>
                </div>
              )}

              <button
                onClick={selectBackFile}
                className="w-full py-2 bg-third text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={isBackUploading}
              >
                {isBackUploading ? (
                  <LoadingCircle />
                ) : (
                  applyFreelancerLanguage?.change_image
                )}
              </button>

              {backError && (
                <p className="text-sm text-red-500 mt-2">{backError}</p>
              )}
            </div>
          </div>

          <div className="w-full mt-8">
            <button
              onClick={nextStep}
              disabled={!isFormValid || isFrontUploading || isBackUploading}
              className={`w-full px-6 py-2 rounded-lg flex justify-center items-center ${
                !isFormValid || isFrontUploading || isBackUploading
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
      </div>
    </div>
  );
};

export default StepFive;
