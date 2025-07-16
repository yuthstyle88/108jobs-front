"use client";
import { StartSellingImage } from "@/constants/images";
import { ProfileApplyLanguage } from "@/types/language";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

type Testimonial = {
  name: string;
  title: string;
  description: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Wanwiset",
    title: "การตลาดและโฆษณา / เสื้อกางเกงวิ่ง",
    description:
      "หากใครยังไม่ได้ทำงานประจำ หรือกำลังหางานอยู่ ลองเอาโอเคซิ เอาความรู้ความสามารถที่มี มาหาราย ได้กับ Fastjob ครับ...",
  },
  {
    name: "Supakorn",
    title: "Web & Programming Ecommerce",
    description:
      "หากใครยังไม่ได้ทำงานประจำ หรือกำลังหางานอยู่ ลองเอาโอเคซิ เอาความรู้ความสามารถที่มี มาหาราย ได้กับ Fastjob ครับ",
  },
  {
    name: "Pakkawan",
    title: "เขียนแบบสถาปัตย์ฯ / เขียนแบบแปลนบ้าน",
    description:
      "ทุกคนมีโอกาสทำสิ่งที่ชอบได้เข้า กล้าลงมือ ลองมาใช้ให้เกิด ประโยชน์สิค่ะ เอาพื้นที่ที่ให้ได้แสดงความสามารถเต็มที่สุดแล้ว และยังได้เครื่องมือการใช้ได้ด้วย...",
  },
  {
    name: "Nicha",
    title: "การตลาดและโฆษณา / โฆษณาสินค้า",
    description:
      "มีงานให้ทำเเละ สามารถเเบ่งเวลางานได้ เเละดูดีในทุกๆงาน ได้เเสดงศักดิ์ศรีว่าร่าง หลายคน มากรางานง่าย เป็นการเปิดโอกาส ให้ตัวออกมา เเละได้สิ่งที่ ไม่ต้อง...",
  },
  {
    name: "parinya",
    title: "บริหารและแปลฯ / จดทะเบียนการค้าบริษัท",
    description:
      "ไม่ต้องกังวลว่าไม่พร้อมที่จะออก ใบเสนอราคา หากใส่ทุกทริค จะ จะมั่น จะดี จะสุขุม มากขึ้นทุกๆ จริงๆ ค่ะ ที่สำคัญมีการระบุเงินใน ระบบเป็นของให้ที่ Happy มากค่ะ",
  },
  {
    name: "parinya",
    title: "บริหารและแปลฯ / จดทะเบียนการค้าบริษัท",
    description:
      "ไม่ต้องกังวลว่าไม่พร้อมที่จะออก ใบเสนอราคา หากใส่ทุกทริค จะ จะมั่น จะดี จะสุขุม มากขึ้นทุกๆ จริงๆ ค่ะ ที่สำคัญมีการระบุเงินใน ระบบเป็นของให้ที่ Happy มากค่ะ",
  },
  {
    name: "parinya",
    title: "บริหารและแปลฯ / จดทะเบียนการค้าบริษัท",
    description:
      "ไม่ต้องกังวลว่าไม่พร้อมที่จะออก ใบเสนอราคา หากใส่ทุกทริค จะ จะมั่น จะดี จะสุขุม มากขึ้นทุกๆ จริงๆ ค่ะ ที่สำคัญมีการระบุเงินใน ระบบเป็นของให้ที่ Happy มากค่ะ",
  },
  {
    name: "parinya",
    title: "บริหารและแปลฯ / จดทะเบียนการค้าบริษัท",
    description:
      "ไม่ต้องกังวลว่าไม่พร้อมที่จะออก ใบเสนอราคา หากใส่ทุกทริค จะ จะมั่น จะดี จะสุขุม มากขึ้นทุกๆ จริงๆ ค่ะ ที่สำคัญมีการระบุเงินใน ระบบเป็นของให้ที่ Happy มากค่ะ",
  },
];
type Props = {
  data: Partial<ProfileApplyLanguage> | null | undefined;
};

const ProfileSelling = ({ data }: Props) => {
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
