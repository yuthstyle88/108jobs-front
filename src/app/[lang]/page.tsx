"use client";
import apple from "@/assets/icons/apple.svg";
import google from "@/assets/icons/google-play.svg";
import fastwork from "@/assets/images/fastwork-app-qr.webp";
import imgapp from "@/assets/images/img-app.webp";
import Header from "@/components/Header";
import TypingText from "@/components/TypingText";
import { CategoriesIcon, GroupIcon } from "@/constants/icons";
import {
  faArrowRight,
  faCheck,
  faPlay,
  faQuoteLeft,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Footer from "@/components/Footer";

import { Swiper, SwiperSlide, useSwiper } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../styles.css";

import { Navigation } from "swiper/modules";

import { API_ROUTES } from "@/api/endpoints";
import CategoryCardMock from "@/components/CategoryCardMock";
import Loading from "@/components/Loading";
import LocationSelectionModal from "@/components/LocationSelectionModal";
import {
  AssetsImage,
  CompareImage,
  CustomerImage,
  LandingImage,
  ProfileImage,
} from "@/constants/images";
import { LanguageFile } from "@/constants/language";
import SpAdsSlider from "@/containers/SpAdsSlider";
import SpCatalog from "@/containers/SpCatalog";
import SpHeader from "@/containers/SpHeader";
import { usePublicFetch } from "@/hooks/api-hooks";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { ServiceCatalogData } from "@/types/catalog";
import { catalogIcons } from "@/types/catalogIcon";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

const interestImages = [
  LandingImage.interest_1,
  LandingImage.interest_2,
  LandingImage.interest_3,
  LandingImage.interest_4,
  LandingImage.interest_5,
  LandingImage.interest_6,
];

const CustomNavigation = () => {
  const swiper = useSwiper();
  return (
    <div>
      <button
        className="absolute top-1/2 -translate-y-1/2 left-0 bg-transparent pl-2 border-[none] text-[24px] rounded-tr-[10px] rounded-br-[10px] cursor-pointer z-50"
        onClick={() => swiper.slidePrev()}
      >
        ❮
      </button>
      <button
        className="absolute top-1/2 -translate-y-1/2 right-0 bg-transparent pr-2 border-[none] text-[24px] rounded-tl-[10px] rounded-bl-[10px] cursor-pointer z-50"
        onClick={() => swiper.slideNext()}
      >
        ❯
      </button>
    </div>
  );
};

export default function Home() {
  const { data: session } = useSession();
  const [activeCatalogIndex, setActiveCatalogIndex] = useState<number>(0);
  const [expanded, setExpanded] = useState(false);

  const [isOpenLocationSelection, setIsOpenLocationSelection] = useState(false);

  const {
    data: globalLanguageData,
    isLoading,
    error,
  } = useGlobalTranslate(LanguageFile.GLOBAL);

  const {
    data: homeLanguageData,
    isLoading: homeLoading,
    error: homeError,
  } = useGlobalTranslate(LanguageFile.HOME);

  const { data: catalogData, isLoading: isCatalogLoading } =
    usePublicFetch<ServiceCatalogData>(API_ROUTES.catalog.get_all_catalog);

  const freelancer_intro = [
    {
      icon: AssetsImage.group,
      title: homeLanguageData?.tittle_first_slogan,
      description: homeLanguageData?.content_freelancer_verification,
    },
    {
      icon: AssetsImage.shield,
      title: homeLanguageData?.tittle_second_slogan,
      description: homeLanguageData?.content_payment_protection,
    },
    {
      icon: AssetsImage.paper,
      title: homeLanguageData?.tittle_third_slogan,
      description: homeLanguageData?.content_quality_freelancers,
    },
  ];

  const serviceCatalogs = catalogData?.service_catalogs || [];
  const activeCatalog = serviceCatalogs[activeCatalogIndex];

  if (isLoading || homeLoading || isCatalogLoading) return <Loading />;
  if (error || homeError) return <div>Error loading language data</div>;
  return (
    <div className="min-h-[100vh] bg-white">
      {/* <Header type="transparent" languageData={globalLanguageData} /> */}
      <div className="hidden sm:block">
        <Header type="transparent" />
      </div>
      <div className="block sm:hidden">
        <SpHeader />
      </div>
      <main className="">
        <section className="hidden sm:block h-auto header-gradient pt-[6.5rem] md:pt-[4.5rem]">
          <div className="pt-[3rem] pb-[8rem] flex justify-center flex-col gap-4 text-center">
            <h1 className="text-[24px] font-medium text-white">
              {homeLanguageData?.title_banner_home_page_1}
            </h1>
            <TypingText />
            <p className="text-[18px] font-medium">
              {homeLanguageData?.title_banner_home_page_2}
            </p>
            <div className="mt-[1.5rem] flex justify-center">
              <div className="flex text-black h-[40px] relative w-[624px]">
                <input
                  type="text"
                  placeholder={`${globalLanguageData?.hint_text_header_search}...`}
                  className="focus:outline-none rounded-[20px] border-2-white px-5 text-sm font-mono w-full"
                />
                <FontAwesomeIcon
                  icon={faSearch}
                  className="w-[14px] h-[14px] text-primary absolute right-3 top-1/2 -translate-y-1/2"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="hidden sm:block">
          <div className="grid-container-desktop-banner w-full ">
            <div className="min-h-[144px] mt-[-4rem] px-8 rounded-lg bg-white shadow-panel col-start-2 col-end-3">
              <div className="flex items-center justify-start flex-wrap overflow-x-auto">
                {serviceCatalogs.map((catalog, index) => {
                  const matchedIcon = catalogIcons.find(
                    (c) => c.name === catalog.name
                  )?.icon;

                  return (
                    <div
                      key={catalog.id}
                      className={`group relative flex justify-center w-[9rem] h-[9rem] pt-4 px-2 rounded-lg cursor-pointer after:absolute after:bottom-2 after:block after:w-[80%] after:h-1 after:rounded-full after:bg-primary after:origin-center after:transition-all after:ease-[var(--timing-faster)] ${
                        activeCatalogIndex === index
                          ? "after:scale-100"
                          : "after:scale-0"
                      }`}
                      onClick={() => setActiveCatalogIndex(index)}
                    >
                      <div className="flex flex-col items-center gap-y-[0.75rem] text-center">
                        <div
                          className={`${
                            activeCatalogIndex === index
                              ? "before:opacity-100 before:translate-y-[5px]"
                              : ""
                          } relative transform before:absolute before:opacity-0 before:bottom-[calc(56px*0.2*-1+8px)] before:left-0 before:right-0 before:mx-auto before:w-[calc(56px*0.8)] before:h-[calc(56px*0.2)] before:bg-secondary before:rounded-[50%] before:transition-all before:ease-in-out before:[backface-visibility:hidden] group-hover:before:opacity-100 group-hover:before:translate-y-[5px]`}
                        >
                          <Image
                            src={matchedIcon || CategoriesIcon.industry}
                            alt={catalog.name}
                            width={56}
                            height={56}
                            className={`group-hover:translate-y-[-4px] duration-150 group-hover:grayscale-0 ${
                              activeCatalogIndex === index
                                ? "grayscale-0 translate-y-[-4px]"
                                : "grayscale-[1]"
                            }`}
                          />
                        </div>
                        <p className="text-base font-medium text-text_primary leading-[18.4px]">
                          {catalog.name}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 ">
                <div className="grid min-h-0 min-w-0 grid-cols-[1fr_1fr_1fr_1fr] gap-[0.75rem] ">
                  {activeCatalog?.sections
                    ?.flatMap((section) => section.categories)
                    .slice(0, 8)
                    .map((category) => {
                      const backgroundImage = category.image
                        ? `url(${category.image})`
                        : `url("/categories-image/web-development-02032022.jpg")`;

                      return (
                        <Link
                          key={category.id}
                          href={`/job/${category.slug}`}
                          className="group"
                        >
                          <div
                            style={{
                              backgroundImage,
                            }}
                            className="relative rounded-md overflow-hidden bg-cover bg-center transition-all ease-[120ms] cursor-pointer"
                          >
                            <div className="relative flex items-end h-20 px-4 py-3 text-white bg-[rgba(0,0,0,.5)] font-semibold">
                              <span className="group-hover:translate-y-[-4px] duration-150">
                                {category.name}
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                </div>
                <div className="my-4 flex justify-end">
                  <Link
                    href="/popular-subcat"
                    className="text-primary py-[0.75rem] relative no-underline cursor-pointer outline-none ease-in-out duration-150 transition-all"
                  >
                    {homeLanguageData?.label_see_more_tittle}
                    <FontAwesomeIcon icon={faArrowRight} className="pl-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="block sm:hidden pt-[4.5rem]">
          <SpAdsSlider />
        </section>
        <section className="block sm:hidden p-[0.75rem] border-b-[0.25rem] border-border_primary ">
          <SpCatalog />
        </section>

        <section className="py-6 sm:py-24 grid grid-container-desktop-banner gap-y-4 sm:gap-y-12 ">
          <div className="col-start-2 col-end-3">
            <h4 className="text-[16px] sm:text-[1.5rem] text-[#38404c] font-medium leading-[1.15]">
              {homeLanguageData?.tittle_primary_why_section}
            </h4>
            <h2 className="home-title-head text-[18px] sm:text-[2.25rem]">
              {homeLanguageData?.tittle_secondary_why_section}
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-[1.5rem] gap-y-[1rem] lg:gap-y-0 min-h-0 min-w-0 col-start-2 col-end-3">
            {freelancer_intro.map((freelancer, index) => (
              <div key={index} className="flex flex-col items-center sm:block">
                <Image
                  src={freelancer.icon}
                  alt="Group of people"
                  width={62}
                  height={62}
                  className="max-w-full h-auto align-top self-center"
                />
                <div className="grid grid-cols-[1fr] mt-4 gap-y-1 text-text_primary font-medium">
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
                {homeLanguageData?.title_start_hiring_section}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[1.5rem] min-h-0 min-w-0 col-start-2 col-end-3">
              {/* Cột 1 */}
              <div className="grid grid-rows-2 gap-y-6 text-text_primary font-medium">
                <div className="flex gap-x-5">
                  <div className="flex-shrink-0">
                    <Image
                      src={GroupIcon.group11651}
                      width={30}
                      height={30}
                      alt="group1"
                    />
                  </div>
                  <div>
                    <h1 className="text-[1.25rem] leading-[1.15]">
                      {homeLanguageData?.label_start_hiring_section_1}
                    </h1>
                    <p className="m-0 text-base font-sans leading-[1.65]">
                      {homeLanguageData?.content_start_hiring_section_1}
                    </p>
                  </div>
                </div>
                <div className="flex gap-x-5">
                  <div className="flex-shrink-0">
                    <Image
                      src={GroupIcon.group11653}
                      width={30}
                      height={30}
                      alt="group3"
                    />
                  </div>
                  <div>
                    <h1 className="text-[1.25rem] leading-[1.15]">
                      {homeLanguageData?.label_start_hiring_section_3}
                    </h1>
                    <p className="m-0 text-base font-sans leading-[1.65]">
                      {homeLanguageData?.content_start_hiring_section_3}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cột 2 */}
              <div className="grid grid-rows-2 gap-y-6 text-text_primary font-medium">
                <div className="flex gap-x-5">
                  <div className="flex-shrink-0">
                    <Image
                      src={GroupIcon.group11652}
                      width={30}
                      height={30}
                      alt="group2"
                    />
                  </div>
                  <div>
                    <h1 className="text-[1.25rem] leading-[1.15]">
                      {homeLanguageData?.label_start_hiring_section_2}
                    </h1>
                    <p className="m-0 text-base font-sans leading-[1.65]">
                      {homeLanguageData?.content_start_hiring_section_2}
                    </p>
                  </div>
                </div>
                <div className="flex gap-x-5">
                  <div className="flex-shrink-0">
                    <Image
                      src={GroupIcon.group11654}
                      width={30}
                      height={30}
                      alt="group4"
                    />
                  </div>
                  <div>
                    <h1 className="text-[1.25rem] leading-[1.15]">
                      {homeLanguageData?.label_start_hiring_section_4}
                    </h1>
                    <p className="m-0 text-base font-sans leading-[1.65]">
                      {homeLanguageData?.content_start_hiring_section_4}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cột 3 */}
              <div className="rounded-lg relative cursor-pointer h-[219px] mt-8 md:mt-0">
                <Image
                  src={LandingImage.video_bg}
                  alt="video background"
                  className="rounded-lg object-cover w-full h-full"
                  width={500}
                  height={500}
                />
                <div className="bg-black/25 absolute top-0 left-0 w-full h-full rounded-lg">
                  <div className="w-[75px] h-[75px] rounded-full bg-black absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex justify-center items-center">
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

        <section className="hidden sm:block">
          <SpAdsSlider />
        </section>

        <section className="grid grid-container-desktop-banner">
          <div className="col-start-2 col-end-3">
            <h2 className="home-title-head text-[18px] sm:text-[2.25rem] pb-4">
              {homeLanguageData?.label_recommend_section}
            </h2>
          </div>
        </section>

        <div className="max-w-[1280px] mx-auto px-4 xl:px-8">
          <Swiper
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            mousewheel
            keyboard
            modules={[Navigation]}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            spaceBetween={20}
            className="mySwiper"
          >
            <CustomNavigation />
            {interestImages.map((img, i) => (
              <SwiperSlide key={i}>
                <Image
                  src={img}
                  alt={`Picture ${i + 1}`}
                  className="rounded-lg w-full h-auto"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <section
          className="bg-gradient-to-t py-12 grid grid-container-desktop-banner gap-y-4 sm:gap-y-12 gap-x-4"
          style={{
            background: "linear-gradient(to top, hsl(216 85% 94%), #fff)",
          }}
        >
          <div className="col-start-2 col-end-3">
            <h2 className="home-title-head text-[18px] sm:text-[2.25rem] text-center">
              {homeLanguageData?.tittle_quality_offer_section}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[1.5rem] gap-y-[1.5rem] lg:gap-y-0 min-h-0 min-w-0 col-start-2 col-end-3">
            <div className="flex flex-col shadow-memberShipShadow rounded-lg bg-white">
              <div className="p-6 flex-1 text-center bg-white rounded-lg gap-6">
                <div className="h-[32px]"></div>
                <div className="flex justify-center mt-8 items-center">
                  <Image src={CompareImage.compare1} alt="Freelancer" />
                </div>
                <div className="text-text_primary mt-6">
                  <h3 className="font-semibold text-[1.25rem] mb-2">
                    Freelancer
                  </h3>
                  <ul className="text-sm text-left text-text_secondary grid grid-cols-[1fr] gap-1">
                    <li className="flex flex-row gap-3 items-center">
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="w-[12px] h-[14px] text-third"
                      />
                      <p className="text-[0.875rem] leading-[1.65]">
                        {
                          homeLanguageData?.content_quality_offer_freelancer_card_1
                        }{" "}
                      </p>
                    </li>
                    <li className="flex flex-row gap-3 items-center">
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="w-[12px] h-[14px] text-third"
                      />
                      <p className="text-[0.875rem] leading-[1.65]">
                        {
                          homeLanguageData?.content_quality_offer_freelancer_card_2
                        }{" "}
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
              <div>
                <hr className="w-full h-[1px] m-0 bg-border_secondary" />
                <div className="h-[60px] px-6 flex justify-end items-center ">
                  <div className="opacity-70 text-[0.875rem] cursor-pointer text-text_secondary">
                    {homeLanguageData?.label_see_more_tittle}
                    <FontAwesomeIcon icon={faArrowRight} className="pl-1" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col shadow-memberShipShadow rounded-lg bg-white">
              <div className="p-6 flex-1 text-center bg-white rounded-lg gap-6">
                <div className="w-full flex justify-end">
                  <button className="w-fit pointer-events-none bg-blue-200 text-blue-500 font-semibold py-1 px-4 rounded-full shadow-md hover:bg-blue-400 ">
                    {homeLanguageData?.tittle_quality_offer_specialist_card}
                  </button>
                </div>
                <div className="flex justify-center mt-8 items-center">
                  <Image src={CompareImage.compare2} alt="Specialist" />
                </div>
                <div className="text-text_primary mt-6">
                  <h3 className="font-semibold text-[1.25rem] mb-2">
                    {homeLanguageData?.tittle_quality_offer_specialist_card}
                  </h3>
                  <ul className="text-sm text-left text-text_secondary grid grid-cols-[1fr] gap-1">
                    <li className="flex flex-row gap-3 items-center">
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="w-[12px] h-[14px] text-third"
                      />
                      <p className="text-[0.875rem] leading-[1.65]">
                        {
                          homeLanguageData?.content_quality_offer_specialist_card_1
                        }
                      </p>
                    </li>
                    <li className="flex flex-row gap-3 items-center">
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="w-[12px] h-[14px] text-third"
                      />
                      <p className="text-[0.875rem] leading-[1.65]">
                        {
                          homeLanguageData?.content_quality_offer_specialist_card_2
                        }
                      </p>
                    </li>
                    <li className="flex flex-row gap-3 items-center">
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="w-[12px] h-[14px] text-third"
                      />
                      <p className="text-[0.875rem] leading-[1.65]">
                        {
                          homeLanguageData?.content_quality_offer_specialist_card_3
                        }
                      </p>
                    </li>
                    <li className="flex flex-row gap-3 items-center">
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="w-[12px] h-[14px] text-third"
                      />
                      <p className="text-[0.875rem] leading-[1.65]">
                        {
                          homeLanguageData?.content_quality_offer_specialist_card_4
                        }
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
              <div>
                <hr className="w-full h-[1px] m-0 bg-border_secondary" />
                <div className="h-[60px] px-6 flex justify-end items-center ">
                  <div className="opacity-70 text-[0.875rem] cursor-pointer text-text_secondary">
                    {homeLanguageData?.label_see_more_tittle}
                    <FontAwesomeIcon icon={faArrowRight} className="pl-1" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col shadow-memberShipShadow rounded-lg bg-white">
              <div className="p-6 flex-1 text-center bg-white rounded-lg gap-6">
                <div className="w-full flex justify-end">
                  <button className="w-fit pointer-events-none bg-blue-500 text-white font-semibold py-1 px-4 rounded-full shadow-md hover:bg-blue-400">
                    {homeLanguageData?.tittle_quality_offer_professional_card}
                  </button>
                </div>
                <div className="flex justify-center mt-8 items-center">
                  <Image src={CompareImage.compare3} alt="Professional" />
                </div>
                <div className="text-text_primary mt-6">
                  <h3 className="font-semibold text-[1.25rem] mb-2">
                    {homeLanguageData?.tittle_quality_offer_professional_card}
                  </h3>
                  <ul className="text-sm text-left text-text_secondary grid grid-cols-[1fr] gap-1">
                    <li className="flex flex-row gap-3 items-center">
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="w-[12px] h-[14px] text-third"
                      />
                      <p className="text-[0.875rem] leading-[1.65]">
                        {
                          homeLanguageData?.content_quality_offer_professional_card_1
                        }
                      </p>
                    </li>
                    <li className="flex flex-row gap-3 items-center">
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="w-[12px] h-[14px] text-third"
                      />
                      <p className="text-[0.875rem] leading-[1.65]">
                        {
                          homeLanguageData?.content_quality_offer_professional_card_2
                        }
                      </p>
                    </li>
                    <li className="flex flex-row gap-3 items-center">
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="w-[12px] h-[14px] text-third"
                      />
                      <p className="text-[0.875rem] leading-[1.65]">
                        {
                          homeLanguageData?.content_quality_offer_professional_card_3
                        }
                      </p>
                    </li>
                    <li className="flex flex-row gap-3 items-center">
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="w-[12px] h-[14px] text-third"
                      />
                      <p className="text-[0.875rem] leading-[1.65]">
                        {
                          homeLanguageData?.content_quality_offer_professional_card_4
                        }
                      </p>
                    </li>
                    <li className="flex flex-row gap-3 items-center">
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="w-[12px] h-[14px] text-third"
                      />
                      <p className="text-[0.875rem] leading-[1.65]">
                        {
                          homeLanguageData?.content_quality_offer_professional_card_5
                        }
                      </p>
                    </li>
                    <li className="flex flex-row gap-3 items-center">
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="w-[12px] h-[14px] text-third"
                      />
                      <p className="text-[0.875rem] leading-[1.65]">
                        {
                          homeLanguageData?.content_quality_offer_professional_card_6
                        }
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
              <div>
                <hr className="w-full h-[1px] m-0 bg-border_secondary" />
                <div className="h-[60px] px-6 flex justify-end items-center ">
                  <div className="opacity-70 text-[0.875rem] cursor-pointer text-text_secondary">
                    {homeLanguageData?.label_see_more_tittle}
                    <FontAwesomeIcon icon={faArrowRight} className="pl-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-start-2 col-end-3"></div>
        </section>

        <section className="bg-white pt-4 sm:pt-12 grid grid-container-desktop-banner">
          <div className="col-start-2 col-end-3 text-[rgb(8,67,155)] font-[500] text-[18px] sm:text-[2.25rem] leading-[41.4px]">
            {homeLanguageData?.title_popular_freelancers}
          </div>
        </section>

        <div className="max-w-[1280px] mx-auto px-[26px] xl:px-[42px] pt-6 pb-7">
          <Swiper
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            slidesPerView={5}
            cssMode={true}
            mousewheel
            keyboard
            modules={[Navigation]}
            className="mySwiper"
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 4, spaceBetween: 20 },
              1024: { slidesPerView: 5, spaceBetween: 20 },
            }}
          >
            <CustomNavigation />
            {Array.from({ length: 16 }, (_, index) => (
              <SwiperSlide key={index}>
                <CategoryCardMock />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <section className="bg-white pt-4 sm:pt-12 grid grid-container-desktop-banner">
          <div className="col-start-2 col-end-3 text-[rgb(8,67,155)] font-[500] text-[18px] sm:text-[2.25rem] leading-[41.4px]">
            {homeLanguageData?.title_astrology_freelancers}
          </div>
        </section>

        <div className="max-w-[1280px] mx-auto px-[26px] xl:px-[42px] pt-6 pb-7">
          <Swiper
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            slidesPerView={5}
            cssMode={true}
            mousewheel
            keyboard
            modules={[Navigation]}
            className="mySwiper"
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 4, spaceBetween: 10 },
              1024: { slidesPerView: 5, spaceBetween: 20 },
            }}
          >
            <CustomNavigation />
            {Array.from({ length: 16 }, (_, index) => (
              <SwiperSlide key={index}>
                <CategoryCardMock />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <section className="bg-white pt-4 sm:pt-12 grid grid-container-desktop-banner">
          <div className="col-start-2 col-end-3 text-[rgb(8,67,155)] font-[500] text-[18px] sm:text-[2.25rem] leading-[41.4px]">
            {homeLanguageData?.title_logo_design_freelancers}
          </div>
        </section>

        <div className="max-w-[1280px] mx-auto px-[26px] xl:px-[42px] pt-6 pb-7">
          <Swiper
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            slidesPerView={5}
            cssMode={true}
            mousewheel
            keyboard
            modules={[Navigation]}
            className="mySwiper"
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 4, spaceBetween: 10 },
              1024: { slidesPerView: 5, spaceBetween: 20 },
            }}
          >
            <CustomNavigation />
            {Array.from({ length: 16 }, (_, index) => (
              <SwiperSlide key={index}>
                <CategoryCardMock />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <section className="bg-white pt-4 sm:pt-12 grid grid-container-desktop-banner">
          <div className="col-start-2 col-end-3 text-[rgb(8,67,155)] font-[500] text-[18px] sm:text-[2.25rem] leading-[41.4px]">
            {homeLanguageData?.title_featured_works}
          </div>
        </section>
        <div className="max-w-[1280px] mx-auto px-4 xl:px-8 pb-16 pt-8">
          <Swiper
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            slidesPerView={3}
            mousewheel
            keyboard
            modules={[Navigation]}
            breakpoints={{
              0: { slidesPerView: 1, spaceBetween: 20 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 30 },
            }}
            className="mySwiper"
          >
            <CustomNavigation />
            {Array.from({ length: 6 }, (_, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white p-4 sm:p-6 pb-8">
                  <Link
                    href="/"
                    className="block rounded-lg mx-auto w-[350px] shadow-topWorkShadow"
                  >
                    <div className="h-[256px] relative">
                      <Image
                        src={LandingImage.top_works}
                        alt="Hotel Image"
                        width={400}
                        height={200}
                        className="absolute h-full w-full inset-0 object-cover rounded-tr-lg rounded-tl-lg"
                      />
                    </div>
                    <div className="rounded-br-lg rounded-bl-lg bg-white">
                      <div className="grid-cols-[2fr_10fr] grid min-w-0 min-h-0 p-4">
                        <div>
                          <Image
                            src={ProfileImage.avatar}
                            alt="profile Image"
                            width={400}
                            height={200}
                            className="max-w-full h-auto w-9 block rounded-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-text_primary p-0">
                            Line sticker
                          </p>
                          <p className="text-[14px] text-text_secondary p-0">
                            by designdee
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <section className="bg-white grid grid-container-desktop-banner">
          <div className="col-start-2 col-end-3 text-[rgb(8,67,155)] font-[500] text-[18px] sm:text-[2.25rem] leading-[41.4px]">
            {homeLanguageData?.label_reviews_customer}
          </div>
        </section>
        <div className="max-w-[1280px] mx-auto px-4 xl:px-8 pb-16 pt-4">
          <Swiper
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            mousewheel
            keyboard
            modules={[Navigation]}
            breakpoints={{
              0: { slidesPerView: 1, spaceBetween: 20 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 30 },
            }}
            className="mySwiper"
          >
            <CustomNavigation />
            {Array.from({ length: 6 }, (_, index) => (
              <SwiperSlide key={index}>
                <div className="w-full max-w-[350px] m-auto bg-white px-4 py-6">
                  <div className="shadow-reviewShadow rounded-lg p-4 sm:p-6">
                    <div className="mb-6 flex flex-row gap-4 sm:gap-8">
                      <FontAwesomeIcon
                        icon={faQuoteLeft}
                        className="text-[#E3EDFD] w-[24px] h-[28px] sm:w-[28px] sm:h-[32px]"
                      />
                      <blockquote className="text-base leading-[1.65] text-[#728197] font-sans italic">
                        &ldquo;Fastwork ทำให้ การทำงาน สะดวก และ ง่ายขึ้นมากครับ
                        เราสามารถ เลือกฟรีแลนซ์ได้ตามสไตล์ที่เราต้องการ&rdquo;
                      </blockquote>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-4">
                        <Image
                          src={ProfileImage.avatar}
                          alt="Company Logo"
                          width={47}
                          height={47}
                          className="rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                          <span className="text-third font-medium text-sm">
                            บริษัท อีสานพลาสแพ็ค 1999 จำกัด
                          </span>
                          <div className="text-gray-500 text-xs">
                            โรงงานอุตสาหกรรมพลาสติก
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <section
          className="hidden md:block"
          style={{ backgroundColor: "hsl(216, 15%, 97%)" }}
        >
          <div className="py-8 grid grid-container-desktop gap-y-[1.5rem]">
            <div className="col-start-2 col-end-3 w-full text-center">
              <h5 className="text-[1.25rem] text-[#2B323BF2] font-medium font-secondary leading-[1.15] mb-[1.5rem]">
                {homeLanguageData?.title_trusted_companies}
              </h5>
              <div className="grid grid-cols-6 grid-rows-2 gap-x-8 gap-y-4">
                <Image
                  src={CustomerImage.pic1}
                  alt="trusted by company"
                  style={{ filter: "grayscale(100%)" }}
                  width={384}
                  height={230}
                />
                <Image
                  src={CustomerImage.pic2}
                  alt="trusted by company"
                  style={{ filter: "grayscale(100%)" }}
                  width={384}
                  height={230}
                />
                <Image
                  src={CustomerImage.pic3}
                  alt="trusted by company"
                  style={{ filter: "grayscale(100%)" }}
                  width={384}
                  height={230}
                />
                <Image
                  src={CustomerImage.pic4}
                  alt="trusted by company"
                  style={{ filter: "grayscale(100%)" }}
                  width={384}
                  height={230}
                />
                <Image
                  src={CustomerImage.pic5}
                  alt="trusted by company"
                  style={{ filter: "grayscale(100%)" }}
                  width={384}
                  height={230}
                />
                <Image
                  src={CustomerImage.pic6}
                  alt="trusted by company"
                  style={{ filter: "grayscale(100%)" }}
                  width={384}
                  height={230}
                />
                <Image
                  src={CustomerImage.pic7}
                  alt="trusted by company"
                  style={{ filter: "grayscale(100%)" }}
                  width={384}
                  height={230}
                />
                <Image
                  src={CustomerImage.pic8}
                  alt="trusted by company"
                  style={{ filter: "grayscale(100%)" }}
                  width={384}
                  height={230}
                />
                <Image
                  src={CustomerImage.pic9}
                  alt="trusted by company"
                  style={{ filter: "grayscale(100%)" }}
                  width={384}
                  height={230}
                />
                <Image
                  src={CustomerImage.pic10}
                  alt="trusted by company"
                  style={{ filter: "grayscale(100%)" }}
                  width={384}
                  height={230}
                />
                <Image
                  src={CustomerImage.pic11}
                  alt="trusted by company"
                  style={{ filter: "grayscale(100%)" }}
                  width={384}
                  height={230}
                />
                <Image
                  src={CustomerImage.pic12}
                  alt="trusted by company"
                  style={{ filter: "grayscale(100%)" }}
                  width={384}
                  height={230}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="hidden md:block">
          <div className="bg-white pt-24 pb-16 grid grid-container-desktop gap-y-12">
            <div className="col-start-2 col-end-3 w-full text-left">
              <h2 className="block text-[rgb(8,67,155)] font-[500] text-[36px] leading-[41.4px] mt-[0.83em] mb-[0.83em] mx-0">
                {homeLanguageData?.title_platform}
              </h2>
              <div
                className={`text-gray-700 overflow-hidden transition-all duration-300 ${
                  expanded ? "max-h-[500px]" : "max-h-20"
                }`}
              >
                <p>{homeLanguageData?.content_fastwork_1}</p>
                <br />
                <p>{homeLanguageData?.content_fastwork_2}</p>
                <br /> <p>{homeLanguageData?.content_fastwork_3}</p>
              </div>
              {!expanded && (
                <div
                  className="text-blue-600 cursor-pointer text-center mt-4"
                  onClick={() => setExpanded(true)}
                >
                  {homeLanguageData?.button_job_categories_view_more} ▼
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="grid grid-container-desktop-banner">
          <div className="col-start-2 col-end-3 w-full">
            <hr className="w-full h-[1px] m-0 bg-border_secondary" />
          </div>
        </div>

        <section className="hidden md:block">
          <div className="bg-white pt-24 pb-16 grid grid-container-desktop gap-y-12">
            <div className="col-start-2 col-end-3 w-full">
              <h2 className="block text-[rgb(8,67,155)] font-[500] text-[36px] leading-[41.4px] mb-[0.83em] mx-0">
                {homeLanguageData?.title_job_categories}
              </h2>
              <div className="grid w-full gap-x-8 gap-y-6 grid-cols-4 grid-rows-2">
                <div className="block">
                  <strong className="mb-2 !important font-[Kanit] text-[#2B323BF2]">
                    {homeLanguageData?.graphic_design}
                  </strong>
                  <p className="mt-[0.5rem] text-[hsl(216,15%,52%)] text-opacity-[var(--cl-opacity)] text-[0.875rem] leading-[1.65] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif]">
                    {/* <Link href="/social-media-banner">ออกแบบแบนเนอร์</Link>
                    ,&nbsp;
                    <Link href="/publication/namecard">ออกแบบนามบัตร</Link>
                    ,&nbsp;
                    <Link href="/publication/poster">ออกแบบโปสเตอร์</Link>
                    ,&nbsp;
                    <Link href="/infographics">ทำ Infographic</Link>,&nbsp;
                    <Link href="/portfolio-resume">รับทำเรซูเม่</Link>,&nbsp;
                    <Link href="/tattoo-design">ออกแบบลายสัก</Link>,&nbsp;
                    <Link href="/packaging">ออกแบบแพคเกจจิ้ง</Link>,&nbsp;
                    <Link href="/corporate-identity">ออกแบบ CI</Link>,&nbsp;
                    <Link href="/design-graphic">ดูเพิ่มเติม</Link> */}
                    {homeLanguageData?.graphic_design_services}
                  </p>
                </div>
                <div className="block">
                  <strong className="mb-2 !important font-[Kanit] text-[#2B323BF2]">
                    {homeLanguageData?.architecture_engineering}
                  </strong>
                  <p className="mt-[0.5rem] text-[hsl(216,15%,52%)] text-opacity-[var(--cl-opacity)] text-[0.875rem] leading-[1.65] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif]">
                    {/* <Link href="/architect-and-interior/renovation">
                      รีโนเวทบ้าน
                    </Link>
                    ,&nbsp;
                    <Link href="/architect-and-interior/home-design">
                      ออกแบบบ้าน
                    </Link>
                    ,&nbsp;
                    <Link href="/engineering-structural-design/boq">
                      ถอดแบบประมาณราคา
                    </Link>
                    ,&nbsp;
                    <Link href="/engineering-structural-design">
                      เขียนแบบก่อสร้าง
                    </Link>
                    ,&nbsp;<Link href="/home-inspection">ตรวจรับบ้าน</Link>
                    ,&nbsp;
                    <Link href="/landscape">จัดสวนหน้าบ้าน งบน้อย</Link>,&nbsp;
                    <Link href="/engineering-structural-design/residence">
                      เขียนแบบบ้านชั้นเดียว
                    </Link>
                    ,&nbsp;
                    <Link href="/architect-and-interior/furniture">
                      ออกแบบเตียงนอน
                    </Link>
                    ,&nbsp;
                    <Link href="/engineering-structural-design/machine">
                      ถอดแบบเครื่องกล
                    </Link>
                    ,&nbsp;
                    <Link href="/architect-and-engineer">ดูเพิ่มเติม</Link> */}
                    {homeLanguageData?.architecture_engineering_services}
                  </p>
                </div>
                <div className="block">
                  <strong className="mb-2 !important font-[Kanit] text-[#2B323BF2]">
                    {homeLanguageData?.website_programming}
                  </strong>
                  <p className="mt-[0.5rem] text-[hsl(216,15%,52%)] text-opacity-[var(--cl-opacity)] text-[0.875rem] leading-[1.65] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif]">
                    {/* <Link href="/ux-ui-design-web-app">ออกแบบเว็บไซต์</Link>
                    ,&nbsp;
                    <Link href="/web-development/ecommerce">
                      สร้างเว็บขายของ
                    </Link>
                    ,&nbsp;
                    <Link href="/web-development/instant-builder">
                      เว็บไซต์สำเร็จรูป
                    </Link>
                    ,&nbsp;
                    <Link href="/desktop-application">รับเขียนโปรแกรม</Link>
                    ,&nbsp;<Link href="/chatbot">Chatbot Facebook</Link>,&nbsp;
                    <Link href="/chatbot">สร้างบอทไลน์</Link>,&nbsp;
                    <Link href="/web-scraping">Website Scraping</Link>,&nbsp;
                    <Link href="/it-solution-and-support/software">
                      รับลงโปรแกรม
                    </Link>
                    ,&nbsp;<Link href="/web-programming">ดูเพิ่มเติม</Link> */}
                    {homeLanguageData?.website_programming_services}
                  </p>
                </div>
                <div className="block">
                  <strong className="mb-2 !important font-[Kanit] text-[#2B323BF2]">
                    {homeLanguageData?.marketing_advertising}
                  </strong>
                  <p className="mt-[0.5rem] text-[hsl(216,15%,52%)] text-opacity-[var(--cl-opacity)] text-[0.875rem] leading-[1.65] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif]">
                    {/* <Link href="/seo">รับทำ SEO</Link>,&nbsp;
                    <Link href="/google-ads">โฆษณา Google</Link>,&nbsp;
                    <Link href="/social-media-ads/facebook-ads">
                      โฆษณา Facebook
                    </Link>
                    ,&nbsp;
                    <Link href="/social-media-ads/tiktok-ads">
                      โฆษณา TikTok
                    </Link>
                    ,&nbsp;<Link href="/blogger-netidol">บล็อกเกอร์รีวิว</Link>
                    ,&nbsp;
                    <Link href="/promote-page/product">โปรโมทสินค้า</Link>
                    ,&nbsp;
                    <Link href="/focus-group">รับจ้างทดลองสินค้า</Link>,&nbsp;
                    <Link href="/promote-real-estate">รับฝากขายบ้าน</Link>
                    ,&nbsp;
                    <Link href="/google-map">ปักหมุด google map</Link>,&nbsp;
                    <Link href="/marketing-advertising">ดูเพิ่มเติม</Link> */}
                    {homeLanguageData?.marketing_advertising_services}
                  </p>
                </div>
                <div className="block">
                  <strong className="mb-2 !important font-[Kanit] text-[#2B323BF2]">
                    {homeLanguageData?.writing_translation}
                  </strong>
                  <p className="mt-[0.5rem] text-[hsl(216,15%,52%)] text-opacity-[var(--cl-opacity)] text-[0.875rem] leading-[1.65] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif]">
                    {/* <Link href="/translation">แปลภาษา</Link>,&nbsp;
                    <Link href="/translator">ล่ามแปลภาษา</Link>,&nbsp;
                    <Link href="/transcription">ถอดไฟล์เสียง</Link>,&nbsp;
                    <Link href="/content-writing">เขียนคอนเทนต์</Link>,&nbsp;
                    <Link href="/content-writing/seo">เขียนบทความ SEO</Link>
                    ,&nbsp;
                    <Link href="/content-writing/foreign-language">
                      เขียนบทความภาษาอังกฤษ
                    </Link>
                    ,&nbsp;
                    <Link href="/content-writing/thesis-report">
                      รับเขียนรายงาน
                    </Link>
                    ,&nbsp;<Link href="/proofreading">พิสูจน์อักษร</Link>,&nbsp;
                    <Link href="/story-writing/poets-and-poems">
                      รับแต่งกลอน
                    </Link>
                    ,&nbsp;<Link href="/writing-translation">ดูเพิ่มเติม</Link> */}
                    {homeLanguageData?.writing_translation_services}
                  </p>
                </div>
                <div className="block">
                  <strong className="mb-2 !important font-[Kanit] text-[#2B323BF2]">
                    {homeLanguageData?.media_audio}
                  </strong>
                  <p className="mt-[0.5rem] text-[hsl(216,15%,52%)] text-opacity-[var(--cl-opacity)] text-[0.875rem] leading-[1.65] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif]">
                    {/* <Link href="/photography">ตากล้อง</Link>,&nbsp;
                    <Link href="/photography/wedding">ถ่ายพรีเวดดิ้ง</Link>
                    ,&nbsp;
                    <Link href="/podcast">สร้าง Podcast</Link>,&nbsp;
                    <Link href="/sound-engineering/edit-mixing-mastering">
                      ตัดต่อเพลง
                    </Link>
                    ,&nbsp;<Link href="/videography">ตัดต่อวีดีโอ</Link>,&nbsp;
                    <Link href="/subtitle">ทำซับไตเติ้ล</Link>,&nbsp;
                    <Link href="/motion-graphics">Motion Graphic</Link>,&nbsp;
                    <Link href="/videography/live-streaming">รับไลฟ์สด</Link>
                    ,&nbsp;
                    <Link href="/animations">ทำอนิเมชั่น</Link>,&nbsp;
                    <Link href="/voice-over">พากย์เสียง</Link>,&nbsp;
                    <Link href="/photography-video">ดูเพิ่มเติม</Link> */}
                    {homeLanguageData?.media_audio_services}
                  </p>
                </div>
                <div className="block">
                  <strong className="mb-2 !important font-[Kanit] text-[#2B323BF2]">
                    {homeLanguageData?.business_consulting}
                  </strong>
                  <p className="mt-[0.5rem] text-[hsl(216,15%,52%)] text-opacity-[var(--cl-opacity)] text-[0.875rem] leading-[1.65] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif]">
                    {/* <Link href="/accounting-and-finance/accounting-service">
                      รับทำบัญชี
                    </Link>
                    ,&nbsp;<Link href="/counseling">รับปรึกษาปัญหาชีวิต</Link>
                    ,&nbsp;
                    <Link href="/financial-planning">ที่ปรึกษาทางการเงิน</Link>
                    ,&nbsp;
                    <Link href="/legal">ที่ปรึกษากฎหมาย</Link>,&nbsp;
                    <Link href="/psychologist">ปรึกษาสุขภาพจิต</Link>,&nbsp;
                    <Link href="/order-from-china">สั่งสินค้าจากจีน</Link>
                    ,&nbsp;
                    <Link href="/secretary">เลขาส่วนตัว</Link>,&nbsp;
                    <Link href="/commercial-registration">จดทะเบียนบริษัท</Link>
                    ,&nbsp;
                    <Link href="/business">ปรึกษาธุรกิจ</Link>,&nbsp;
                    <Link href="/consultant">ดูเพิ่มเติม</Link> */}
                    {homeLanguageData?.business_consulting_services}
                  </p>
                </div>
                <div className="block">
                  <strong className="mb-2 !important font-[Kanit] text-[#2B323BF2]">
                    {homeLanguageData?.lifestyle}
                  </strong>
                  <p className="mt-[0.5rem] text-[hsl(216,15%,52%)] text-opacity-[var(--cl-opacity)] text-[0.875rem] leading-[1.65] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif]">
                    {/* <Link href="/car-inspection">ตรวจรถมือสอง</Link>,&nbsp;
                    <Link href="/feng-shui">ซินแสดูฮวงจุ้ยบ้าน</Link>,&nbsp;
                    <Link href="/gaming">รับจ้างเล่นเกม</Link>,&nbsp;
                    <Link href="/horoscope">ดูดวง</Link>,&nbsp;
                    <Link href="/makeup">ช่างแต่งหน้า</Link>,&nbsp;
                    <Link href="/personnal-trainer">จ้างเทรนเนอร์</Link>,&nbsp;
                    <Link href="/nutrition">ปรึกษานักโภชนาการ</Link>,&nbsp;
                    <Link href="/singer-band">หานักร้อง</Link>,&nbsp;
                    <Link href="/trip-planner">รับวางแผนเที่ยว</Link>,&nbsp;
                    <Link href="/prop-stylist">สไตล์ลิส</Link>,&nbsp;
                    <Link href="/lifestyle">ดูเพิ่มเติม</Link> */}
                    {homeLanguageData?.lifestyle_services}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <div className="bg-[#E3EDFD]  hidden lg:block">
        <div className=" bg-no-repeat w-4/6 bg-[105%_30px] grid place-self-start gap-x-8 grid-cols-[minmax(1rem,_1fr)_minmax(calc(var(--breakpoint-lg)_-_4rem),_calc(var(--breakpoint-lg)_-_4rem))_minmax(1rem,_1fr)] mx-auto grid-rows-auto">
          <div className="grid grid-cols-[7fr_5fr] min-w-0 min-h-0 ">
            <Image
              alt="Download Application"
              loading="lazy"
              decoding="async"
              data-nimg="1"
              className="justify-self-end h-auto max-w-[80%]"
              src={imgapp}
            />

            <div className="flex items-center pl-[2rem]">
              <div>
                <h4 className="text-black text-[1.125rem] font-[500] leading-[20.7px] flex items-center font-[Kanit, -apple-system, system-ui, blinkmacsystemfont, 'Segoe UI', roboto, 'Helvetica Neue', sans-serif]">
                  {homeLanguageData?.button_download_app}
                </h4>
                <p className="mt-[0.5rem] text-[1rem] text-black font-[Kanit, -apple-system, system-ui, blinkmacsystemfont, 'Segoe UI', roboto, 'Helvetica Neue', sans-serif] leading-[1.65] m-0 p-0 block mb-[1em] mt-[1em] mx-0">
                  {homeLanguageData?.subtitle_download_app}
                </p>
                <div className="mt-[1.5rem] flex">
                  <div className="grid grid-cols-1 min-w-0 min-h-0 gap-4">
                    <Link href="https://apps.apple.com/us/app/fastwork-hire-freelancers/id1154830520?ls=1">
                      <Image
                        src={apple}
                        alt="Apple Store"
                        width={135}
                        height={40}
                        className="max-w-full h-auto"
                      />
                    </Link>
                    <Link href="https://play.google.com/store/apps/details?id=com.fastwork.app&hl=en">
                      <Image
                        src={google}
                        alt="Google Play"
                        width={135}
                        height={40}
                        className="max-w-full h-auto"
                      />
                    </Link>
                  </div>
                  <div className="ml-[1rem]">
                    <Image
                      src={fastwork}
                      alt="QR Code"
                      width={96}
                      height={96}
                      className="max-w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {session && (
        <LocationSelectionModal
          isOpen={isOpenLocationSelection}
          onClose={() => setIsOpenLocationSelection(false)}
          handleConfirmChange={() => setIsOpenLocationSelection(false)}
        />
      )}
    </div>
  );
}
