import Image from "next/image";
import React from "react";

interface StepThreeProps {
  formData: {
    username: string;
    bio: string;
    displayName: string;
    profileImage: string | null;
  };
  updateFormData: (data: { username: string; displayName: string }) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const StepThree: React.FC<StepThreeProps> = ({
  formData,
  updateFormData,
  nextStep,
  prevStep,
}) => {
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ ...formData, username: e.target.value });
  };

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ ...formData, displayName: e.target.value });
  };

  const isFormValid = () => {
    return (
      formData.username.trim() !== "" && formData.displayName.trim() !== ""
    );
  };

  return (
    <div className="pl-6 h-full">
      <div className="flex flex-col md:flex-row h-full">
        <div className="flex flex-col justify-center mx-10 md:w-1/2 md:pr-4 mb-6 md:mb-0">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-text_primary">
              สร้างโปรไฟล์ฟรีแลนซ์ของคุณ
            </h2>
            <p className="text-text_secondary mt-2">
              กำหนดข้อมูลเบื้องต้นที่ช่วงสร้างความน่าเชื่อถือ
            </p>
          </div>
          <div className="mb-4 w-full">
            <label className="block text-sm text-text_primary font-semibold mb-2">
              Username
            </label>
            <p className="text-xs text-text_secondary mb-2">
              ชื่อนี้จะวางหน้าเว็บไซต์ของคุณและหน้าโปรไฟล์
            </p>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                Fastwork.co/user/
              </span>
              <input
                type="text"
                value={formData.username}
                onChange={handleUsernameChange}
                className="w-full pl-36 text-text_primary pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third"
                placeholder="username"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-text_primary font-semibold mb-2">
              ชื่อที่ใช้แสดงในระบบ
            </label>
            <p className="text-xs text-text_secondary mb-2">
              ควรตั้งชื่อที่เป็นภาษาไทยเพื่อสร้างความน่าเชื่อถือ
            </p>
            <input
              type="text"
              value={formData.displayName}
              onChange={handleDisplayNameChange}
              className="w-full px-3 py-2 text-text_primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third"
              placeholder="ชื่อที่แสดงในระบบ"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-text_primary font-semibold mb-2">
              ประเภทฟรีแลนซ์ (เปลี่ยนได้ทีหลัง)
            </label>
            <p className="text-xs text-text_secondary mb-2">
              ให้เลือกประเภทฟรีแลนซ์ที่ตรงกับคุณ อาจ Part-time ได้เลย
            </p>
            <div className="flex gap-4">
              <label className="flex items-center border border-third rounded-md px-4 py-2 cursor-pointer">
                <input
                  type="radio"
                  name="workType"
                  value="Part-time"
                  defaultChecked={true}
                  className="mr-2 text-third"
                />
                <span className="text-text_primary">Part-time</span>
              </label>
              <label className="flex items-center border border-gray-300 rounded-md px-4 py-2 cursor-pointer">
                <input
                  type="radio"
                  name="workType"
                  value="Full-time"
                  disabled
                  className="mr-2"
                />
                <span className="text-gray-400">Full-time</span>
              </label>
            </div>
            <div className="w-full mt-8">
              <button
                onClick={nextStep}
                disabled={!isFormValid()}
                className={`submit-button py-3 flex justify-center items-center ${
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

        <div className="w-full md:w-1/2 md:pl-4 step2-gradient relative z-0 overflow-hidden">
          <div className="border border-gray-200 rounded-lg overflow-hidden absolute top-[100px] left-[200px] -z-0 w-full h-full bg-white">
            <div className="bg-gray-100 p-2 flex items-center space-x-2">
              <div className="bg-red-500 w-3 h-3 rounded-full"></div>
              <div className="bg-yellow-500 w-3 h-3 rounded-full"></div>
              <div className="bg-green-500 w-3 h-3 rounded-full"></div>
              <div className="flex-1 pl-4 text-xs text-gray-500">
                <span>Fastwork.co/user/{formData.username || "username"}</span>
              </div>
            </div>
          </div>
          <div className="p-6 bg-white absolute left-[50px] top-[180px] border border-gray-200 rounded-lg">
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
                  {formData.displayName || "Display name"}
                </h3>
                <p className="text-gray-500 text-sm">
                  {formData.bio || "Bio"}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepThree;
