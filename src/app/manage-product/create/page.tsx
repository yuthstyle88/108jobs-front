"use client";
import { JobType } from "@/types/job";
import { useState } from "react";
import Step1ServiceInfo from "../components/Step1";
import Step2Packages from "../components/Step2";
import Step3Media from "../components/Step3";
import Step4WorkSteps from "../components/Step4";
import Step5Confirm from "../components/Step5";
import SuccessCreateJobModal from "../components/SuccessCreateJobModal";

const CreateService = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [job, setJob] = useState<JobType>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nextStep = () => {
    if (currentStep < 5) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const goToStep = (step: number) => {
    if (
      step === 1 ||
      step === currentStep ||
      completedSteps.includes(step - 1) ||
      step === completedSteps.length + 1
    ) {
      setCurrentStep(step);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmitSteps = () => {
    setIsModalOpen(true)
  };

  const handleClose = () => {
    setIsModalOpen(false);
    // window.location.href = "/seller/my-service";
  }

  const stepProps = {
    job: job as JobType,
    setJob,
    nextStep,
    prevStep,
    handleSubmitSteps,
  };

  const stepComponents = {
    1: Step1ServiceInfo,
    2: Step2Packages,
    3: Step3Media,
    4: Step4WorkSteps,
    5: Step5Confirm,
  } as const;

  const CurrentComponent =
    stepComponents[currentStep as keyof typeof stepComponents];

  return (
    <div className="min-h-screen pt-[4.5rem] bg-[#F8F9FB]">
      <div className="container mx-auto px-6 py-6">
        {/* Step indicator */}
        <div className="max-w-4xl mx-auto flex justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
          <div
            className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 z-0"
            style={{ width: `${(currentStep - 1) * 25}%` }}
          ></div>

          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className="z-10 flex flex-col items-center cursor-pointer"
              onClick={() => goToStep(step)}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step <= currentStep
                    ? "bg-blue-600 text-white"
                    : completedSteps.includes(step - 1) ||
                      step === completedSteps.length + 1
                    ? "bg-white border-2 border-gray-300 text-gray-600 hover:border-blue-400"
                    : "bg-white border-2 border-gray-300 text-gray-400 opacity-60"
                }`}
              >
                {step}
              </div>
              <span
                className={`text-xs mt-2 ${
                  step <= currentStep || completedSteps.includes(step)
                    ? "text-gray-700"
                    : "text-gray-500"
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
          {CurrentComponent && <CurrentComponent {...stepProps} />}
        </div>
      </div>
      <SuccessCreateJobModal
        isOpen={isModalOpen}
        onClose={handleClose}
        handleConfirmChange={() => {
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default CreateService;
