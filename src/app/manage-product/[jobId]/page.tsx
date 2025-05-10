"use client";
import { API_ROUTES_SELLER } from "@/api/endpoints";
import Loading from "@/components/Loading";
import { usePrivateFetchParams } from "@/hooks/api-hooks";
import { JobType, Onboarding } from "@/types/job";
import { Check } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Step1ServiceInfo from "../_components/Step1";
import Step2Packages from "../_components/Step2";
import Step3Media from "../_components/Step3";
import Step4WorkSteps from "../_components/Step4";
import Step5Confirm from "../_components/Step5";
import SuccessCreateJobModal from "../_components/SuccessCreateJobModal";
import NotFound from "@/app/not-found";

const getNextStep = (onboarding: Onboarding | undefined): number => {
  if (!onboarding) return 1;

  for (let i = 1; i <= 5; i++) {
    const key = `step${i}` as keyof Onboarding;
    if (!onboarding[key]) return i;
  }
  return 1;
};

const ServiceOnboardingPage = () => {
  const { jobId } = useParams();
  const {
    data: jobData,
    isLoading,
    mutate,
  } = usePrivateFetchParams<JobType>(
    API_ROUTES_SELLER.job.get_job + "/" + jobId
  );

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [job, setJob] = useState<JobType>();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (jobData) {
      setJob(jobData);
      const step = getNextStep(jobData.onboarding);
      setCurrentStep(step);
      const completed = [1, 2, 3, 4, 5].filter(
        (s) => jobData.onboarding?.[`step${s}` as keyof Onboarding]
      );
      setCompletedSteps(completed);
    }
  }, [jobData]);

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
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const stepProps = {
    job: job as JobType,
    setJob,
    nextStep,
    prevStep,
    handleSubmitSteps,
    mutate,
  };

  const stepComponents = useMemo(
    () => ({
      1: Step1ServiceInfo,
      2: Step2Packages,
      3: Step3Media,
      4: Step4WorkSteps,
      5: Step5Confirm,
    }),
    []
  );

  const CurrentComponent =
    stepComponents[currentStep as keyof typeof stepComponents];

  if (isLoading) return <Loading />;

  if (!job) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen pt-[4.5rem] bg-[#F8F9FB]">
      <div className="container mx-auto px-2 py-2 md:px-6 md:py-6">
        <div className="max-w-4xl mx-auto flex justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
          <div
            className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 z-0"
            style={{ width: `${(currentStep - 1) * 25}%` }}
          ></div>
          {[1, 2, 3, 4, 5].map((step) => {
            const onboardingStatus =
              job?.onboarding?.[`step${step}` as keyof Onboarding];
            const isCompleted = onboardingStatus === true;
            const isActive = step === currentStep;
            const isPending = onboardingStatus !== true;

            return (
              <div
                key={step}
                className="z-10 flex flex-col items-center cursor-pointer"
                onClick={() => goToStep(step)}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold
        ${isCompleted && !isActive ? "bg-green-500 text-white" : ""}
        ${isActive ? "bg-blue-600 text-white" : ""}
        ${
          isPending && !isActive
            ? "bg-white border-2 border-gray-300 text-gray-400"
            : ""
        }
      `}
                >
                  {isCompleted && !isActive ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step
                  )}
                </div>
                <span
                  className={`text-xs mt-2 font-medium
        ${isActive ? "text-blue-600" : ""}
        ${isCompleted && !isActive ? "text-green-600" : ""}
        ${isPending && !isActive ? "text-gray-500" : ""}
      `}
                >
                  {step === 1 && "Thông tin dịch vụ"}
                  {step === 2 && "Gói và giá cả"}
                  {step === 3 && "Tải lên ảnh dịch vụ"}
                  {step === 4 && "Bước làm việc"}
                  {step === 5 && "Nộp hồ sơ chờ phê duyệt"}
                </span>
              </div>
            );
          })}
        </div>

        <div className="max-w-4xl mx-auto px-6 py-6">
          {CurrentComponent && <CurrentComponent {...stepProps} />}
        </div>
      </div>
      <SuccessCreateJobModal
        isOpen={isModalOpen}
        onClose={handleClose}
        handleConfirmChange={() => {
          setIsModalOpen(false);
          window.location.href = "/seller/my-service";
        }}
      />
    </div>
  );
};

export default ServiceOnboardingPage;
