"use client";
import Image from "next/image";

import { Swiper, SwiperSlide, useSwiper } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../app/styles.css";

import {
  Keyboard,
  Mousewheel,
  Navigation,
  Pagination,
  Autoplay,
} from "swiper/modules";

import { LandingImage } from "@/constants/images";

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

const SpAdsSlider = () => {
  return (
    <section className="pb-0 pt-12 md:mt-16 md:pb-16 grid grid-container-desktop-banner gap-y-12">
      <div className="col-span-1"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 lg:gap-y-0 lg:grid-cols-3 gap-x-5 w-full">
        <div className="col-span-1 lg:col-span-2">
          <Swiper
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            pagination={true}
            mousewheel={true}
            keyboard={true}
            modules={[Navigation, Pagination, Mousewheel, Keyboard, Autoplay]}
            className="mySwiper"
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: true,
              pauseOnMouseEnter: true,
            }}
          >
            <CustomNavigation />
            <SwiperSlide>
              <Image
                src={LandingImage.slider2}
                alt="Picture 1"
                className="rounded-lg"
              />
            </SwiperSlide>
            <SwiperSlide>
              <Image
                src={LandingImage.slider1}
                alt="Picture 2"
                className="rounded-lg"
              />
            </SwiperSlide>
            <SwiperSlide>
              <Image
                src={LandingImage.slider3}
                alt="Picture 3"
                className="rounded-lg"
              />
            </SwiperSlide>
            <SwiperSlide>
              <Image
                src={LandingImage.slider4}
                alt="Picture 4"
                className="rounded-lg"
              />
            </SwiperSlide>
            <SwiperSlide>
              <Image
                src={LandingImage.slider5}
                alt="Picture 5"
                className="rounded-lg"
              />
            </SwiperSlide>
            <SwiperSlide>
              <Image
                src={LandingImage.slider6}
                alt="Picture 6"
                className="rounded-lg"
              />
            </SwiperSlide>
            <SwiperSlide>
              <Image
                src={LandingImage.slider7}
                alt="Picture 7"
                className="rounded-lg"
              />
            </SwiperSlide>
          </Swiper>
        </div>
        <div className="col-span-1 hidden sm:block">
          <div className="grid grid-cols-1 gap-y-6">
            <Image
              src={LandingImage.award_bg}
              alt="Picture 1"
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpAdsSlider;
