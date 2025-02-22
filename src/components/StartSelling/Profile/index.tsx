"use client";
import { StartSellingImage } from "@/constants/images";
import React from "react";
import { Swiper, SwiperClass, SwiperSlide, useSwiper } from "swiper/react";
import { JobDetailImage } from "@/constants/images";
import Image from "next/image";
import { useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

type Testimonial = {
  name: string;
  title: string;
  image: string;
  description: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Wanwiset",
    title: "การตลาดและโฆษณา / เสื้อกางเกงวิ่ง",
    image: "/lovable-uploads/571c1e34-1ce2-4367-b242-17104d88f87a.png",
    description:
      "บุชเป็น Freelance อยู่ต่างจังหวัด โอกาสเข้าถึงลูกค้าค่อนข้างน้อย เป็นคนที่ชอบทำสิ่งเดิมซ้ำๆแต่มีโอกาสใน Fastwork ได้สนใจเรื่องของ เหราะเหค ความสำเร็จที่ควรมีผลตลอดชีวิต...",
  },
  {
    name: "Supakorn",
    title: "Web & Programming Ecommerce",
    image: "/lovable-uploads/571c1e34-1ce2-4367-b242-17104d88f87a.png",
    description:
      "หากใครยังไม่ได้ทำงานประจำ หรือกำลังหางานอยู่ ลองเอาโอเคซิ เอาความรู้ความสามารถที่มี มาหาราย ได้กับ Fastwork ครับ",
  },
  {
    name: "Pakkawan",
    title: "เขียนแบบสถาปัตย์ฯ / เขียนแบบแปลนบ้าน",
    image: "/lovable-uploads/571c1e34-1ce2-4367-b242-17104d88f87a.png",
    description:
      "ทุกคนมีโอกาสทำสิ่งที่ชอบได้เข้า กล้าลงมือ ลองมาใช้ให้เกิด ประโยชน์สิค่ะ เอาพื้นที่ที่ให้ได้แสดงความสามารถเต็มที่สุดแล้ว และยังได้เครื่องมือการใช้ได้ด้วย...",
  },
  {
    name: "Nicha",
    title: "การตลาดและโฆษณา / โฆษณาสินค้า",
    image: "/lovable-uploads/571c1e34-1ce2-4367-b242-17104d88f87a.png",
    description:
      "มีงานให้ทำเเละ สามารถเเบ่งเวลางานได้ เเละดูดีในทุกๆงาน ได้เเสดงศักดิ์ศรีว่าร่าง หลายคน มากรางานง่าย เป็นการเปิดโอกาส ให้ตัวออกมา เเละได้สิ่งที่ ไม่ต้อง...",
  },
  {
    name: "parinya",
    title: "บริหารและแปลฯ / จดทะเบียนการค้าบริษัท",
    image: "/lovable-uploads/571c1e34-1ce2-4367-b242-17104d88f87a.png",
    description:
      "ไม่ต้องกังวลว่าไม่พร้อมที่จะออก ใบเสนอราคา หากใส่ทุกทริค จะ จะมั่น จะดี จะสุขุม มากขึ้นทุกๆ จริงๆ ค่ะ ที่สำคัญมีการระบุเงินใน ระบบเป็นของให้ที่ Happy มากค่ะ",
  },
  {
    name: "parinya",
    title: "บริหารและแปลฯ / จดทะเบียนการค้าบริษัท",
    image: "/lovable-uploads/571c1e34-1ce2-4367-b242-17104d88f87a.png",
    description:
      "ไม่ต้องกังวลว่าไม่พร้อมที่จะออก ใบเสนอราคา หากใส่ทุกทริค จะ จะมั่น จะดี จะสุขุม มากขึ้นทุกๆ จริงๆ ค่ะ ที่สำคัญมีการระบุเงินใน ระบบเป็นของให้ที่ Happy มากค่ะ",
  },
  {
    name: "parinya",
    title: "บริหารและแปลฯ / จดทะเบียนการค้าบริษัท",
    image: "/lovable-uploads/571c1e34-1ce2-4367-b242-17104d88f87a.png",
    description:
      "ไม่ต้องกังวลว่าไม่พร้อมที่จะออก ใบเสนอราคา หากใส่ทุกทริค จะ จะมั่น จะดี จะสุขุม มากขึ้นทุกๆ จริงๆ ค่ะ ที่สำคัญมีการระบุเงินใน ระบบเป็นของให้ที่ Happy มากค่ะ",
  },
  {
    name: "parinya",
    title: "บริหารและแปลฯ / จดทะเบียนการค้าบริษัท",
    image: "/lovable-uploads/571c1e34-1ce2-4367-b242-17104d88f87a.png",
    description:
      "ไม่ต้องกังวลว่าไม่พร้อมที่จะออก ใบเสนอราคา หากใส่ทุกทริค จะ จะมั่น จะดี จะสุขุม มากขึ้นทุกๆ จริงๆ ค่ะ ที่สำคัญมีการระบุเงินใน ระบบเป็นของให้ที่ Happy มากค่ะ",
  },
];

const ProfileSelling = () => {
  return (
    <div className="mt-12">
      <div className="header-gradient h-[300px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-white pt-12">
          ทำไมฟรีแลนซ์ถึงเลือก Fastwork
        </h2>
      </div>
        <div className=" mt-[-4rem] mx-6">
          <div className="flex gap-6 pb-6">
            <Swiper
              spaceBetween={10}
              slidesPerView={5}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation, Thumbs]}
              className="mySwiper pt-4"
            >
              {testimonials.map((testimonial, index) => (
                <SwiperSlide>
                  <div
                    key={index}
                    className="min-w-[300px] bg-white rounded-lg p-6 shadow-lg "
                  >
                    <div className="flex items-start space-x-4 mb-4">
                      <Image
                        src={StartSellingImage.profile_selling}
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
