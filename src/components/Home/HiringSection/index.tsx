import { GroupIcon } from "@/constants/icons";
import { AssetsImage, LandingImage } from "@/constants/images";
import { HomeLanguage } from "@/types/language";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { memo } from "react";
import LazyImage from "@/components/ui/LazyImage";
import Image from "next/image";

type Props = {
  homeLanguageData?: Partial<HomeLanguage> | null;
};

const HiringSectionComponent = (props: Props) => {
  const {homeLanguageData} = props;

  const freelancerIntro = [
    {
      icon: AssetsImage.group,
      title: homeLanguageData?.tittleFirstSlogan,
      description: homeLanguageData?.contentFreelancerVerification,
    },
    {
      icon: AssetsImage.shield,
      title: homeLanguageData?.tittleSecondSlogan,
      description: homeLanguageData?.contentPaymentProtection,
    },
    {
      icon: AssetsImage.paper,
      title: homeLanguageData?.tittleThirdSlogan,
      description: homeLanguageData?.contentQualityFreelancers,
    },
  ];

  return (
    <>
      <section className="py-6 sm:py-24 grid grid-container-desktop-banner gap-y-4 sm:gap-y-12 ">
        <div className="col-start-2 col-end-3">
          <h4 className="text-[16px] sm:text-[1.5rem] text-[#38404c] font-medium leading-[1.15]">
            {homeLanguageData?.tittlePrimaryWhySection}
          </h4>
          <h2 className="home-title-head text-[18px] sm:text-[2.25rem]">
            {homeLanguageData?.tittleSecondaryWhySection}
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-[1.5rem] gap-y-[1rem] lg:gap-y-0 min-h-0 min-w-0 col-start-2 col-end-3">
          {freelancerIntro.map((freelancer, index) => (
            <div key={index} className="flex flex-col items-center sm:block">
              <Image
                src={freelancer.icon}
                alt={`${freelancer.title} icon`}
                width={62}
                height={62}
                className="max-w-full h-auto align-top self-center"
              />
              <div className="grid grid-cols-[1fr] mt-4 gap-y-1 text-text-primary font-medium">
                <h5 className="text-base sm:text-[1.25rem] leading-[1.15]">
                  {freelancer.title}
                </h5>
                <p className="m-0 text-base font-sans leading-[1.65] ">
                  {freelancer.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-6">
        <div className="grid grid-container-desktop-banner gap-y-4 sm:gap-y-12">
          <div className="col-start-2 col-end-3">
            <h2 className="home-title-head text-[18px] sm:text-[2.25rem]">
              {homeLanguageData?.titleStartHiringSection}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[1.5rem] min-h-0 min-w-0 col-start-2 col-end-3">
            {/* Cột 1 */}
            <div className="grid grid-rows-2 gap-y-6 text-text-primary font-medium">
              <div className="flex gap-x-5">
                <div className="flex-shrink-0">
                  <Image
                    src={GroupIcon.group11651.src}
                    width={30}
                    height={30}
                    alt="Post a job icon"

                  />
                </div>
                <div>
                  <h1 className="text-[1.25rem] leading-[1.15]">
                    {homeLanguageData?.labelStartHiringSection1}
                  </h1>
                  <p className="m-0 text-base font-sans leading-[1.65]">
                    {homeLanguageData?.contentStartHiringSection1}
                  </p>
                </div>
              </div>
              <div className="flex gap-x-5">
                <div className="flex-shrink-0">
                  <LazyImage
                    imagePath="group-11653.svg"
                    width={30}
                    height={30}
                    alt="Hire freelancers icon"
                    preload={true}
                    trackPerformance={true}
                    blurUp={true}
                  />
                </div>
                <div>
                  <h1 className="text-[1.25rem] leading-[1.15]">
                    {homeLanguageData?.labelStartHiringSection3}
                  </h1>
                  <p className="m-0 text-base font-sans leading-[1.65]">
                    {homeLanguageData?.contentStartHiringSection3}
                  </p>
                </div>
              </div>
            </div>

            {/* Cột 2 */}
            <div className="grid grid-rows-2 gap-y-6 text-text-primary font-medium">
              <div className="flex gap-x-5">
                <div className="flex-shrink-0">
                  <LazyImage
                    imagePath="group-11652.svg"
                    width={30}
                    height={30}
                    alt="Review proposals icon"
                    preload={true}
                    trackPerformance={true}
                    blurUp={true}
                  />
                </div>
                <div>
                  <h1 className="text-[1.25rem] leading-[1.15]">
                    {homeLanguageData?.labelStartHiringSection2}
                  </h1>
                  <p className="m-0 text-base font-sans leading-[1.65]">
                    {homeLanguageData?.contentStartHiringSection2}
                  </p>
                </div>
              </div>
              <div className="flex gap-x-5">
                <div className="flex-shrink-0">
                  <LazyImage
                    imagePath="group-11654.svg"
                    width={30}
                    height={30}
                    alt="Pay securely icon"
                    preload={true}
                    trackPerformance={true}
                    blurUp={true}
                  />
                </div>
                <div>
                  <h1 className="text-[1.25rem] leading-[1.15]">
                    {homeLanguageData?.labelStartHiringSection4}
                  </h1>
                  <p className="m-0 text-base font-sans leading-[1.65]">
                    {homeLanguageData?.contentStartHiringSection4}
                  </p>
                </div>
              </div>
            </div>

            {/* Cột 3 */}
            <div className="rounded-lg relative cursor-pointer h-[219px] mt-8 md:mt-0">
              <LazyImage
                imagePath="landing/video_cover-1.jpg"
                alt="Video tutorial background"
                className="rounded-lg object-cover w-full h-full"
                width={500}
                height={500}
                preload={false}
                trackPerformance={true}
                blurUp={true}
              />
              <div className="bg-black/25 absolute top-0 left-0 w-full h-full rounded-lg">
                <div
                  className="w-[75px] h-[75px] rounded-full bg-black absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex justify-center items-center">
                  <FontAwesomeIcon
                    icon={faPlay}
                    className="w-[38px] h-[38px] text-white pl-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

// Memoize the component to prevent unnecessary re-renders
const HiringSection = memo(HiringSectionComponent);

export default HiringSection;
