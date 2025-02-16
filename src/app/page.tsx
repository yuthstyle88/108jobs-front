"use client";
import { Metadata } from "next";
import Image from "next/image";
import Footer from "../components/Footer";
import Header from "@/components/Header";
import { AssetIcon, CategoriesIcon } from "@/constants/icons";
import { TypeAnimation } from "react-type-animation";
import TypingText from "@/components/TypingText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faChevronLeft,
  faChevronRight,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { AssetsImage, CategoriesImage } from "@/constants/images";
import { title } from "process";

const categories = [
  {
    icon: CategoriesIcon.industry,
    title: "ประเภทงานยอดนิยม",
  },
  {
    icon: CategoriesIcon.graphic,
    title: "ออกแบบกราฟิก",
  },
  {
    icon: CategoriesIcon.architect,
    title: "สถาปัตย์และวิศวกรรม",
  },
  {
    icon: CategoriesIcon.programming,
    title: "เว็บไซต์และเทคโนโลยี",
  },
  {
    icon: CategoriesIcon.marketing,
    title: "การตลาดและโฆษณา",
  },
  {
    icon: CategoriesIcon.writing,
    title: "เขียนและแปลภาษา",
  },
  {
    icon: CategoriesIcon.video,
    title: "ภาพและเสียง",
  },
  {
    icon: CategoriesIcon.consultant,
    title: "ธุรกิจและที่ปรึกษา",
  },
  {
    icon: CategoriesIcon.lifestyle,
    title: "ไลฟ์สไตล์",
  },
];

const category_images = [
  {
    image: CategoriesImage.seo_image,
    title: "ทำ SEO",
  },
  {
    image: CategoriesImage.seo_image,
    title: "ทำ SEO",
  },
  {
    image: CategoriesImage.seo_image,
    title: "ทำ SEO",
  },
  {
    image: CategoriesImage.seo_image,
    title: "ทำ SEO",
  },
  {
    image: CategoriesImage.seo_image,
    title: "ทำ SEO",
  },
  {
    image: CategoriesImage.seo_image,
    title: "ทำ SEO",
  },
  {
    image: CategoriesImage.seo_image,
    title: "ทำ SEO",
  },
  {
    image: CategoriesImage.seo_image,
    title: "ทำ SEO",
  },
];

const freelancer_intro = [
  {
    icon: AssetsImage.group,
    title: "ฟรีแลนซ์คุณภาพอันดับ 1",
    description:
      "ฟรีแลนซ์ผ่านการคัดเลือก และยืนยันตัวตน กับ Fastwork สามารถตรวจสอบได้",
  },
  {
    icon: AssetsImage.shield,
    title: "รับประกันการจ้างงาน",
    description:
      "เงินของคุณจะได้รับความคุ้มครองตั้งแต่ฟรีแลนซ์เริ่มทํางานไปจนถึงได้รับงานที่พอใจ",
  },
  {
    icon: AssetsImage.paper,
    title: "ครบทุกงานที่ต้องการ มั่นใจ เลือก Fastwork",
    description:
      "พบกับกองทัพฟรีแลนซ์คุณภาพ พร้อมตอบโจทย์ทุกธุรกิจ ครอบคลุมทุกสายงาน",
  },
];

