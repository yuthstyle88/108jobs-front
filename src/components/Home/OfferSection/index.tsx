import { CompareImage } from "@/constants/images";
import { HomeLanguage } from "@/types/language";
import { faArrowRight, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React from "react";

type Props = {
  homeLanguageData?: Partial<HomeLanguage> | null;
};

const OfferSection = (props: Props) => {
  const { homeLanguageData } = props;
  return (
    <section
      className="bg-gradient-to-t py-12 grid grid-container-desktop-banner gap-y-4 sm:gap-y-12 gap-x-4"
      style={{
        background: "linear-gradient(to top, hsl(216 85% 94%), #fff)",
      }}
    >
      <div className="col-start-2 col-end-3">
        <h2 className="home-title-head text-[18px] sm:text-[2.25rem] text-center">
          {homeLanguageData?.tittleQualityOfferSection}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[1.5rem] gap-y-[1.5rem] lg:gap-y-0 min-h-0 min-w-0 col-start-2 col-end-3">
        <div className="flex flex-col shadow-member-ship-shadow rounded-lg bg-white">
          <div className="p-6 flex-1 text-center bg-white rounded-lg gap-6">
            <div className="h-[32px]"></div>
            <div className="flex justify-center mt-8 items-center">
              <Image src={CompareImage.compare1} alt="Freelancer" />
            </div>
            <div className="text-text-primary mt-6">
              <h3 className="font-semibold text-[1.25rem] mb-2">Freelancer</h3>
              <ul className="text-sm text-left text-text_secondary grid grid-cols-[1fr] gap-1">
                <li className="flex flex-row gap-3 items-center">
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="w-[12px] h-[14px] text-third"
                  />
                  <p className="text-[0.875rem] leading-[1.65]">
                    {homeLanguageData?.contentQualityOfferFreelancerCard1}{" "}
                  </p>
                </li>
                <li className="flex flex-row gap-3 items-center">
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="w-[12px] h-[14px] text-third"
                  />
                  <p className="text-[0.875rem] leading-[1.65]">
                    {homeLanguageData?.contentQualityOfferFreelancerCard2}{" "}
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <hr className="w-full h-[1px] m-0 bg-borderSecondary" />
            <div className="h-[60px] px-6 flex justify-end items-center ">
              <div className="opacity-70 text-[0.875rem] cursor-pointer text-text_secondary">
                {homeLanguageData?.labelSeeMoreTittle}
                <FontAwesomeIcon icon={faArrowRight} className="pl-1" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col shadow-member-ship-shadow rounded-lg bg-white">
          <div className="p-6 flex-1 text-center bg-white rounded-lg gap-6">
            <div className="w-full flex justify-end">
              <button className="w-fit pointer-events-none bg-blue-200 text-blue-500 font-semibold py-1 px-4 rounded-full shadow-md hover:bg-blue-400 ">
                {homeLanguageData?.tittleQualityOfferSpecialistCard}
              </button>
            </div>
            <div className="flex justify-center mt-8 items-center">
              <Image src={CompareImage.compare2} alt="Specialist" />
            </div>
            <div className="text-text-primary mt-6">
              <h3 className="font-semibold text-[1.25rem] mb-2">
                {homeLanguageData?.tittleQualityOfferSpecialistCard}
              </h3>
              <ul className="text-sm text-left text-text_secondary grid grid-cols-[1fr] gap-1">
                <li className="flex flex-row gap-3 items-center">
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="w-[12px] h-[14px] text-third"
                  />
                  <p className="text-[0.875rem] leading-[1.65]">
                    {homeLanguageData?.contentQualityOfferSpecialistCard1}
                  </p>
                </li>
                <li className="flex flex-row gap-3 items-center">
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="w-[12px] h-[14px] text-third"
                  />
                  <p className="text-[0.875rem] leading-[1.65]">
                    {homeLanguageData?.contentQualityOfferSpecialistCard2}
                  </p>
                </li>
                <li className="flex flex-row gap-3 items-center">
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="w-[12px] h-[14px] text-third"
                  />
                  <p className="text-[0.875rem] leading-[1.65]">
                    {homeLanguageData?.contentQualityOfferSpecialistCard3}
                  </p>
                </li>
                <li className="flex flex-row gap-3 items-center">
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="w-[12px] h-[14px] text-third"
                  />
                  <p className="text-[0.875rem] leading-[1.65]">
                    {homeLanguageData?.contentQualityOfferSpecialistCard4}
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <hr className="w-full h-[1px] m-0 bg-borderSecondary" />
            <div className="h-[60px] px-6 flex justify-end items-center ">
              <div className="opacity-70 text-[0.875rem] cursor-pointer text-text_secondary">
                {homeLanguageData?.labelSeeMoreTittle}
                <FontAwesomeIcon icon={faArrowRight} className="pl-1" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col shadow-member-ship-shadow rounded-lg bg-white">
          <div className="p-6 flex-1 text-center bg-white rounded-lg gap-6">
            <div className="w-full flex justify-end">
              <button className="w-fit pointer-events-none bg-blue-500 text-white font-semibold py-1 px-4 rounded-full shadow-md hover:bg-blue-400">
                {homeLanguageData?.tittleQualityOfferProfessionalCard}
              </button>
            </div>
            <div className="flex justify-center mt-8 items-center">
              <Image src={CompareImage.compare3} alt="Professional" />
            </div>
            <div className="text-text-primary mt-6">
              <h3 className="font-semibold text-[1.25rem] mb-2">
                {homeLanguageData?.tittleQualityOfferProfessionalCard}
              </h3>
              <ul className="text-sm text-left text-text_secondary grid grid-cols-[1fr] gap-1">
                <li className="flex flex-row gap-3 items-center">
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="w-[12px] h-[14px] text-third"
                  />
                  <p className="text-[0.875rem] leading-[1.65]">
                    {homeLanguageData?.contentQualityOfferProfessionalCard1}
                  </p>
                </li>
                <li className="flex flex-row gap-3 items-center">
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="w-[12px] h-[14px] text-third"
                  />
                  <p className="text-[0.875rem] leading-[1.65]">
                    {homeLanguageData?.contentQualityOfferProfessionalCard2}
                  </p>
                </li>
                <li className="flex flex-row gap-3 items-center">
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="w-[12px] h-[14px] text-third"
                  />
                  <p className="text-[0.875rem] leading-[1.65]">
                    {homeLanguageData?.contentQualityOfferProfessionalCard3}
                  </p>
                </li>
                <li className="flex flex-row gap-3 items-center">
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="w-[12px] h-[14px] text-third"
                  />
                  <p className="text-[0.875rem] leading-[1.65]">
                    {homeLanguageData?.contentQualityOfferProfessionalCard4}
                  </p>
                </li>
                <li className="flex flex-row gap-3 items-center">
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="w-[12px] h-[14px] text-third"
                  />
                  <p className="text-[0.875rem] leading-[1.65]">
                    {homeLanguageData?.contentQualityOfferProfessionalCard5}
                  </p>
                </li>
                <li className="flex flex-row gap-3 items-center">
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="w-[12px] h-[14px] text-third"
                  />
                  <p className="text-[0.875rem] leading-[1.65]">
                    {homeLanguageData?.contentQualityOfferProfessionalCard6}
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <hr className="w-full h-[1px] m-0 bg-borderSecondary" />
            <div className="h-[60px] px-6 flex justify-end items-center ">
              <div className="opacity-70 text-[0.875rem] cursor-pointer text-text_secondary">
                {homeLanguageData?.labelSeeMoreTittle}
                <FontAwesomeIcon icon={faArrowRight} className="pl-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-start-2 col-end-3"></div>
    </section>
  );
};

export default OfferSection;
