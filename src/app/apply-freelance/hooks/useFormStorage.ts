import { useEffect } from "react";

type UseFormStorageProps<T> = {
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  storageKey?: string;
};

export const useFormStorage = <T>({
  setFormData,
  currentStep,
  setCurrentStep,
  storageKey = "freelancer",
}: UseFormStorageProps<T>) => {
  const formKey = `${storageKey}FormData`;
  const stepKey = `${storageKey}CurrentStep`;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const savedFormData = localStorage.getItem(formKey);
    const savedStep = localStorage.getItem(stepKey);

    if (savedFormData) {
      try {
        const parsed = JSON.parse(savedFormData);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Error parsing form data from localStorage:", e);
      }
    }

    if (savedStep) {
      const parsedStep = parseInt(savedStep, 10);
      if (!isNaN(parsedStep) && parsedStep >= 1 && parsedStep <= 9) {
        setCurrentStep(parsedStep);
      }
    }
  }, []);

  const saveFormToStorage = (updatedForm: T) => {
    localStorage.setItem(formKey, JSON.stringify(updatedForm));
    localStorage.setItem(stepKey, currentStep.toString());
  };

  const clearFormStorage = () => {
    localStorage.removeItem(formKey);
    localStorage.removeItem(stepKey);
  };

  return {
    saveFormToStorage,
    clearFormStorage,
  };
};
