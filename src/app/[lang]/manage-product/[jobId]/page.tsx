"use client";
import {API_ROUTES_SELLER} from "@/api/endpoints";
import NotFound from "@/app/[lang]/not-found";
import Loading from "@/components/Loading";
import WarningLeaveModal from "@/components/WarningLeaveModal";
import {LanguageFile} from "@/constants/language";
import {usePrivateFetchParams} from "@/hooks/api-hooks";
import {JobType, Onboarding} from "@/types/job";
import {getNamespace} from "@/utils/i18nHelper";
import {Check} from "lucide-react";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";


const getNextStep = (onboarding: Onboarding | undefined): number => {
  if (!onboarding) return 1;

  for (let i = 1; i <= 5; i++) {
    const key = `step${i}` as keyof Onboarding;
    if (!onboarding[key]) return i;
  }
  return 1;
};

const ServiceOnboardingPage = () => {
  const {jobId} = useParams();
  const {
    data: jobData,
    isLoading,
    mutate,
  } = usePrivateFetchParams<JobType>(
    API_ROUTES_SELLER.job.getJob + "/" + jobId
  );

  const createJobLanguage = getNamespace(LanguageFile.SELLER_CREATE_JOBS);

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [job, setJob] = useState<JobType>();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [pendingStep, setPendingStep] = useState<number | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);

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
    },
    [jobData]);

  const nextStep = () => {
    if (currentStep < 5) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(currentStep + 1);
      setIsFormDirty(false);
      window.scrollTo(0,
        0);
    }
  };

  const prevStep = () => {
    if (isFormDirty) {
      setPendingStep(currentStep - 1);
      setShowWarningModal(true);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setIsFormDirty(false);
      window.scrollTo(0,
        0);
    }
  };

  const goToStep = (step: number) => {
    if (step === currentStep) return;

    if (isFormDirty) {
      setPendingStep(step);
      setShowWarningModal(true);
    } else if (
      step === 1 ||
      completedSteps.includes(step - 1) ||
      step === completedSteps.length + 1
    ) {
      setCurrentStep(step);
      setIsFormDirty(false);
      window.scrollTo(0,
        0);
    }
  };

  const handleSubmitSteps = () => {
    setShowSuccessModal(true);
  };

  const handleCloseWarning = () => {
    setShowWarningModal(false);
    setPendingStep(null);
  };

  const handleConfirmLeave = () => {
    if (pendingStep !== null) {
      setCurrentStep(pendingStep);
      setPendingStep(null);
      setIsFormDirty(false);
      setShowWarningModal(false);
      window.scrollTo(0,
        0);
    }
  };

  const stepProps = {
    job: job as JobType,
    setJob,
    nextStep,
    prevStep,
    handleSubmitSteps,
    mutate,
    setIsFormDirty,
  };


  useEffect(() => {
      setIsFormDirty(false);
    },
    [currentStep]);


  if (isLoading) return <Loading/>;

  if (!job) {
    return <NotFound/>;
  }

  return (
    <div className="min-h-screen pt-[4.5rem] bg-[#F8F9FB]">
      <div className="container mx-auto px-2 py-2 md:px-6 md:py-6">
        <div className="max-w-4xl mx-auto flex justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
          <div
            className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0"
            style={{width: `${(currentStep - 1) * 25}%`}}
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
        ${isActive ? "bg-primary text-white" : ""}
        ${
                    isPending && !isActive
                      ? "bg-white border-2 border-gray-300 text-gray-400"
                      : ""
                  }
      `}
                >
                  {isCompleted && !isActive ? (
                    <Check className="w-5 h-5"/>
                  ) : (
                    step
                  )}
                </div>
                <span
                  className={`text-xs mt-2 font-medium
        ${isActive ? "text-primary" : ""}
        ${isCompleted && !isActive ? "text-green-600" : ""}
        ${isPending && !isActive ? "text-gray-500" : ""}
      `}
                >
                  {step === 1 && createJobLanguage.step1}
                  {step === 2 && createJobLanguage.step2}
                  {step === 3 && createJobLanguage.step3}
                  {step === 4 && createJobLanguage.step4}
                  {step === 5 && createJobLanguage.step5}
                </span>
              </div>
            );
          })}
        </div>

      </div>


      <WarningLeaveModal
        isOpen={showWarningModal}
        onClose={handleCloseWarning}
        handleConfirmChange={handleConfirmLeave}
      />
    </div>
  );
};

export default ServiceOnboardingPage;
