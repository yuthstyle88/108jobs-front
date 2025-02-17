"use client";
import { Metadata } from "next";
import Image from "next/image";
import Footer from "../components/Footer";
import Header from "@/components/Header";
import imgapp from "@/assets/images/img-app.webp";
import apple from "@/assets/icons/apple.svg";
import google from "@/assets/icons/google-play.svg";
import fastwork from "@/assets/images/fastwork-app-qr.webp";
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
      <Header type="transparent"/>
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
      <div className="bg-white">
        <div className="w-4/6 mx-auto mt-[6rem] pb-[4rem] grid gap-y-6 grid-cols-[minmax(1rem,1fr)_minmax(calc(var(--breakpoint-lg)-4rem),calc(var(--breakpoint-lg)-4rem))_minmax(1rem,1fr)] grid-rows-auto">
          <h2 className="block text-[#08439B] text-[36px] mt-[0.83em] mb-[0.83em] mx-0">
            หมวดหมู่งานต่างๆ ของ Fastwork
          </h2>
          <div className="grid w-full gap-x-8 gap-y-6 grid-cols-4 grid-rows-2">
            <div className="block">
              <strong className="mb-2 !important font-[Kanit] text-[#2B323BF2]">
                กราฟิกและการออกแบบ
              </strong>
              <p className="mt-[0.5rem] text-[hsl(216,15%,52%)] text-opacity-[var(--cl-opacity)] text-[0.875rem] leading-[1.65] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif]">
                <a href="/social-media-banner">ออกแบบแบนเนอร์</a>,&nbsp;
                <a href="/publication/namecard">ออกแบบนามบัตร</a>,&nbsp;
                <a href="/publication/poster">ออกแบบโปสเตอร์</a>,&nbsp;
                <a href="/infographics">ทำ Infographic</a>,&nbsp;
                <a href="/portfolio-resume">รับทำเรซูเม่</a>,&nbsp;
                <a href="/tattoo-design">ออกแบบลายสัก</a>,&nbsp;
                <a href="/packaging">ออกแบบแพคเกจจิ้ง</a>,&nbsp;
                <a href="/corporate-identity">ออกแบบ CI</a>,&nbsp;
                <a href="/design-graphic">ดูเพิ่มเติม</a>
              </p>
            </div>
            <div className="block">
              <strong className="mb-2 !important font-[Kanit] text-[#2B323BF2]">
                สถาปัตย์และวิศวกรรม
              </strong>
              <p className="mt-[0.5rem] text-[hsl(216,15%,52%)] text-opacity-[var(--cl-opacity)] text-[0.875rem] leading-[1.65] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif]">
                <a href="/architect-and-interior/renovation">รีโนเวทบ้าน</a>
                ,&nbsp;
                <a href="/architect-and-interior/home-design">ออกแบบบ้าน</a>
                ,&nbsp;
                <a href="/engineering-structural-design/boq">
                  ถอดแบบประมาณราคา
                </a>
                ,&nbsp;
                <a href="/engineering-structural-design">เขียนแบบก่อสร้าง</a>
                ,&nbsp;<a href="/home-inspection">ตรวจรับบ้าน</a>,&nbsp;
                <a href="/landscape">จัดสวนหน้าบ้าน งบน้อย</a>,&nbsp;
                <a href="/engineering-structural-design/residence">
                  เขียนแบบบ้านชั้นเดียว
                </a>
                ,&nbsp;
                <a href="/architect-and-interior/furniture">ออกแบบเตียงนอน</a>
                ,&nbsp;
                <a href="/engineering-structural-design/machine">
                  ถอดแบบเครื่องกล
                </a>
                ,&nbsp;<a href="/architect-and-engineer">ดูเพิ่มเติม</a>
              </p>
            </div>
            <div className="block">
              <strong className="mb-2 !important font-[Kanit] text-[#2B323BF2]">
                เว็บไซต์และเขียนโปรแกรม
              </strong>
              <p className="mt-[0.5rem] text-[hsl(216,15%,52%)] text-opacity-[var(--cl-opacity)] text-[0.875rem] leading-[1.65] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif]">
                <a href="/ux-ui-design-web-app">ออกแบบเว็บไซต์</a>,&nbsp;
                <a href="/web-development/ecommerce">สร้างเว็บขายของ</a>
                ,&nbsp;
                <a href="/web-development/instant-builder">เว็บไซต์สำเร็จรูป</a>
                ,&nbsp;<a href="/desktop-application">รับเขียนโปรแกรม</a>
                ,&nbsp;<a href="/chatbot">Chatbot Facebook</a>,&nbsp;
                <a href="/chatbot">สร้างบอทไลน์</a>,&nbsp;
                <a href="/web-scraping">Website Scraping</a>,&nbsp;
                <a href="/it-solution-and-support/software">รับลงโปรแกรม</a>
                ,&nbsp;<a href="/web-programming">ดูเพิ่มเติม</a>
              </p>
            </div>
            <div className="block">
              <strong className="mb-2 !important font-[Kanit] text-[#2B323BF2]">
                การตลาดและโฆษณา
              </strong>
              <p className="mt-[0.5rem] text-[hsl(216,15%,52%)] text-opacity-[var(--cl-opacity)] text-[0.875rem] leading-[1.65] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif]">
                <a href="/seo">รับทำ SEO</a>,&nbsp;
                <a href="/google-ads">โฆษณา Google</a>,&nbsp;
                <a href="/social-media-ads/facebook-ads">โฆษณา Facebook</a>
                ,&nbsp;<a href="/social-media-ads/tiktok-ads">โฆษณา TikTok</a>
                ,&nbsp;<a href="/blogger-netidol">บล็อกเกอร์รีวิว</a>,&nbsp;
                <a href="/promote-page/product">โปรโมทสินค้า</a>,&nbsp;
                <a href="/focus-group">รับจ้างทดลองสินค้า</a>,&nbsp;
                <a href="/promote-real-estate">รับฝากขายบ้าน</a>,&nbsp;
                <a href="/google-map">ปักหมุด google map</a>,&nbsp;
                <a href="/marketing-advertising">ดูเพิ่มเติม</a>
              </p>
            </div>
            <div className="block">
              <strong className="mb-2 !important font-[Kanit] text-[#2B323BF2]">
                เขียนและแปลภาษา
              </strong>
              <p className="mt-[0.5rem] text-[hsl(216,15%,52%)] text-opacity-[var(--cl-opacity)] text-[0.875rem] leading-[1.65] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif]">
                <a href="/translation">แปลภาษา</a>,&nbsp;
                <a href="/translator">ล่ามแปลภาษา</a>,&nbsp;
                <a href="/transcription">ถอดไฟล์เสียง</a>,&nbsp;
                <a href="/content-writing">เขียนคอนเทนต์</a>,&nbsp;
                <a href="/content-writing/seo">เขียนบทความ SEO</a>,&nbsp;
                <a href="/content-writing/foreign-language">
                  เขียนบทความภาษาอังกฤษ
                </a>
                ,&nbsp;
                <a href="/content-writing/thesis-report">รับเขียนรายงาน</a>
                ,&nbsp;<a href="/proofreading">พิสูจน์อักษร</a>,&nbsp;
                <a href="/story-writing/poets-and-poems">รับแต่งกลอน</a>
                ,&nbsp;<a href="/writing-translation">ดูเพิ่มเติม</a>
              </p>
            </div>
            <div className="block">
              <strong className="mb-2 !important font-[Kanit] text-[#2B323BF2]">
                ภาพและเสียง
              </strong>
              <p className="mt-[0.5rem] text-[hsl(216,15%,52%)] text-opacity-[var(--cl-opacity)] text-[0.875rem] leading-[1.65] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif]">
                <a href="/photography">ตากล้อง</a>,&nbsp;
                <a href="/photography/wedding">ถ่ายพรีเวดดิ้ง</a>,&nbsp;
                <a href="/podcast">สร้าง Podcast</a>,&nbsp;
                <a href="/sound-engineering/edit-mixing-mastering">
                  ตัดต่อเพลง
                </a>
                ,&nbsp;<a href="/videography">ตัดต่อวีดีโอ</a>,&nbsp;
                <a href="/subtitle">ทำซับไตเติ้ล</a>,&nbsp;
                <a href="/motion-graphics">Motion Graphic</a>,&nbsp;
                <a href="/videography/live-streaming">รับไลฟ์สด</a>,&nbsp;
                <a href="/animations">ทำอนิเมชั่น</a>,&nbsp;
                <a href="/voice-over">พากย์เสียง</a>,&nbsp;
                <a href="/photography-video">ดูเพิ่มเติม</a>
              </p>
            </div>
            <div className="block">
              <strong className="mb-2 !important font-[Kanit] text-[#2B323BF2]">
                ธุรกิจและที่ปรึกษา
              </strong>
              <p className="mt-[0.5rem] text-[hsl(216,15%,52%)] text-opacity-[var(--cl-opacity)] text-[0.875rem] leading-[1.65] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif]">
                <a href="/accounting-and-finance/accounting-service">
                  รับทำบัญชี
                </a>
                ,&nbsp;<a href="/counseling">รับปรึกษาปัญหาชีวิต</a>,&nbsp;
                <a href="/financial-planning">ที่ปรึกษาทางการเงิน</a>,&nbsp;
                <a href="/legal">ที่ปรึกษากฎหมาย</a>,&nbsp;
                <a href="/psychologist">ปรึกษาสุขภาพจิต</a>,&nbsp;
                <a href="/order-from-china">สั่งสินค้าจากจีน</a>,&nbsp;
                <a href="/secretary">เลขาส่วนตัว</a>,&nbsp;
                <a href="/commercial-registration">จดทะเบียนบริษัท</a>,&nbsp;
                <a href="/business">ปรึกษาธุรกิจ</a>,&nbsp;
                <a href="/consultant">ดูเพิ่มเติม</a>
              </p>
            </div>
            <div className="block">
              <strong className="mb-2 !important font-[Kanit] text-[#2B323BF2]">
                ไลฟ์สไตล์
              </strong>
              <p className="mt-[0.5rem] text-[hsl(216,15%,52%)] text-opacity-[var(--cl-opacity)] text-[0.875rem] leading-[1.65] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif]">
                <a href="/car-inspection">ตรวจรถมือสอง</a>,&nbsp;
                <a href="/feng-shui">ซินแสดูฮวงจุ้ยบ้าน</a>,&nbsp;
                <a href="/gaming">รับจ้างเล่นเกม</a>,&nbsp;
                <a href="/horoscope">ดูดวง</a>,&nbsp;
                <a href="/makeup">ช่างแต่งหน้า</a>,&nbsp;
                <a href="/personnal-trainer">จ้างเทรนเนอร์</a>,&nbsp;
                <a href="/nutrition">ปรึกษานักโภชนาการ</a>,&nbsp;
                <a href="/singer-band">หานักร้อง</a>,&nbsp;
                <a href="/trip-planner">รับวางแผนเที่ยว</a>,&nbsp;
                <a href="/prop-stylist">สไตล์ลิส</a>,&nbsp;
                <a href="/lifestyle">ดูเพิ่มเติม</a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#E3EDFD]">
        <div className=" bg-no-repeat bg-[105%_30px] grid w-5/6 place-self-start gap-x-8 grid-cols-[minmax(1rem,_1fr)_minmax(calc(var(--breakpoint-lg)_-_4rem),_calc(var(--breakpoint-lg)_-_4rem))_minmax(1rem,_1fr)] mx-auto grid-rows-auto">
          <div className="grid grid-cols-[7fr_5fr] min-w-0 min-h-0 ">
            <Image
              alt="Download Application"
              loading="lazy"
              decoding="async"
              data-nimg="1"
              className="justify-self-end h-auto max-w-[100%]"
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
                    <a href="https://apps.apple.com/us/app/fastwork-hire-freelancers/id1154830520?ls=1">
                      <Image
                        src={apple}
                        alt="Apple Store"
                        width={135}
                        height={40}
                        className="max-w-full h-auto"
                      />
                    </a>
                    <a href="https://play.google.com/store/apps/details?id=com.fastwork.app&hl=en">
                      <Image
                        src={google}
                        alt="Google Play"
                        width={135}
                        height={40}
                        className="max-w-full h-auto"
                      />
                    </a>
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
