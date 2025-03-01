import Image from "next/image";
import React from "react";

interface StepFourProps {
  formData: {
    bio: string;
    username: string;
    displayName: string;
    profileImage: string | null;
  };
  updateFormData: (data: { bio: string }) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const StepFour: React.FC<StepFourProps> = ({
  formData,
  updateFormData,
  nextStep,
  prevStep,
}) => {
  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData({ bio: e.target.value });
  };

  const isFormValid = () => {
    return formData.bio.trim().length > 0;
  };

  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text_primary">
          อธิบายตัวตนของคุณให้ลูกค้ารู้จักมากขึ้น
        </h2>
        <p className="text-text_secondary mt-2">
          เล่าประวัติทางด้านอาชีพ เช่น ประสบการณ์การทำงาน ประวัติการศึกษา
          ใบรับรองที่เกี่ยวโยงฯ
        </p>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 md:pr-4 mb-6 md:mb-0">
          <div className="mb-4">
            <label className="block text-sm text-text_primary font-semibold mb-2">
              เกี่ยวกับฟรีแลนซ์
            </label>
            <textarea
              value={formData.bio}
              onChange={handleBioChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third h-64 resize-none text-text_primary"
              placeholder="เล่าเกี่ยวกับประสบการณ์ ทักษะ และความสามารถของคุณ..."
            ></textarea>
            <p className="text-xs text-text_secondary mt-2">
              ให้ข้อมูลประสบการณ์ทำงาน ทักษะที่โดดเด่น
              และสิ่งที่คุณสามารถทำได้ดี
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 md:pl-4">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-100 p-2 flex items-center space-x-2">
              <div className="bg-red-500 w-3 h-3 rounded-full"></div>
              <div className="bg-yellow-500 w-3 h-3 rounded-full"></div>
              <div className="bg-green-500 w-3 h-3 rounded-full"></div>
              <div className="flex-1 text-center text-xs text-gray-500">
                <span>Fastwork.co/user/{formData.username || "username"}</span>
              </div>
            </div>
            <div className="p-6 bg-white">
              <div className="flex">
                <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden mr-4">
                  {formData.profileImage ? (
                    <Image
                      src={formData.profileImage}
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
                  <h3 className="font-medium text-lg text-text_primary">
                    {formData.username || "username"}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {formData.displayName || "Display Name"}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <div className="flex space-x-6">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-third"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <div className="ml-1 w-10 h-2 bg-third rounded-full"></div>
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-third"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    <div className="ml-1 w-10 h-2 bg-third rounded-full"></div>
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-third"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <div className="ml-1 w-10 h-2 bg-third rounded-full"></div>
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-third"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <div className="ml-1 w-10 h-2 bg-third rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex">
                  <svg
                    className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-700">
                      {formData.bio || "ยังไม่มีข้อมูล"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          className="px-6 py-2 border border-gray-300 rounded-lg text-text_primary"
        >
          ย้อนกลับ
        </button>
        <button
          onClick={nextStep}
          disabled={!isFormValid()}
          className={`px-6 py-2 rounded-lg flex items-center ${
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
  );
};

export default StepFour;