export default function Home() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  return (
    <div className="min-h-[200vh] bg-white">
      <Header />
      <main>
        <section className="h-auto header-gradient pt-[4.5rem]">
          <div className="pt-[3rem] pb-[8rem] flex justify-center flex-col gap-4 text-center">
            <h1 className="text-[24px] font-medium text-white">
              เรามีฟรีแลนซ์มืออาชีพด้าน...
            </h1>
            <TypingText />
            <p className="text-[18px] font-medium">
              ที่พร้อมเปลี่ยนไอเดียของคุณให้เป็นความจริง
            </p>
            <div className="mt-[1.5rem] flex justify-center">
              <div className="flex text-black h-[40px] relative w-[624px]">
                <input
                  type="text"
                  placeholder="ค้นหาฟรีแลนซ์..."
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
        <section>
          <div className="grid-container-desktop w-full ">
            <div className="min-h-[144px] mt-[-4rem] px-8 rounded-lg bg-white shadow-panel col-start-2 col-end-3">
              <div className="flex items-center justify-between">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className={`group relative flex justify-center w-[9rem] h-[9rem] pt-4 px-2 rounded-lg cursor-pointer after:absolute after:bottom-2 after:block after:w-[80%] after:h-1 after:rounded-full after:bg-primary after:origin-center after:transition-all after:ease-[var(--timing-faster)] ${
                      activeIndex === index
                        ? "after:scale-100"
                        : "after:scale-0"
                    }`}
                    onClick={() => setActiveIndex(index)}
                  >
                    <div className="flex flex-col items-center gap-y-[0.75rem] text-center">
                      <div
                        className={`${
                          activeIndex === index
                            ? "before:opacity-100 before:translate-y-[5px]"
                            : ""
                        } relative transform before:absolute before:opacity-0 before:bottom-[calc(56px*0.2*-1+8px)] before:left-0 before:right-0 before:mx-auto before:w-[calc(56px*0.8)] before:h-[calc(56px*0.2)] before:bg-secondary before:rounded-[50%] before:transition-all before:ease-in-out before:[backface-visibility:hidden] group-hover:before:opacity-100 group-hover:before:translate-y-[5px]`}
                      >
                        <Image
                          src={category.icon}
                          alt="Consultant"
                          width={56}
                          className={`group-hover:translate-y-[-4px] duration-150 group-hover:grayscale-0 ${
                            activeIndex === index
                              ? "grayscale-0 translate-y-[-4px]"
                              : "grayscale-[1]"
                          }`}
                        />
                      </div>
                      <p className="text-base font-medium text-text_primary leading-[18.4px]">
                        {category.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 ">
                <div className="grid min-h-0 min-w-0 grid-cols-[1fr_1fr_1fr_1fr] gap-[0.75rem] ">
                  {category_images.map((category, index) => (
                    <a key={index} href="#" className="group">
                      <div
                        style={{
                          backgroundImage: `url("/categories-image/web-development-02032022.jpg")`,
                        }}
                        className="relative rounded-md overflow-hidden bg-cover bg-center transition-all ease-[120ms] cursor-pointer"
                      >
                        <div className="relative flex items-end h-20 px-4 py-3 text-white bg-[rgba(0,0,0,.5)] font-semibold">
                          <span className="group-hover:translate-y-[-4px] duration-150">
                            ทำ SEO
                          </span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
                <div className="my-4 flex justify-end">
                  <a
                    href="#"
                    className="text-primary py-[0.75rem] relative no-underline cursor-pointer outline-none ease-in-out duration-150 transition-all"
                  >
                    ดูเพิ่มเติม
                    <FontAwesomeIcon icon={faArrowRight} className="pl-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-24 grid grid-container-desktop gap-y-12 ">
          <div className="col-start-2 col-end-3">
            <h4 className="text-[1.5rem] text-[#38404c] font-medium leading-[1.15]">
              ทำไมถึงต้องใช้ Fastwork?
            </h4>
            <h2 className="home-title-head">
              เพราะเราเปลี่ยนไอเดียของคุณให้เป็นความจริง ด้วยฟรีแลนซ์มืออาชีพ
            </h2>
          </div>
          <div className="grid grid-cols-[1fr_1fr_1fr] gap-x-[1.5rem] min-h-0 min-w-0 col-start-2 col-end-3">
            {freelancer_intro.map((freelancer, index) => (
              <div key={index} className="">
                <Image
                  src={freelancer.icon}
                  alt="Group of people"
                  width={62}
                  className="max-w-full h-auto align-top"
                />
                <div className="grid grid-cols-[1fr] mt-4 gap-y-1 text-text_primary font-medium">
                  <h5 className="text-[1.25rem]  leading-[1.15]">
                    {freelancer.title}
                  </h5>
                  <p className="m-0 text-base font-serif leading-[1.65] ">
                    {freelancer.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

// export const metadata: Metadata = {
//   title:
//     "Fastlance.vn - Tổng hợp freelancer chất lượng hàng đầu cho doanh nghiệp ",
//   description:
//     "Nền tảng freelancer chất lượng cao cho doanh nghiệp tại Việt Nam.",
// };
