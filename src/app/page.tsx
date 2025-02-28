"use client";
import apple from "@/assets/icons/apple.svg";
import google from "@/assets/icons/google-play.svg";
import fastwork from "@/assets/images/fastwork-app-qr.webp";
import imgapp from "@/assets/images/img-app.webp";
import Header from "@/components/Header";
import TypingText from "@/components/TypingText";
import { CategoriesIcon, GroupIcon } from "@/constants/icons";
import { faArrowRight, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Footer from "../components/Footer";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./styles.css";

import { Keyboard, Mousewheel, Navigation, Pagination } from "swiper/modules";

import {
  AssetsImage,
  CategoriesImage,
  CompareImage,
  CustomerImage,
} from "@/constants/images";
import Link from "next/link";
import { useState } from "react";

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
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="min-h-[200vh] bg-white">
      <Header type="transparent" />
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
                    <Link key={index} href="/seo" className="group">
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
                    </Link>
                  ))}
                </div>
                <div className="my-4 flex justify-end">
                  <Link
                    href="/popular-subcat"
                    className="text-primary py-[0.75rem] relative no-underline cursor-pointer outline-none ease-in-out duration-150 transition-all"
                  >
                    ดูเพิ่มเติม
                    <FontAwesomeIcon icon={faArrowRight} className="pl-1" />
                  </Link>
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
                  <p className="m-0 text-base font-sans leading-[1.65] ">
                    {freelancer.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="hidden md:block">
          <div className="py-24 grid grid-container-desktop gap-y-12 ">
            <div className="col-start-2 col-end-3">
              <h2 className="home-title-head">
                เริ่มจ้างงานฟรีแลนซ์ง่ายๆ กับ Fastwork
              </h2>
            </div>
            <div className="grid grid-cols-[1fr_1fr_1fr] gap-x-[1.5rem] min-h-0 min-w-0 col-start-2 col-end-3">
              <div className="grid grid-rows-2 gap-y-6 text-text_primary font-medium">
                <div className="flex flex-col">
                  <div className="flex justify-start items-center gap-x-5 ">
                    <Image src={GroupIcon.group11651} alt="group1" />
                    <div className="grid grid-rows-2 gap-y-4">
                      <h1 className="text-[1.25rem]  leading-[1.15]">
                        1. ค้นหาฟรีแลนซ์ที่ถูกใจ
                      </h1>
                      <p className="m-0 text-base font-sans leading-[1.65] ">
                        {" "}
                        พิจารณาจากผลงาน ความสามารถ และรีวิว
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-start items-center gap-x-5">
                    <Image src={GroupIcon.group11653} alt="group3" />
                    <div className="grid grid-rows-2 gap-y-2">
                      <h1 className="text-[1.25rem]  leading-[1.15]">
                        3. ชำระเงินผ่าน Fastwork
                      </h1>
                      <p className="m-0 text-base font-sans leading-[1.65] ">
                        Fastwork Guarantee ได้งานแน่นอน
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-rows-2 gap-y-6 text-text_primary font-medium">
                <div className="flex justify-start items-center gap-x-5">
                  <Image src={GroupIcon.group11652} alt="group2" />
                  <div className="grid grid-rows-2 gap-y-2">
                    <h1 className="text-[1.25rem]  leading-[1.15]">
                      2. พูดคุยรายละเอียด
                    </h1>
                    <p className="m-0 text-base font-sans leading-[1.65] ">
                      อธิบายงานเพื่อให้ฟรีแลนซ์สร้างใบเสนอราคา
                    </p>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-start items-center gap-x-5">
                    <Image src={GroupIcon.group11654} alt="group4" />
                    <div className="grid grid-rows-2 gap-y-2">
                      <h1 className="text-[1.25rem]  leading-[1.15]">
                        4. อนุมัติงานและรีวิว
                      </h1>
                      <p className="m-0 text-base font-sans leading-[1.65] ">
                        ตรวจสอบงานที่ได้รับ อนุมัติ และรีวิวงาน
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Image src={fastwork} alt="fastwork" className="items-end" />
                Video here
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 grid grid-container-desktop gap-y-12 ">
          <div className="col-span-1"></div>
          <div className="grid grid-cols-3 gap-x-5">
            <div className="col-span-2">
              <Swiper
                cssMode={true}
                navigation={true}
                pagination={true}
                mousewheel={true}
                keyboard={true}
                modules={[Navigation, Pagination, Mousewheel, Keyboard]}
                className="mySwiper"
              >
                <SwiperSlide>
                  <Image src={imgapp} alt="Picture 1" />
                </SwiperSlide>
                <SwiperSlide>
                  <Image src={imgapp} alt="Picture 2" />
                </SwiperSlide>
                <SwiperSlide>
                  <Image src={imgapp} alt="Picture 3" />
                </SwiperSlide>
                <SwiperSlide>
                  <Image src={imgapp} alt="Picture 4" />
                </SwiperSlide>
                <SwiperSlide>
                  <Image src={imgapp} alt="Picture 5" />
                </SwiperSlide>
              </Swiper>
            </div>
            <div className="col-span-1">
              <div className="grid grid-cols-1 gap-y-6">
                <Image src={imgapp} alt="Picture 1" />
                <Image src={imgapp} alt="Picture 2" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 grid grid-container-desktop gap-y-12 gap-x-4">
          <div className="col-start-2 col-end-3">
            <h2 className="home-title-head">สิ่งที่น่าสนใจ </h2>
            <Swiper
              slidesPerView={3}
              cssMode={true}
              navigation={true}
              mousewheel={true}
              keyboard={true}
              modules={[Navigation]}
              className="mySwiper px-5"
            >
              <SwiperSlide>
                <Image src={imgapp} alt="Picture 1" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={imgapp} alt="Picture 2" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={imgapp} alt="Picture 3" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={imgapp} alt="Picture 4" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={imgapp} alt="Picture 5" />
              </SwiperSlide>
            </Swiper>
          </div>
          <div></div>
        </section>
        <section
          className="bg-gradient-to-t py-24 grid grid-container-desktop gap-y-12 gap-x-4"
          style={{
            background: "linear-gradient(to top, hsl(216 85% 94%), #fff)",
          }}
        >
          <div className="col-start-2 col-end-3">
            <h2 className="home-title-head text-center">
              เรามีฟรีแลนซ์คุณภาพ และผู้เชี่ยวชาญที่หลากหลายในระบบคอยให้บริการ
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-x-[1.5rem] min-h-0 min-w-0 col-start-2 col-end-3 ">
            <div className="flex flex-col justify-between items-center text-center bg-white p-6 rounded-lg shadow-md gap-6">
              <div className="y-2 px-4 rounded-full shadow-md self-end mx-4"></div>
              {/* <img
                src="your-freelancer-icon-url"
                alt="Freelancer"
                className="mb-4 w-16 h-16"
              /> */}
              <Image src={CompareImage.compare1} alt="Freelancer" />
              <div className="text-black">
                <h3 className="font-semibold text-xl mb-2">Freelancer</h3>
                <ul className="text-sm text-left">
                  <li className="flex items-center">
                    ผ่านการยืนยันตัวตนในระบบ{" "}
                  </li>
                  <li className="flex items-center">
                    ผ่านการตรวจสอบผลงาน ตามมาตรฐานขั้นต้นของ Fastwork{" "}
                  </li>
                </ul>
              </div>
              <a
                href="#"
                className="mt-4 text-blue-500 hover:text-blue-700 font-semibold text-sm cursor-pointer"
              >
                ดูงานทั้งหมด
              </a>
            </div>

            <div className="justify-between flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-md gap-6">
              <button className=" pointer-events-none bg-blue-200 text-blue-500 font-semibold py-2 px-4 rounded-full shadow-md hover:bg-blue-400 self-end mx-4">
                ผู้เชี่ยวชาญ
              </button>
              <Image src={CompareImage.compare2} alt="Specialist" />

              {/* <img
                src="your-specialist-icon-url"
                alt="Specialist"
                className="mb-4 w-16 h-16"
              /> */}
              <div className="text-black">
                <h3 className="font-semibold text-xl mb-2  mx-4">
                  ผู้เชี่ยวชาญ
                </h3>
                <ul className="text-sm text-left">
                  <li className="flex items-center">
                    ผ่านการยืนยันตัวตนในระบบ{" "}
                  </li>
                  <li className="flex items-center">
                    ผ่านการคัดเลือก ทดสอบความรู้ตามสายงาน และทักษะในการทำงานโดย
                    Fastwork
                  </li>{" "}
                  <li className="flex items-center">
                    {" "}
                    ผ่านการอบรมพิเศษด้านทักษะและการให้บริการจาก Fastwork
                  </li>{" "}
                  <li className="flex items-center">
                    {" "}
                    มีใบประกอบวิชาชีพที่จำเป็นตามสายงาน Fastwork
                  </li>
                </ul>
              </div>
              <a
                href="#"
                className="mt-4 text-blue-500 hover:text-blue-700 font-semibold text-sm cursor-pointer"
              >
                ดูงานทั้งหมด
              </a>
            </div>

            <div className="justify-between flex flex-col items-center text-center gap-6 bg-white p-6 rounded-lg shadow-md">
              <button className=" pointer-events-none bg-blue-500 text-blue-2  00 font-semibold py-2 px-4 rounded-full shadow-md hover:bg-blue-400 self-end mx-4">
                ผู้เชี่ยวชาญ
              </button>
              <Image src={CompareImage.compare3} alt="Professional" />
              <div className="text-black">
                <h3 className="font-semibold text-xl mb-2">Professional</h3>
                <ul className="text-sm text-left">
                  <li className="flex items-center">
                    ผ่านการยืนยันตัวตนในระบบ
                  </li>
                  <li className="flex items-center">
                    ผ่านการคัดเลือก ทดสอบความรู้ตามสายงาน และทักษะในการทำงานโดย
                    Fastwork
                  </li>
                  <li className="flex items-center">
                    ผ่านการอบรมพิเศษด้านทักษะและการให้บริการจาก Fastwork
                  </li>
                  <li className="flex items-center">
                    มีใบประกอบวิชาชีพที่จำเป็นตามสายงาน
                  </li>
                  <li className="flex items-center">
                    คัดกรองความเชี่ยวชาญขั้นสูงด้วยเกณฑ์พิเศษ
                  </li>{" "}
                  <li className="flex items-center">
                    มีความสามารถทำงานที่ซับซ้อนสูง และมีขนาดใหญ่
                  </li>
                </ul>
              </div>
              <a
                href="#"
                className="mt-4 text-blue-500 hover:text-blue-700 font-semibold text-sm cursor-pointer"
              >
                ดูงานทั้งหมด
              </a>
            </div>
          </div>
          <div className="col-start-2 col-end-3"></div>
        </section>

        <section className="bg-white py-24 grid grid-container-desktop gap-y-12">
          <div className="col-start-2 col-end-3 text-[rgb(8,67,155)] font-[500] text-[36px] leading-[41.4px]">
            ฟรีแลนซ์ยอดนิยมในหมวด รับจัดดอกไม้
          </div>
          <div className="col-start-2 col-end-3">
            <Swiper
              slidesPerView={5}
              cssMode={true}
              navigation={true}
              mousewheel={true}
              keyboard={true}
              modules={[Navigation]}
              className="mySwiper px-5"
            >
              <SwiperSlide>
                <Image src={imgapp} alt="Picture 1" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={imgapp} alt="Picture 2" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={imgapp} alt="Picture 3" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={imgapp} alt="Picture 4" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={imgapp} alt="Picture 5" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={imgapp} alt="Picture 6" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={imgapp} alt="Picture 7" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={imgapp} alt="Picture 8" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={imgapp} alt="Picture 9" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={imgapp} alt="Picture 10" />
              </SwiperSlide>
            </Swiper>
          </div>
        </section>

        <section className="bg-white py-24 grid grid-container-desktop gap-y-12">
          <div className="col-start-2 col-end-3 text-[rgb(8,67,155)] font-[500] text-[36px] leading-[41.4px]">
            ฟรีแลนซ์ยอดนิยมในหมวด ดูดวง โหราศาสตร์ ความเชื่อ{" "}
          </div>
          <div className="col-start-2 col-end-3">
            <Swiper
              slidesPerView={5}
              cssMode={true}
              navigation={true}
              mousewheel={true}
              keyboard={true}
              modules={[Navigation]}
              className="mySwiper px-5"
            >
              <SwiperSlide>
                <Image src={imgapp} alt="Picture 1" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={imgapp} alt="Picture 2" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={imgapp} alt="Picture 3" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={imgapp} alt="Picture 4" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={imgapp} alt="Picture 5" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={imgapp} alt="Picture 6" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={imgapp} alt="Picture 7" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={imgapp} alt="Picture 8" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={imgapp} alt="Picture 9" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={imgapp} alt="Picture 10" />
              </SwiperSlide>
            </Swiper>
          </div>
        </section>

        <section className="bg-white py-24 grid grid-container-desktop gap-y-12">
          <div className="col-start-2 col-end-3 text-[rgb(8,67,155)] font-[500] text-[36px] leading-[41.4px]">
            ฟรีแลนซ์ยอดนิยมในหมวด ออกแบบ Logo
          </div>
          <div className="col-start-2 col-end-3">
            <Swiper
              slidesPerView={5}
              cssMode={true}
              navigation={true}
              mousewheel={true}
              keyboard={true}
              modules={[Navigation]}
              className="mySwiper px-5"
            >
              <SwiperSlide>
                <Image src={imgapp} alt="Picture 1" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={imgapp} alt="Picture 2" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={imgapp} alt="Picture 3" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={imgapp} alt="Picture 4" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={imgapp} alt="Picture 5" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={imgapp} alt="Picture 6" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={imgapp} alt="Picture 7" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={imgapp} alt="Picture 8" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={imgapp} alt="Picture 9" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={imgapp} alt="Picture 10" />
              </SwiperSlide>
            </Swiper>
          </div>
        </section>

        <section className="bg-white py-24 grid grid-container-desktop gap-y-12">
          <div className="col-start-2 col-end-3 text-[rgb(8,67,155)] font-[500] text-[36px] leading-[41.4px]">
            ผลงานแนะนำจากฟรีแลนซ์ Fastwork
          </div>
          <div className="col-start-2 col-end-3">
            <Swiper
              slidesPerView={3}
              cssMode={true}
              navigation={true}
              mousewheel={true}
              keyboard={true}
              modules={[Navigation]}
              className="mySwiper px-5"
            >
              <SwiperSlide>
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <Image
                    src="/path-to-hotel-image.jpg"
                    alt="Hotel Image"
                    width={400}
                    height={200}
                    className="rounded-lg"
                  />
                  <h3 className="text-lg font-semibold mt-2">Plaza Hotel</h3>
                  <p className="text-gray-500 text-sm">Bangkok, Thailand</p>
                  <p className="text-red-500 font-semibold mt-2">
                    $200 / night
                  </p>
                </div>{" "}
              </SwiperSlide>
              <SwiperSlide>
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <Image
                    src="/path-to-hotel-image.jpg"
                    alt="Hotel Image"
                    width={400}
                    height={200}
                    className="rounded-lg"
                  />
                  <h3 className="text-lg font-semibold mt-2">Plaza Hotel</h3>
                  <p className="text-gray-500 text-sm">Bangkok, Thailand</p>
                  <p className="text-red-500 font-semibold mt-2">
                    $200 / night
                  </p>
                </div>{" "}
              </SwiperSlide>
              <SwiperSlide>
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <Image
                    src="/path-to-hotel-image.jpg"
                    alt="Hotel Image"
                    width={400}
                    height={200}
                    className="rounded-lg"
                  />
                  <h3 className="text-lg font-semibold mt-2">Plaza Hotel</h3>
                  <p className="text-gray-500 text-sm">Bangkok, Thailand</p>
                  <p className="text-red-500 font-semibold mt-2">
                    $200 / night
                  </p>
                </div>{" "}
              </SwiperSlide>
              <SwiperSlide>
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <Image
                    src="/path-to-hotel-image.jpg"
                    alt="Hotel Image"
                    width={400}
                    height={200}
                    className="rounded-lg"
                  />
                  <h3 className="text-lg font-semibold mt-2">Plaza Hotel</h3>
                  <p className="text-gray-500 text-sm">Bangkok, Thailand</p>
                  <p className="text-red-500 font-semibold mt-2">
                    $200 / night
                  </p>
                </div>{" "}
              </SwiperSlide>
              <SwiperSlide>
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <Image
                    src="/path-to-hotel-image.jpg"
                    alt="Hotel Image"
                    width={400}
                    height={200}
                    className="rounded-lg"
                  />
                  <h3 className="text-lg font-semibold mt-2">Plaza Hotel</h3>
                  <p className="text-gray-500 text-sm">Bangkok, Thailand</p>
                  <p className="text-red-500 font-semibold mt-2">
                    $200 / night
                  </p>
                </div>{" "}
              </SwiperSlide>
            </Swiper>
          </div>
        </section>

        <section className="bg-white py-24 grid grid-container-desktop gap-y-12">
          <div className="col-start-2 col-end-3 text-[rgb(8,67,155)] font-[500] text-[36px] leading-[41.4px]">
            ความคิดเห็นจากผู้ใช้บริการ
          </div>
          <div className="col-start-2 col-end-3">
            <Swiper
              slidesPerView={3}
              cssMode={true}
              navigation={true}
              mousewheel={true}
              keyboard={true}
              modules={[Navigation]}
              className="mySwiper px-5"
            >
              <SwiperSlide>
                <div className="max-w-xs p-4 bg-white shadow-lg rounded-lg">
                  <div className="mb-4">
                    <blockquote className="text-lg text-gray-700 font-semibold italic">
                      &ldquo;Fastwork ทำให้ การทำงาน สะดวก และ ง่ายขึ้นมากครับ
                      เราสามารถ เลือกฟรีแลนซ์ได้ตามสไตล์ที่เราต้องการ&rdquo;
                    </blockquote>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      {/* Add your logo image here */}
                      <Image
                        src="/path-to-your-logo.png"
                        alt="Company Logo"
                        width={40}
                        height={40}
                      />
                      <span className="ml-2 text-gray-600 font-medium text-sm">
                        บริษัท อีสานพลาสแพ็ค 1999 จำกัด
                      </span>
                    </div>
                    <div className="text-gray-500 text-xs">
                      โรงงานอุตสาหกรรมพลาสติก
                    </div>
                  </div>
                </div>{" "}
              </SwiperSlide>
              <SwiperSlide>
                <div className="max-w-xs p-4 bg-white shadow-lg rounded-lg">
                  <div className="mb-4">
                     <blockquote className="text-lg text-gray-700 font-semibold italic">
                      &ldquo;Fastwork ทำให้ การทำงาน สะดวก และ ง่ายขึ้นมากครับ
                      เราสามารถ เลือกฟรีแลนซ์ได้ตามสไตล์ที่เราต้องการ&rdquo;
                    </blockquote>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      {/* Add your logo image here */}
                      <Image
                        src="/path-to-your-logo.png"
                        alt="Company Logo"
                        width={40}
                        height={40}
                      />
                      <span className="ml-2 text-gray-600 font-medium text-sm">
                        บริษัท อีสานพลาสแพ็ค 1999 จำกัด
                      </span>
                    </div>
                    <div className="text-gray-500 text-xs">
                      โรงงานอุตสาหกรรมพลาสติก
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="max-w-xs p-4 bg-white shadow-lg rounded-lg">
                  <div className="mb-4">
                    <blockquote className="text-lg text-gray-700 font-semibold italic">
                      &ldquo;Fastwork ทำให้ การทำงาน สะดวก และ ง่ายขึ้นมากครับ
                      เราสามารถ เลือกฟรีแลนซ์ได้ตามสไตล์ที่เราต้องการ&rdquo;
                    </blockquote>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      {/* Add your logo image here */}
                      <Image
                        src="/path-to-your-logo.png"
                        alt="Company Logo"
                        width={40}
                        height={40}
                      />
                      <span className="ml-2 text-gray-600 font-medium text-sm">
                        บริษัท อีสานพลาสแพ็ค 1999 จำกัด
                      </span>
                    </div>
                    <div className="text-gray-500 text-xs">
                      โรงงานอุตสาหกรรมพลาสติก
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="max-w-xs p-4 bg-white shadow-lg rounded-lg">
                  <div className="mb-4">
                    <blockquote className="text-lg text-gray-700 font-semibold italic">
                    &ldquo;Fastwork ทำให้ การทำงาน สะดวก และ ง่ายขึ้นมากครับ
                    เราสามารถ เลือกฟรีแลนซ์ได้ตามสไตล์ที่เราต้องการ&rdquo;
                    </blockquote>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      {/* Add your logo image here */}
                      <Image
                        src="/path-to-your-logo.png"
                        alt="Company Logo"
                        width={40}
                        height={40}
                      />
                      <span className="ml-2 text-gray-600 font-medium text-sm">
                        บริษัท อีสานพลาสแพ็ค 1999 จำกัด
                      </span>
                    </div>
                    <div className="text-gray-500 text-xs">
                      โรงงานอุตสาหกรรมพลาสติก
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="max-w-xs p-4 bg-white shadow-lg rounded-lg">
                  <div className="mb-4">
                    <blockquote className="text-lg text-gray-700 font-semibold italic">
                    &ldquo;Fastwork ทำให้ การทำงาน สะดวก และ ง่ายขึ้นมากครับ
                    เราสามารถ เลือกฟรีแลนซ์ได้ตามสไตล์ที่เราต้องการ&rdquo;
                    </blockquote>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      {/* Add your logo image here */}
                      <Image
                        src="/path-to-your-logo.png"
                        alt="Company Logo"
                        width={40}
                        height={40}
                      />
                      <span className="ml-2 text-gray-600 font-medium text-sm">
                        บริษัท อีสานพลาสแพ็ค 1999 จำกัด
                      </span>
                    </div>
                    <div className="text-gray-500 text-xs">
                      โรงงานอุตสาหกรรมพลาสติก
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="max-w-xs p-4 bg-white shadow-lg rounded-lg">
                  <div className="mb-4">
                    <blockquote className="text-lg text-gray-700 font-semibold italic">
                    &ldquo;Fastwork ทำให้ การทำงาน สะดวก และ ง่ายขึ้นมากครับ
                    เราสามารถ เลือกฟรีแลนซ์ได้ตามสไตล์ที่เราต้องการ&rdquo;
                    </blockquote>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      {/* Add your logo image here */}
                      <Image
                        src="/path-to-your-logo.png"
                        alt="Company Logo"
                        width={40}
                        height={40}
                      />
                      <span className="ml-2 text-gray-600 font-medium text-sm">
                        บริษัท อีสานพลาสแพ็ค 1999 จำกัด
                      </span>
                    </div>
                    <div className="text-gray-500 text-xs">
                      โรงงานอุตสาหกรรมพลาสติก
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="max-w-xs p-4 bg-white shadow-lg rounded-lg">
                  <div className="mb-4">
                    <blockquote className="text-lg text-gray-700 font-semibold italic">
                    &ldquo;Fastwork ทำให้ การทำงาน สะดวก และ ง่ายขึ้นมากครับ
                    เราสามารถ เลือกฟรีแลนซ์ได้ตามสไตล์ที่เราต้องการ&rdquo;
                    </blockquote>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      {/* Add your logo image here */}
                      <Image
                        src="/path-to-your-logo.png"
                        alt="Company Logo"
                        width={40}
                        height={40}
                      />
                      <span className="ml-2 text-gray-600 font-medium text-sm">
                        บริษัท อีสานพลาสแพ็ค 1999 จำกัด
                      </span>
                    </div>
                    <div className="text-gray-500 text-xs">
                      โรงงานอุตสาหกรรมพลาสติก
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </section>

        <section
          className="hidden md:block"
          style={{ backgroundColor: "hsl(216, 15%, 97%)" }}
        >
          <div className="py-24 grid grid-container-desktop gap-y-[1.5rem]">
            <div className="col-start-2 col-end-3 w-full text-center">
              <h5 className="text-[1.25rem] text-[#2B323BF2] font-medium font-secondary leading-[1.15] mb-[1.5rem]">
                มีงานสำเร็จกว่า 150,000 ชิ้น โดยบริษัทชั้นนำต่างๆ
                เชื่อใจและเลือกใช้บริการของ Fastwork
              </h5>
              <div className="grid grid-cols-6 grid-rows-2 gap-x-8 gap-y-4">
                <Image
                  src={CustomerImage.pic1}
                  alt="trusted by company"
                  style={{ filter: "grayscale(100%)" }}
                  width={384}
                  height={230}
                  layout="intrinsic"
                />
                <Image
                  src={CustomerImage.pic2}
                  alt="trusted by company"
                  style={{ filter: "grayscale(100%)" }}
                  width={384}
                  height={230}
                  layout="intrinsic"
                />
                <Image
                  src={CustomerImage.pic3}
                  alt="trusted by company"
                  style={{ filter: "grayscale(100%)" }}
                  width={384}
                  height={230}
                  layout="intrinsic"
                />
                <Image
                  src={CustomerImage.pic4}
                  alt="trusted by company"
                  style={{ filter: "grayscale(100%)" }}
                  width={384}
                  height={230}
                  layout="intrinsic"
                />
                <Image
                  src={CustomerImage.pic5}
                  alt="trusted by company"
                  style={{ filter: "grayscale(100%)" }}
                  width={384}
                  height={230}
                  layout="intrinsic"
                />
                <Image
                  src={CustomerImage.pic6}
                  alt="trusted by company"
                  style={{ filter: "grayscale(100%)" }}
                  width={384}
                  height={230}
                  layout="intrinsic"
                />
                <Image
                  src={CustomerImage.pic7}
                  alt="trusted by company"
                  style={{ filter: "grayscale(100%)" }}
                  width={384}
                  height={230}
                  layout="intrinsic"
                />
                <Image
                  src={CustomerImage.pic8}
                  alt="trusted by company"
                  style={{ filter: "grayscale(100%)" }}
                  width={384}
                  height={230}
                  layout="intrinsic"
                />
                <Image
                  src={CustomerImage.pic9}
                  alt="trusted by company"
                  style={{ filter: "grayscale(100%)" }}
                  width={384}
                  height={230}
                  layout="intrinsic"
                />
                <Image
                  src={CustomerImage.pic10}
                  alt="trusted by company"
                  style={{ filter: "grayscale(100%)" }}
                  width={384}
                  height={230}
                  layout="intrinsic"
                />
                <Image
                  src={CustomerImage.pic11}
                  alt="trusted by company"
                  style={{ filter: "grayscale(100%)" }}
                  width={384}
                  height={230}
                  layout="intrinsic"
                />
                <Image
                  src={CustomerImage.pic12}
                  alt="trusted by company"
                  style={{ filter: "grayscale(100%)" }}
                  width={384}
                  height={230}
                  layout="intrinsic"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="hidden md:block">
          <div className="bg-white py-24 grid grid-container-desktop gap-y-12">
            <div className="col-start-2 col-end-3 w-full text-left">
              <h2 className="block text-[#08439B] text-[36px] mt-[0.83em] mb-[0.83em] mx-0">
                Fastwork ที่หนึ่งแห่งฟรีแลนซ์คุณภาพ
              </h2>
              <div
                className={`text-gray-700 overflow-hidden transition-all duration-300 ${
                  expanded ? "max-h-[500px]" : "max-h-20"
                }`}
              >
                <p>
                  Fastwork.co คือเว็บไซต์ที่รวบรวม ฟรีแลนซ์
                  มืออาชีพจากหลากหลายสายงานไว้ในที่เดียวกัน ไม่ว่าจะเป็น
                  งานออกแบบโลโก้ ทำแบนเนอร์โฆษณา เขียนบทความ แปลภาษา
                  การตลาดออนไลน์ พัฒนาเว็บไซต์ และงานอื่นๆ อีกกว่า 90 หมวดหมู่
                  เพื่อตอบโจทย์ความต้องการที่หลากหลายของทั้งผู้ประกอบการและผู้ใช้งานทั่วไป
                  ทีมงานของเราพัฒนา Fastwork.co ขึ้นโดยเน้นความเรียบง่าย
                  และความสะดวกรวดเร็วในการใช้งาน
                  ด้วยแนวคิดที่จะสร้างสรรค์แพลทฟอร์มที่จะช่วยประหยัดเวลาให้กับทั้ง
                  ฟรีแลนซ์ และลูกค้า
                  อีกทั้งยังมุ่งมั่นที่จะสนับสนุนการสร้างธุรกิจใหม่
                  และต่อยอดธุรกิจให้กับผู้ประกอบการทั้งรายใหญ่รายย่อย
                  และยังช่วยเหลือ ฟรีแลนซ์ ให้หางานได้ง่าย
                  สร้างรายได้ให้มากขึ้นและมั่นคง
                  ตลอดจนยกระดับมาตรฐานฟรีแลนซ์ไทยให้มีคุณภาพที่ดีขึ้นอีกด้วย
                </p>
                <br />
                <p>
                  ด้วยเหตุนี้ Fastwork.co
                  จึงทำหน้าที่เสมือนเป็นพื้นที่สื่อกลางออนไลน์ระหว่าง ฟรีแลนซ์
                  และผู้ที่มีความต้องการจ้างงานให้มาเจอกันได้ทุกที่ทุกเวลา
                  โดยที่ ฟรีแลนซ์ จะใช้เว็บไซต์ Fastwork.co
                  เป็นพื้นที่ในการลงประกาศรับจ้างงาน
                  ในขณะที่ลูกค้าก็สามารถเข้ามาค้นหางานของ ฟรีแลนซ์
                  ที่ต้องการได้ในที่เดียวกัน
                  อีกทั้งยังมีอิสระในการเลือกจ้างงานเป็นครั้งๆได้
                  สามารถเปรียบเทียบราคาและคุณภาพผลงานของ ฟรีแลนซ์
                  ที่มีอยู่หลากหลาย เพื่อให้ตรงกับความต้องการมากที่สุดอีกด้วย
                  นอกจากนี้ ด้วยระบบการชำระเงินที่ปลอดภัยของ Fastwork.co
                  ยังช่วยรับประกันการส่งมอบงานที่ครบถ้วนถูกต้องให้กับฝั่งลูกค้า
                  ด้วยการเป็นตัวกลางในการถือเงินระหว่างที่ ฟรีแลนซ์ กำลังทำงาน
                  และในทางกลับกันก็ช่วยรับประกันการส่งมอบเงินค่าจ้างให้กับ
                  ฟรีแลนซ์ เมื่อทำงานสำเร็จและส่งมอบให้ลูกค้าด้วยเช่นกัน
                </p>
                <br />{" "}
                <p>
                  ปัจจุบัน Fastwork.co มี ฟรีแลนซ์
                  ที่ผ่านการคัดกรองคุณภาพแล้วกว่า 50,000 คน
                  ให้บริการในหมวดหมู่งานที่ครอบคลุมความต้องการกว่า 90 หมวดหมู่
                  ด้วยจำนวนงานที่หลากหลายมากกว่า 15,000 งาน
                  ซึ่งคัดแยกตามทักษะความสามารถของ ฟรีแลนซ์
                  เพื่อตอบโจทย์ความต้องการของลูกค้าอย่างครบวงจร
                  ไม่ว่าจะเป็นเจ้าของกิจการ ธุรกิจ SME แม่ค้าออนไลน์
                  หรือแม้แต่บุคคลทั่วไป
                  ที่กำลังมองหางานระดับมืออาชีพในราคาที่จับต้องได้
                  การันตีคุณภาพโดย Fastwork แหล่งรวม ฟรีแลนซ์ มืออาชีพ
                  ที่ได้รับความไว้วางใจจากลูกค้ากว่า 700,000 ราย
                </p>
              </div>
              {!expanded && (
                <div
                  className="text-blue-600 cursor-pointer text-center mt-4"
                  onClick={() => setExpanded(true)}
                >
                  อ่านเพิ่มเติม ▼
                </div>
              )}
            </div>
          </div>
        </section>
        <section className="hidden md:block">
          <div className="bg-white py-24 grid grid-container-desktop gap-y-12">
            <div className="col-start-2 col-end-3 w-full">
              <h2 className="block text-[#08439B] text-[36px] mt-[0.83em] mb-[0.83em] mx-0 text-center">
                หมวดหมู่งานต่างๆ ของ Fastwork
              </h2>
              <div className="grid w-full gap-x-8 gap-y-6 grid-cols-4 grid-rows-2">
                <div className="block">
                  <strong className="mb-2 !important font-[Kanit] text-[#2B323BF2]">
                    กราฟิกและการออกแบบ
                  </strong>
                  <p className="mt-[0.5rem] text-[hsl(216,15%,52%)] text-opacity-[var(--cl-opacity)] text-[0.875rem] leading-[1.65] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif]">
                    <Link href="/social-media-banner">ออกแบบแบนเนอร์</Link>
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
                    <Link href="/design-graphic">ดูเพิ่มเติม</Link>
                  </p>
                </div>
                <div className="block">
                  <strong className="mb-2 !important font-[Kanit] text-[#2B323BF2]">
                    สถาปัตย์และวิศวกรรม
                  </strong>
                  <p className="mt-[0.5rem] text-[hsl(216,15%,52%)] text-opacity-[var(--cl-opacity)] text-[0.875rem] leading-[1.65] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif]">
                    <Link href="/architect-and-interior/renovation">
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
                    <Link href="/architect-and-engineer">ดูเพิ่มเติม</Link>
                  </p>
                </div>
                <div className="block">
                  <strong className="mb-2 !important font-[Kanit] text-[#2B323BF2]">
                    เว็บไซต์และเขียนโปรแกรม
                  </strong>
                  <p className="mt-[0.5rem] text-[hsl(216,15%,52%)] text-opacity-[var(--cl-opacity)] text-[0.875rem] leading-[1.65] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif]">
                    <Link href="/ux-ui-design-web-app">ออกแบบเว็บไซต์</Link>
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
                    ,&nbsp;<Link href="/web-programming">ดูเพิ่มเติม</Link>
                  </p>
                </div>
                <div className="block">
                  <strong className="mb-2 !important font-[Kanit] text-[#2B323BF2]">
                    การตลาดและโฆษณา
                  </strong>
                  <p className="mt-[0.5rem] text-[hsl(216,15%,52%)] text-opacity-[var(--cl-opacity)] text-[0.875rem] leading-[1.65] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif]">
                    <Link href="/seo">รับทำ SEO</Link>,&nbsp;
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
                    <Link href="/marketing-advertising">ดูเพิ่มเติม</Link>
                  </p>
                </div>
                <div className="block">
                  <strong className="mb-2 !important font-[Kanit] text-[#2B323BF2]">
                    เขียนและแปลภาษา
                  </strong>
                  <p className="mt-[0.5rem] text-[hsl(216,15%,52%)] text-opacity-[var(--cl-opacity)] text-[0.875rem] leading-[1.65] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif]">
                    <Link href="/translation">แปลภาษา</Link>,&nbsp;
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
                    ,&nbsp;<Link href="/writing-translation">ดูเพิ่มเติม</Link>
                  </p>
                </div>
                <div className="block">
                  <strong className="mb-2 !important font-[Kanit] text-[#2B323BF2]">
                    ภาพและเสียง
                  </strong>
                  <p className="mt-[0.5rem] text-[hsl(216,15%,52%)] text-opacity-[var(--cl-opacity)] text-[0.875rem] leading-[1.65] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif]">
                    <Link href="/photography">ตากล้อง</Link>,&nbsp;
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
                    <Link href="/photography-video">ดูเพิ่มเติม</Link>
                  </p>
                </div>
                <div className="block">
                  <strong className="mb-2 !important font-[Kanit] text-[#2B323BF2]">
                    ธุรกิจและที่ปรึกษา
                  </strong>
                  <p className="mt-[0.5rem] text-[hsl(216,15%,52%)] text-opacity-[var(--cl-opacity)] text-[0.875rem] leading-[1.65] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif]">
                    <Link href="/accounting-and-finance/accounting-service">
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
                    <Link href="/consultant">ดูเพิ่มเติม</Link>
                  </p>
                </div>
                <div className="block">
                  <strong className="mb-2 !important font-[Kanit] text-[#2B323BF2]">
                    ไลฟ์สไตล์
                  </strong>
                  <p className="mt-[0.5rem] text-[hsl(216,15%,52%)] text-opacity-[var(--cl-opacity)] text-[0.875rem] leading-[1.65] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif]">
                    <Link href="/car-inspection">ตรวจรถมือสอง</Link>,&nbsp;
                    <Link href="/feng-shui">ซินแสดูฮวงจุ้ยบ้าน</Link>,&nbsp;
                    <Link href="/gaming">รับจ้างเล่นเกม</Link>,&nbsp;
                    <Link href="/horoscope">ดูดวง</Link>,&nbsp;
                    <Link href="/makeup">ช่างแต่งหน้า</Link>,&nbsp;
                    <Link href="/personnal-trainer">จ้างเทรนเนอร์</Link>,&nbsp;
                    <Link href="/nutrition">ปรึกษานักโภชนาการ</Link>,&nbsp;
                    <Link href="/singer-band">หานักร้อง</Link>,&nbsp;
                    <Link href="/trip-planner">รับวางแผนเที่ยว</Link>,&nbsp;
                    <Link href="/prop-stylist">สไตล์ลิส</Link>,&nbsp;
                    <Link href="/lifestyle">ดูเพิ่มเติม</Link>
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
                  ดาวน์โหลดแอปฯ Fastwork
                </h4>
                <p className="mt-[0.5rem] text-[1rem] text-black font-[Kanit, -apple-system, system-ui, blinkmacsystemfont, 'Segoe UI', roboto, 'Helvetica Neue', sans-serif] leading-[1.65] m-0 p-0 block mb-[1em] mt-[1em] mx-0">
                  ให้ประสบการณ์การจ้างงานฟรีแลนซ์ของคุณเป็นเรื่องง่าย
                  ค้นหาฟรีแลนซ์ บรีฟงาน ชําระเงิน รอรับผลงาน จบครบในแอปเดียว
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
    </div>
  );
}

// export const metadata: Metadata = {
//   title:
//     "Fastlance.vn - Tổng hợp freelancer chất lượng hàng đầu cho doanh nghiệp ",
//   description:
//     "Nền tảng freelancer chất lượng cao cho doanh nghiệp tại Việt Nam.",
// };
