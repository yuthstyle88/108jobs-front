"use client";

import apple from "@/assets/icons/apple.svg";
import google from "@/assets/icons/google-play.svg";
import fastwork from "@/assets/images/fastwork-app-qr.webp";
import imgapp from "@/assets/images/img-app.webp";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import TypingText from "@/components/TypingText";
import Image from "next/image";

import {Swiper, SwiperSlide, useSwiper} from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../styles.css";

import {Navigation} from "swiper/modules";

import CategoryCardMock from "@/components/CategoryCardMock";
import CatalogBanner from "@/components/Home/Catalog";
import HiringSection from "@/components/Home/HiringSection";
import IntroductionSection from "@/components/Home/IntroductionSection";
import OfferSection from "@/components/Home/OfferSection";
import RecommendAndReview from "@/components/Home/RecommendAndReview";
import Loading from "@/components/Loading";
import LocationSelectionModal from "@/components/LocationSelectionModal";
import SearchInput from "@/components/SearchInput";
import {LandingImage} from "@/constants/images";
import SpAdsSlider from "@/containers/SpAdsSlider";
import SpCatalog from "@/containers/SpCatalog";
import SpHeader from "@/containers/SpHeader";
import {useAuthInfo} from "@/hooks/authenticate-api/useAuthInfo";
import Link from "next/link";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {useHttpGet} from "@/hooks/useHttpGet";

