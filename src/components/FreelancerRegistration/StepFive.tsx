import Image from "next/image";
import React, { useRef, useState } from "react";

interface StepFiveProps {
  formData: {
    nationalIdFront: string | null;
    nationalIdBack: string | null;
  };
  updateFormData: (data: {
    nationalIdFront?: string | null;
    nationalIdBack?: string | null;
  }) => void;
  nextStep: () => void;
}

const StepFive: React.FC<StepFiveProps> = ({
  formData,
  updateFormData,
  nextStep,
}) => {
  const frontIdInputRef = useRef<HTMLInputElement>(null);
  const backIdInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload =
    (type: "front" | "back") => (e: React.ChangeEvent<HTMLInputElement>) => {
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
        if (type === "front") {
          updateFormData({ nationalIdFront: reader.result as string });
        } else {
          updateFormData({ nationalIdBack: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    };

  const triggerFileInput = (type: "front" | "back") => {
    if (type === "front") {
      frontIdInputRef.current?.click();
    } else {
      backIdInputRef.current?.click();
    }
  };

  const removeImage = (type: "front" | "back") => {
    if (type === "front") {
      updateFormData({ nationalIdFront: null });
    } else {
      updateFormData({ nationalIdBack: null });
    }
  };

  const isFormValid = () => {
    return formData.nationalIdFront !== null;
  };

  return (
    <div className="flex flex-col w-full h-full ">
      <div className="py-6 md:py-12 flex flex-1 flex-col mx-auto gap-4 w-full max-w-screen-lg h-full">
        <div className="flex flex-col gap-2 justify-between h-full w-full px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-text_primary">
              ยืนยันตัวตนว่าคุณคือใคร
            </h2>
            <p className="text-text_secondary mt-2">
              อัพโหลดบัตรประชาชนเพื่อความปลอดภัยในการทำธุรกรรม
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-gray-200 rounded-lg p-4 shadow-categoryMenu">
              <h3 className="font-medium text-lg text-text_primary">
                รูปบัตรประชาชน
              </h3>
              <p className="text-[12px] font-sans text-text_secondary mb-6">
                ถ่ายรูปให้เห็นด้านหน้าของบัตร
              </p>

              <input
                type="file"
                className="hidden"
                ref={frontIdInputRef}
                onChange={handleImageUpload("front")}
                accept="image/*"
              />

              {formData.nationalIdFront ? (
                <div className="relative mb-4">
                  <Image
                    src={formData.nationalIdFront}
                    alt="National ID Front"
                    className="w-full h-60 py-4 px-2 md:px-0 object-contain border border-gray-200 rounded-lg bg-gray-50"
                    width={500}
                    height={500}
                  />
                  <button
                    onClick={() => removeImage("front")}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
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
                  onClick={() => triggerFileInput("front")}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-14 mb-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <svg
                    className="w-12 h-12 mx-auto text-gray-400 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-gray-500">Click to upload front side</p>
                </div>
              )}

              <button
                onClick={() => triggerFileInput("front")}
                className="w-full py-2 bg-third text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                เปลี่ยนรูป
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 shadow-categoryMenu">
              <h3 className="font-medium text-lg text-text_primary">
                รูปบัตรประชาชน
              </h3>
              <p className="text-[12px] font-sans text-text_secondary mb-6">
                ถ่ายให้เห็นด้านหลังบัตร
              </p>

              <input
                type="file"
                className="hidden"
                ref={backIdInputRef}
                onChange={handleImageUpload("back")}
                accept="image/*"
              />

              {formData.nationalIdBack ? (
                <div className="relative mb-4">
                  <Image
                    src={formData.nationalIdBack}
                    alt="National ID Back"
                    className="w-full h-60 py-4 px-2 md:px-0 object-contain border border-gray-200 rounded-lg bg-gray-50"
                    width={500}
                    height={500}
                  />
                  <button
                    onClick={() => removeImage("back")}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
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
                  onClick={() => triggerFileInput("back")}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-14 mb-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <svg
                    className="w-12 h-12 mx-auto text-gray-400 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-gray-500">Click to upload back side</p>
                </div>
              )}

              <button
                onClick={() => triggerFileInput("back")}
                className="w-full py-2 bg-third text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                เปลี่ยนรูป
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-500 rounded-lg">
              {error}
            </div>
          )}

          <div className="w-full mt-8">
            <button
              onClick={nextStep}
              disabled={!isFormValid()}
              className={`w-full px-6 py-2 rounded-lg flex justify-center items-center ${
                !isFormValid()
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
      </div>
    </div>
  );
};

export default StepFive;
