"use client";
import { Swiper, SwiperClass, SwiperSlide, useSwiper } from "swiper/react";

import { JobDetailImage } from "@/constants/images";
import Image from "next/image";
import { useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import {
  FreeMode,
  Navigation,
  Thumbs
} from "swiper/modules";

const CustomNavigation = () => {
    const swiper = useSwiper();
    return (
      <div>
        <button
          className="absolute top-1/2 -translate-y-1/2 left-0 bg-transparent border-1 border-white px-[14px] py-8 border-[none] rounded-tr-[6px] rounded-br-[6px] cursor-pointer z-50"
          onClick={() => swiper.slidePrev()}
        >
          ❮
        </button>
        <button
          className="absolute top-1/2 -translate-y-1/2 right-0 bg-transparent border-1 border-white px-[14px] py-8 border-[none] rounded-tl-[6px] rounded-bl-[6px] cursor-pointer z-50"
          onClick={() => swiper.slideNext()}
        >
          ❯
        </button>
      </div>
    );
  };
  const CustomNavigationBelow = () => {
    const swiper = useSwiper();
    return (
      <div>
        <button
          className="absolute top-1/2 -translate-y-1/2 left-0 bg-transparent border-1 border-white px-[6px] py-3 border-[none] rounded-tr-[6px] rounded-br-[6px] cursor-pointer z-50"
          onClick={() => swiper.slidePrev()}
        >
          ❮
        </button>
        <button
          className="absolute top-1/2 -translate-y-1/2 right-0 bg-transparent border-1 border-white px-[6px] py-3 border-[none] rounded-tl-[6px] rounded-bl-[6px] cursor-pointer z-50"
          onClick={() => swiper.slideNext()}
        >
          ❯
        </button>
      </div>
    );
  };

const SliderJob = () => {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  return (
    <>
    <Swiper
              spaceBetween={10}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              thumbs={{ swiper: thumbsSwiper }}
              modules={[FreeMode, Navigation, Thumbs]}
              className="mySwiper2"
            >
              <CustomNavigation />
              <SwiperSlide>
                <Image
                  src={JobDetailImage.job_detail1}
                  alt="Picture 1"
                  className="w-full rounded-lg"
                />
              </SwiperSlide>
              <SwiperSlide>
                <Image
                  src={JobDetailImage.job_detail2}
                  alt="Picture 1"
                  className="w-full rounded-lg"
                />
              </SwiperSlide>
              <SwiperSlide>
                <Image
                  src={JobDetailImage.job_detail3}
                  alt="Picture 1"
                  className="w-full rounded-lg"
                />
              </SwiperSlide>
              <SwiperSlide>
                <Image
                  src={JobDetailImage.job_detail4}
                  alt="Picture 1"
                  className="w-full rounded-lg"
                />
              </SwiperSlide>
              <SwiperSlide>
                <Image
                  src={JobDetailImage.job_detail5}
                  alt="Picture 1"
                  className="w-full rounded-lg"
                />
              </SwiperSlide>
              <SwiperSlide>
                <Image
                  src={JobDetailImage.job_detail1}
                  alt="Picture 1"
                  className="w-full rounded-lg"
                />
              </SwiperSlide>
              <SwiperSlide>
                <Image
                  src={JobDetailImage.job_detail2}
                  alt="Picture 1"
                  className="w-full rounded-lg"
                />
              </SwiperSlide>
            </Swiper>
            <div className="pt-3">
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={5}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper pt-4"
              >
                <CustomNavigationBelow />
                <SwiperSlide>
                  <Image
                    src={JobDetailImage.job_detail1}
                    alt="Picture 1"
                    className="w-full rounded-lg"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <Image
                    src={JobDetailImage.job_detail2}
                    alt="Picture 1"
                    className="w-full rounded-lg"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <Image
                    src={JobDetailImage.job_detail3}
                    alt="Picture 1"
                    className="w-full rounded-lg"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <Image
                    src={JobDetailImage.job_detail4}
                    alt="Picture 1"
                    className="w-full rounded-lg"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <Image
                    src={JobDetailImage.job_detail5}
                    alt="Picture 1"
                    className="w-full rounded-lg"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <Image
                    src={JobDetailImage.job_detail1}
                    alt="Picture 1"
                    className="w-full rounded-lg"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <Image
                    src={JobDetailImage.job_detail2}
                    alt="Picture 1"
                    className="w-full rounded-lg"
                  />
                </SwiperSlide>
              </Swiper>
            </div>
            </>
  )
}

export default SliderJob