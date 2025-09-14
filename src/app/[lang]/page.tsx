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

import CatalogBanner from "@/components/Home/Catalog";
import HiringSection from "@/components/Home/HiringSection";
import IntroductionSection from "@/components/Home/IntroductionSection";
import OfferSection from "@/components/Home/OfferSection";
import RecommendAndReview from "@/components/Home/RecommendAndReview";
import SearchInput from "@/components/SearchInput";
import {LandingImage} from "@/constants/images";
import SpAdsSlider from "@/containers/SpAdsSlider";
import SpCatalog from "@/containers/SpCatalog";
import SpHeader from "@/containers/SpHeader";
import Link from "next/link";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {buildCommunitiesTree} from "@/utils/helpers";
import {useCommunities} from "@/hooks/communites-api/useCommunities";

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
    const {t} = useTranslation();
    const [activeCatalogIndex, setActiveCatalogIndex] = useState<number>(0);
    const [expanded, setExpanded] = useState(false);
    const catalogData = useCommunities();
    const serviceCatalogs = buildCommunitiesTree(catalogData.communities) || [];
    const activeCatalog = serviceCatalogs[activeCatalogIndex];

    return (
        <div className="min-h-[100vh] bg-white">
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

            </main>
            <Footer/>
        </div>
    );
}
