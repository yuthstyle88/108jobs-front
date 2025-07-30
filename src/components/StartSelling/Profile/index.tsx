"use client";
import { StartSellingImage } from "@/constants/images";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { getNamespace } from "@/utils/i18nHelper";
import { LanguageFile } from "@/constants/language";

type Testimonial = {
  name: string;
  title: string;
  description: string;
};

// Create testimonials array from translations
const createTestimonialsFromTranslations = () => {
  const seller = getNamespace(LanguageFile.SELLER_OVERVIEW);
  
  return [
    {
      name: seller.seller_testimonial_1_name,
      title: seller.seller_testimonial_1_title,
      description: seller.seller_testimonial_1_description,
    },
    {
      name: seller.seller_testimonial_2_name,
      title: seller.seller_testimonial_2_title,
      description: seller.seller_testimonial_2_description,
    },
    {
      name: seller.seller_testimonial_3_name,
      title: seller.seller_testimonial_3_title,
      description: seller.seller_testimonial_3_description,
    },
    {
      name: seller.seller_testimonial_4_name,
      title: seller.seller_testimonial_4_title,
      description: seller.seller_testimonial_4_description,
    },
    {
      name: seller.seller_testimonial_5_name,
      title: seller.seller_testimonial_5_title,
      description: seller.seller_testimonial_5_description,
    },
    // Repeat the last testimonial to maintain the same number of items
    {
      name: seller.seller_testimonial_5_name,
      title: seller.seller_testimonial_5_title,
      description: seller.seller_testimonial_5_description,
    },
    {
      name: seller.seller_testimonial_5_name,
      title: seller.seller_testimonial_5_title,
      description: seller.seller_testimonial_5_description,
    },
    {
      name: seller.seller_testimonial_5_name,
      title: seller.seller_testimonial_5_title,
      description: seller.seller_testimonial_5_description,
    },
  ];
};
type Props = {
  data: Record<string, string>;
};

const ProfileSelling = ({ data }: Props) => {
  // Get testimonials from translations
  const testimonials = createTestimonialsFromTranslations();
  
  return (
    <div className="mt-12">
      <div className="header-gradient h-[300px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-white pt-12">
          {data?.whyChooseTitle}
        </h2>
      </div>
      <div className=" mt-[-4rem] mx-6">
        <div className="flex gap-6 pb-6">
          <Swiper
            spaceBetween={10}
            slidesPerView={5}
            freeMode={true}
            watchSlidesProgress={true}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 10 },
              1024: { slidesPerView: 5, spaceBetween: 20 },
            }}
            modules={[FreeMode, Navigation, Thumbs]}
            className="mySwiper pt-4"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className="min-w-[300px] bg-white rounded-lg p-6 shadow-lg ">
                  <div className="flex items-start space-x-4 mb-4">
                    <Image
                      src={StartSellingImage.profileSelling}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {testimonial.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm flex-grow">
                    {testimonial.description}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default ProfileSelling;
