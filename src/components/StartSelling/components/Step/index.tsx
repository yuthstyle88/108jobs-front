import { StartSellingImage } from "@/constants/images";
import Image, { StaticImageData } from "next/image";
import React from "react";

type Step = {
  number: number;
  title?: string;
  description?: React.ReactNode;
  image: StaticImageData;
};

type Props = {
  data: Record<string, string>;
};

const Step = ({ data }: Props) => {
  const steps: Step[] = [
    {
      number: 1,
      title: data?.step1,
      description: <>{data?.step1Description}</>,
      image: StartSellingImage.step1,
    },
    {
      number: 2,
      title: data?.step2,
      description: data?.step2Description,
      image: StartSellingImage.step2,
    },
    {
      number: 3,
      title: data?.step3,
      description: data?.step3Description,
      image: StartSellingImage.step3,
    },
    {
      number: 4,
      title: data?.step4,
      description: data?.step4Description,
      image: StartSellingImage.step4,
    },
    {
      number: 5,
      title: data?.step5,
      description: data?.step5Description,
      image: StartSellingImage.step5,
    },
    {
      number: 6,
      title: data?.step6,
      description: data?.step6Description,
      image: StartSellingImage.step6,
    },
  ];
  return (
    <div className="grid-container-desktop-banner w-full py-10 px-4 sm:px-6 lg:px-8">
      <div className="col-start-2 col-end-3">
        <div className="flex flex-col justify-center items-center py-16 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">
            {data?.stepsTitle}
          </h2>

          <div className="space-y-4 max-w-[800px] ">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-center gap-2"
              >
                <div className="">
                  <Image
                    src={step.image}
                    alt={`Step ${step.number}`}
                    className="max-w-[180px]"
                  />
                </div>
                <div className="w-full">
                  <h3 className="text-xl font-semibold text-primary">
                    {step.number}. {step.title}
                  </h3>
                  <p className="mt-2 text-text-primary font-sans">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step;
