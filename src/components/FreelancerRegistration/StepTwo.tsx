import Image from "next/image";
import React, { useRef, useState } from "react";

interface StepTwoProps {
  formData: {
    avatar_url: string | null;
  };
  updateFormData: (data: { avatar_url: string | null }) => void;
  nextStep: () => void;
}

const StepTwo: React.FC<StepTwoProps> = ({
  formData,
  updateFormData,
  nextStep,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      updateFormData({ avatar_url: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    updateFormData({ avatar_url: null });
  };

  return (
    <div className="p-6 flex flex-col h-full justify-center ">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text_primary">
          เลือกรูปที่บ่งบอกความเป็นคุณ
        </h2>
        <p className="text-text_secondary mt-2">
          การใช้ภาพหน้าชัดจะช่วยให้ลูกค้าเลือกคุณได้มากกว่าหรือใช้โลโก้ที่สื่อถึงของคุณเท่านั้น
        </p>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 mb-6 md:mb-0">
          <div className="flex items-center justify-center flex-col">
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
            />

            {formData.avatar_url ? (
              <div className="relative">
                <div className="w-48 h-48 bg-gray-200 rounded-full overflow-hidden">
                  <Image
                    src={formData.avatar_url}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                    width={500}
                    height={500}
                  />
                </div>
                <button
                  onClick={triggerFileInput}
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
                onClick={triggerFileInput}
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
                    Upload Profile Image
                  </span>
                </div>
              </div>
            )}

            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

            {formData.avatar_url && (
              <button
                onClick={removeImage}
                className="mt-4 text-red-500 hover:text-red-700 text-sm"
              >
                Remove image
              </button>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-lg text-text_primary mb-4">
              Profile Preview
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 flex items-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden mr-4">
                {formData.avatar_url ? (
                  <Image
                    src={formData.avatar_url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    width={500}
                    height={500}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300"></div>
                )}
              </div>
              <div>
                <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 w-24 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-16">
        <button
          onClick={nextStep}
          disabled={!formData.avatar_url}
          className={`px-6 py-2 rounded-lg flex items-center ${
            !formData.avatar_url
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-third text-white"
          }`}
        >
          บันทึก และไปต่อ
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
