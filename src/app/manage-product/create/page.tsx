"use client";
import { useRouter } from "next/navigation";
import Step1ServiceInfo from "../_components/Step1";
import { JobType } from "@/types/job";

const CreateService = () => {
  const router = useRouter();

  const handleCreatedStep1 = (job: JobType) => {
    router.push(`/manage-product/${job.id}`);
  };

  return (
    <div className="min-h-screen pt-[4.5rem] bg-[#F8F9FB]">
      <div className="container mx-auto px-6 py-6">
        {/* Step indicator (step 1 active) */}
        <div className="max-w-4xl mx-auto flex justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
          <div
            className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 z-0"
            style={{ width: `0%` }}
          ></div>

          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className="z-10 flex flex-col items-center"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 1
                    ? "bg-blue-600 text-white"
                    : "bg-white border-2 border-gray-300 text-gray-400 opacity-60"
                }`}
              >
                {step}
              </div>
              <span
                className={`text-xs mt-2 ${
                  step === 1 ? "text-gray-700" : "text-gray-500"
                }`}
              >
                {step === 1 && "Thông tin"}
                {step === 2 && "Gói dịch vụ"}
                {step === 3 && "Ảnh/video"}
                {step === 4 && "Các bước"}
                {step === 5 && "Xác nhận"}
              </span>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <Step1ServiceInfo onCreated={handleCreatedStep1} />
        </div>
      </div>
    </div>
  );
};

export default CreateService;
