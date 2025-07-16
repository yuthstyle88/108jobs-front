"use client";
import { Swiper, SwiperClass, SwiperSlide, useSwiper } from "swiper/react";
import Image from "next/image";
import { useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { JobImage } from "@/types/jobDetail";

const CustomNavigation = ({
  showPrev,
  showNext,
}: {
  showPrev: boolean;
  showNext: boolean;
}) => {
  const swiper = useSwiper();
  return (
    <>
      {showPrev && (
        <button
          className="absolute top-1/2 -translate-y-1/2 left-0 bg-darkOverlay border-1 border-white px-[14px] py-8 rounded-tr-[6px] rounded-br-[6px] cursor-pointer z-50"
          onClick={() => swiper.slidePrev()}
        >
          ❮
        </button>
      )}
      {showNext && (
        <button
          className="absolute top-1/2 -translate-y-1/2 right-0 bg-darkOverlay border-1 border-white px-[14px] py-8 rounded-tl-[6px] rounded-bl-[6px] cursor-pointer z-50"
          onClick={() => swiper.slideNext()}
        >
          ❯
        </button>
      )}
    </>
  );
};

const CustomNavigationBelow = ({
  showPrev,
  showNext,
}: {
  showPrev: boolean;
  showNext: boolean;
}) => {
  const swiper = useSwiper();
  return (
    <>
      {showPrev && (
        <button
          className="absolute top-1/2 -translate-y-1/2 left-0 bg-darkOverlay border-1 border-white px-[6px] py-3 rounded-tr-[6px] rounded-br-[6px] cursor-pointer z-50"
          onClick={() => swiper.slidePrev()}
        >
          ❮
        </button>
      )}
      {showNext && (
        <button
          className="absolute top-1/2 -translate-y-1/2 right-0 bg-darkOverlay border-1 border-white px-[6px] py-3 rounded-tl-[6px] rounded-bl-[6px] cursor-pointer z-50"
          onClick={() => swiper.slideNext()}
        >
          ❯
        </button>
      )}
    </>
  );
};

type Props = {
  images: JobImage[];
};

const SliderJob = ({ images }: Props) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [thumbCanScroll, setThumbCanScroll] = useState(false);

  return (
    <>
      <Swiper
        spaceBetween={10}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2"
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
      >
        <CustomNavigation showPrev={!isBeginning} showNext={!isEnd} />
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
              <Image
                src={image.imageUrl}
                alt={`Image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 840px"
                priority
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="pt-3 relative">
        <Swiper
          onSwiper={(swiper) => {
            setThumbsSwiper(swiper);

            const rawSlidesPerView = swiper.params.slidesPerView;
            const slidesPerView =
              typeof rawSlidesPerView === "number"
                ? rawSlidesPerView
                : parseFloat(String(rawSlidesPerView)) || 0;

            const canScroll = swiper.slides.length > slidesPerView;
            setThumbCanScroll(canScroll);
          }}
          spaceBetween={10}
          slidesPerView={5}
          breakpoints={{
            320: { slidesPerView: 3 },
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="mySwiper pt-4"
        >
          <CustomNavigationBelow
            showPrev={thumbCanScroll}
            showNext={thumbCanScroll}
          />
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
                <Image
                  src={image.imageUrl}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  sizes="100px"
                  priority
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default SliderJob;
