import { AssetIcon } from "@/constants/icons";
import { ApplyToBeFreelancerLanguage } from "@/types/language";
import Image from "next/image";
import React from "react";
import { Controller, useForm } from "react-hook-form";

interface StepSevenProps {
  formData: {
    birth_date: string;
  };
  updateFormData: (data: Partial<StepSevenProps["formData"]>) => void;
  nextStep: () => void;
  applyFreelancerLanguage:
    | Partial<ApplyToBeFreelancerLanguage>
    | undefined
    | null;
}

interface FormValues {
  birthDay: string;
  birthMonth: string;
  birthYear: string;
}

const StepSeven: React.FC<StepSevenProps> = ({
  formData,
  updateFormData,
  nextStep,
  applyFreelancerLanguage,
}) => {
  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      birthDay: formData.birth_date?.split("-")[2] || "",
      birthMonth: formData.birth_date?.split("-")[1] || "",
      birthYear: formData.birth_date?.split("-")[0] || "",
    },
  });

  const onSubmit = (data: FormValues) => {
    const { birthDay, birthMonth, birthYear } = data;
    const formattedDate = `${birthYear}-${birthMonth.padStart(
      2,
      "0"
    )}-${birthDay.padStart(2, "0")}`;

    updateFormData({ birth_date: formattedDate });
    nextStep();
  };

  const birthDay = watch("birthDay");
  const birthMonth = watch("birthMonth");
  const birthYear = watch("birthYear");

  const isFormValid = birthDay && birthMonth && birthYear;

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 80 }, (_, i) =>
    (currentYear - i).toString()
  );

  return (
    <form className="h-full py-8 md:p-0" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 h-full">
        <div className="flex flex-col justify-center px-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-text_primary">
              {applyFreelancerLanguage?.birth_date_question}
            </h2>
            <p className="text-text_secondary mt-2">
             {applyFreelancerLanguage?.birth_date_note}
            </p>
          </div>

          <div className="mb-8">
            <div className="text-sm font-medium text-text_primary mb-2">
              {applyFreelancerLanguage?.birth_date}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Controller
                name="birthDay"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary"
                  >
                    <option value="">{applyFreelancerLanguage?.day}</option>
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                )}
              />

              <Controller
                name="birthMonth"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary"
                  >
                    <option value="">{applyFreelancerLanguage?.month}</option>
                    {months.map((month, index) => (
                      <option
                        key={month}
                        value={(index + 1).toString().padStart(2, "0")}
                      >
                        {month}
                      </option>
                    ))}
                  </select>
                )}
              />

              <Controller
                name="birthYear"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary"
                  >
                    <option value="">{applyFreelancerLanguage?.year}</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full px-6 py-2 rounded-lg flex items-center justify-center ${
                !isFormValid
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

        <div className="w-full h-full step2-gradient relative z-0 overflow-hidden hidden md:block">
          <Image
            src={AssetIcon.logo_icon}
            alt="icon"
            className="w-full h-full"
            width={500}
            height={500}
          />
        </div>
      </div>
    </form>
  );
};

export default StepSeven;