const interestImages = [
  LandingImage.interest1,
  LandingImage.interest2,
  LandingImage.interest3,
  LandingImage.interest4,
  LandingImage.interest5,
  LandingImage.interest6,
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
  const {isLoggedIn} = useAuthInfo();
  const {t} = useTranslation();

  const [activeCatalogIndex, setActiveCatalogIndex] = useState<number>(0);
  const [expanded, setExpanded] = useState(false);
  const [isOpenLocationSelection, setIsOpenLocationSelection] = useState(false);

  const {
    data: catalogData,
    isMutating: isCatalogLoading,
  } = useHttpGet("listCommunities");

  const serviceCatalogs = catalogData?.communities || [];
  const activeCatalog = serviceCatalogs[activeCatalogIndex];

  console.log("data: ", serviceCatalogs)


  if (isCatalogLoading) return <Loading/>;

  return (
    <div className="min-h-[100vh] bg-white">
      {/* <Header type="transparent" languageData={globalLanguageData} /> */}
      <div className="hidden sm:block">
        <Header type="transparent"/>
      </div>
      <div className="block sm:hidden">
        <SpHeader/>
      </div>
      <main className="">
        <section className="hidden sm:block h-auto header-gradient pt-[6.5rem] md:pt-[4.5rem]">
          <div className="pt-[3rem] pb-[8rem] flex justify-center flex-col gap-4 text-center">
            <h1 className="text-[24px] font-medium text-white">
              {t("home.titleBannerHomePage1")}
            </h1>
            <TypingText/>
            <p className="text-[18px] font-medium">
              {t("home.titleBannerHomePage2")}
            </p>
            <SearchInput/>
          </div>
        </section>
        <CatalogBanner
          serviceCatalogs={serviceCatalogs}
          activeCatalog={activeCatalog}
          activeCatalogIndex={activeCatalogIndex}
          setActiveCatalogIndex={setActiveCatalogIndex}
        />

        <section className="block sm:hidden pt-[4.5rem]">
          <SpAdsSlider/>
        </section>
        <section className="block sm:hidden p-[0.75rem] border-b-[0.25rem] border-border-primary ">
          <SpCatalog activeCatalog={activeCatalog}/>
        </section>

        <HiringSection/>

        <section className="hidden sm:block">
          <SpAdsSlider/>
        </section>

        <section className="grid grid-container-desktop-banner">
          <div className="col-start-2 col-end-3">
            <h2 className="home-title-head text-[18px] sm:text-[2.25rem] pb-4">
              {t("global.labelRecommendSection")}
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
              0: {slidesPerView: 1},
              640: {slidesPerView: 2},
              1024: {slidesPerView: 3},
            }}
            spaceBetween={20}
            className="mySwiper"
          >
            <CustomNavigation/>
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

        <OfferSection/>

        <section className="bg-white pt-4 sm:pt-12 grid grid-container-desktop-banner">
          <div className="col-start-2 col-end-3 text-[rgb(8,67,155)] font-[500] text-[18px] sm:text-[2.25rem] leading-[41.4px]">
            {t("global.titlePopularFreelancers")}
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
              0: {slidesPerView: 1},
              640: {slidesPerView: 2, spaceBetween: 20},
              768: {slidesPerView: 4, spaceBetween: 20},
              1024: {slidesPerView: 5, spaceBetween: 20},
            }}
          >
            <CustomNavigation/>
            {Array.from({length: 16},
              (_, index) => (
                <SwiperSlide key={index}>
                  <CategoryCardMock/>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>

        <section className="bg-white pt-4 sm:pt-12 grid grid-container-desktop-banner">
          <div className="col-start-2 col-end-3 text-[rgb(8,67,155)] font-[500] text-[18px] sm:text-[2.25rem] leading-[41.4px]">
            {t("global.titleAstrologyFreelancers")}
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
              0: {slidesPerView: 1},
              640: {slidesPerView: 2, spaceBetween: 20},
              768: {slidesPerView: 4, spaceBetween: 10},
              1024: {slidesPerView: 5, spaceBetween: 20},
            }}
          >
            <CustomNavigation/>
            {Array.from({length: 16},
              (_, index) => (
                <SwiperSlide key={index}>
                  <CategoryCardMock/>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>

        <section className="bg-white pt-4 sm:pt-12 grid grid-container-desktop-banner">
          <div className="col-start-2 col-end-3 text-[rgb(8,67,155)] font-[500] text-[18px] sm:text-[2.25rem] leading-[41.4px]">
            {t("global.titleLogoDesignFreelancers")}
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
              0: {slidesPerView: 1},
              640: {slidesPerView: 2, spaceBetween: 20},
              768: {slidesPerView: 4, spaceBetween: 10},
              1024: {slidesPerView: 5, spaceBetween: 20},
            }}
          >
            <CustomNavigation/>
            {Array.from({length: 16},
              (_, index) => (
                <SwiperSlide key={index}>
                  <CategoryCardMock/>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>

        <RecommendAndReview/>

        <IntroductionSection
          expanded={expanded}
          setExpanded={setExpanded}
        />
      </main>
      <div className="bg-[#E3EDFD]  hidden lg:block">
        <div
          className=" bg-no-repeat w-4/6 bg-[105%30px] grid place-self-start gap-x-8 grid-cols-[minmax(1rem,1fr)Minmax(calc(var(--breakpoint-lg)-4rem),Calc(var(--breakpoint-lg)-4rem))Minmax(1rem,1fr)] mx-auto grid-rows-auto">
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
                <h4
                  className="text-black text-[1.125rem] font-[500] leading-[20.7px] flex items-center font-[Kanit, -apple-system, system-ui, blinkmacsystemfont, 'Segoe UI', roboto, 'Helvetica Neue', sans-serif]">
                  {t("global.buttonDownloadApp")}
                </h4>
                <p
                  className="mt-[0.5rem] text-[1rem] text-black font-[Kanit, -apple-system, system-ui, blinkmacsystemfont, 'Segoe UI', roboto, 'Helvetica Neue', sans-serif] leading-[1.65] m-0 p-0 block mb-[1em] mt-[1em] mx-0">
                  {t("global.subtitleDownloadApp")}
                </p>
                <div className="mt-[1.5rem] flex">
                  <div className="grid grid-cols-1 min-w-0 min-h-0 gap-4">
                    <Link
                      prefetch={false}
                      href="https://apps.apple.com/us/app/fastwork-hire-freelancers/id1154830520?ls=1"
                    >
                      <Image
                        src={apple}
                        alt="Apple Store"
                        width={135}
                        height={40}
                        className="max-w-full h-auto"
                      />
                    </Link>
                    <Link
                      prefetch={false}
                      href="https://play.google.com/store/apps/details?id=com.fastwork.app&hl=en"
                    >
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
      <Footer/>
      {isLoggedIn && (
        <LocationSelectionModal
          isOpen={isOpenLocationSelection}
          onClose={() => setIsOpenLocationSelection(false)}
          onOpen={() => setIsOpenLocationSelection(true)}
          handleConfirmChange={() => setIsOpenLocationSelection(false)}
        />
      )}
    </div>
  );
}
