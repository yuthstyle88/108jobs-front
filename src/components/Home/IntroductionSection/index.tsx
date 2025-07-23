import { CustomerImage } from "@/constants/images";
import { HomeLanguage } from "@/types/language";
import React, { memo } from "react";
import LazyImage from "@/components/ui/LazyImage";

type Props = {
  homeLanguageData?: Partial<HomeLanguage> | null;
  expanded: boolean;
  setExpanded: (expanded:boolean) => void;
};

const IntroductionSectionComponent = (props: Props) => {
  const { homeLanguageData, expanded, setExpanded } = props;
  return (
    <>
      <section
        className="hidden md:block"
        style={{ backgroundColor: "hsl(216, 15%, 97%)" }}
      >
        <div className="py-8 grid grid-container-desktop gap-y-[1.5rem]">
          <div className="col-start-2 col-end-3 w-full text-center">
            <h5 className="text-[1.25rem] text-[#2B323BF2] font-medium font-secondary leading-[1.15] mb-[1.5rem]">
              {homeLanguageData?.titleTrustedCompanies}
            </h5>
            <div className="grid grid-cols-6 grid-rows-2 gap-x-8 gap-y-4">
              <LazyImage
                imagePath="customer/th/1.png"
                alt="Trusted company logo 1"
                style={{ filter: "grayscale(100%)" }}
                width={384}
                height={230}
                loading="lazy"
                blurUp={true}
                trackPerformance={true}
                className="w-full h-auto"
              />
              <LazyImage
                imagePath="customer/th/2.png"
                alt="Trusted company logo 2"
                style={{ filter: "grayscale(100%)" }}
                width={384}
                height={230}
                loading="lazy"
                blurUp={true}
                trackPerformance={true}
                className="w-full h-auto"
              />
              <LazyImage
                imagePath="customer/th/3.png"
                alt="Trusted company logo 3"
                style={{ filter: "grayscale(100%)" }}
                width={384}
                height={230}
                loading="lazy"
                blurUp={true}
                trackPerformance={true}
                className="w-full h-auto"
              />
              <LazyImage
                imagePath="customer/th/4.png"
                alt="Trusted company logo 4"
                style={{ filter: "grayscale(100%)" }}
                width={384}
                height={230}
                loading="lazy"
                blurUp={true}
                trackPerformance={true}
                className="w-full h-auto"
              />
              <LazyImage
                imagePath="customer/th/5.png"
                alt="Trusted company logo 5"
                style={{ filter: "grayscale(100%)" }}
                width={384}
                height={230}
                loading="lazy"
                blurUp={true}
                trackPerformance={true}
                className="w-full h-auto"
              />
              <LazyImage
                imagePath="customer/th/6.png"
                alt="Trusted company logo 6"
                style={{ filter: "grayscale(100%)" }}
                width={384}
                height={230}
                loading="lazy"
                blurUp={true}
                trackPerformance={true}
                className="w-full h-auto"
              />
              <LazyImage
                imagePath="customer/th/7.png"
                alt="Trusted company logo 7"
                style={{ filter: "grayscale(100%)" }}
                width={384}
                height={230}
                loading="lazy"
                blurUp={true}
                trackPerformance={true}
                className="w-full h-auto"
              />
              <LazyImage
                imagePath="customer/th/8.png"
                alt="Trusted company logo 8"
                style={{ filter: "grayscale(100%)" }}
                width={384}
                height={230}
                loading="lazy"
                blurUp={true}
                trackPerformance={true}
                className="w-full h-auto"
              />
              <LazyImage
                imagePath="customer/th/9.png"
                alt="Trusted company logo 9"
                style={{ filter: "grayscale(100%)" }}
                width={384}
                height={230}
                loading="lazy"
                blurUp={true}
                trackPerformance={true}
                className="w-full h-auto"
              />
              <LazyImage
                imagePath="customer/th/10.png"
                alt="Trusted company logo 10"
                style={{ filter: "grayscale(100%)" }}
                width={384}
                height={230}
                loading="lazy"
                blurUp={true}
                trackPerformance={true}
                className="w-full h-auto"
              />
              <LazyImage
                imagePath="customer/th/11.png"
                alt="Trusted company logo 11"
                style={{ filter: "grayscale(100%)" }}
                width={384}
                height={230}
                loading="lazy"
                blurUp={true}
                trackPerformance={true}
                className="w-full h-auto"
              />
              <LazyImage
                imagePath="customer/th/12.png"
                alt="Trusted company logo 12"
                style={{ filter: "grayscale(100%)" }}
                width={384}
                height={230}
                loading="lazy"
                blurUp={true}
                trackPerformance={true}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="hidden md:block">
        <div className="bg-white pt-24 pb-16 grid grid-container-desktop gap-y-12">
          <div className="col-start-2 col-end-3 w-full text-left">
            <h2 className="block text-[rgb(8,67,155)] font-[500] text-[36px] leading-[41.4px] mt-[0.83em] mb-[0.83em] mx-0">
              {homeLanguageData?.titlePlatform}
            </h2>
            <div
              className={`text-gray-700 overflow-hidden transition-all duration-300 ${
                expanded ? "max-h-[500px]" : "max-h-20"
              }`}
            >
              <p>{homeLanguageData?.contentFastwork1}</p>
              <br />
              <p>{homeLanguageData?.contentFastwork2}</p>
              <br /> <p>{homeLanguageData?.contentFastwork3}</p>
            </div>
            {!expanded && (
              <div
                className="text-blue-600 cursor-pointer text-center mt-4"
                onClick={() => setExpanded(true)}
              >
                {homeLanguageData?.buttonJobCategoriesViewMore} ▼
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="grid grid-container-desktop-banner">
        <div className="col-start-2 col-end-3 w-full">
          <hr className="w-full h-[1px] m-0 bg-borderSecondary" />
        </div>
      </div>

      <section className="hidden md:block">
        <div className="bg-white pt-24 pb-16 grid grid-container-desktop gap-y-12">
          <div className="col-start-2 col-end-3 w-full">
            <h2 className="block text-[rgb(8,67,155)] font-[500] text-[36px] leading-[41.4px] mb-[0.83em] mx-0">
              {homeLanguageData?.titleJobCategories}
            </h2>
            <div className="grid w-full gap-x-8 gap-y-6 grid-cols-4 grid-rows-2">
              <div className="block">
                <strong className="mb-2 !important font-[Kanit] text-[#2B323BF2]">
                  {homeLanguageData?.graphicDesign}
                </strong>
                <p className="mt-[0.5rem] text-[hsl(216,15%,52%)] text-opacity-[var(--cl-opacity)] text-[0.875rem] leading-[1.65] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif]">
                  {/* <Link prefetch={false} href="/social-media-banner">ออกแบบแบนเนอร์</Link>
                        ,&nbsp;
                        <Link prefetch={false} href="/publication/namecard">ออกแบบนามบัตร</Link>
                        ,&nbsp;
                        <Link prefetch={false} href="/publication/poster">ออกแบบโปสเตอร์</Link>
                        ,&nbsp;
                        <Link prefetch={false} href="/infographics">ทำ Infographic</Link>,&nbsp;
                        <Link prefetch={false} href="/portfolio-resume">รับทำเรซูเม่</Link>,&nbsp;
                        <Link prefetch={false} href="/tattoo-design">ออกแบบลายสัก</Link>,&nbsp;
                        <Link prefetch={false} href="/packaging">ออกแบบแพคเกจจิ้ง</Link>,&nbsp;
                        <Link prefetch={false} href="/corporate-identity">ออกแบบ CI</Link>,&nbsp;
                        <Link prefetch={false} href="/design-graphic">ดูเพิ่มเติม</Link> */}
                  {homeLanguageData?.graphicDesignServices}
                </p>
              </div>
              <div className="block">
                <strong className="mb-2 !important font-[Kanit] text-[#2B323BF2]">
                  {homeLanguageData?.architectureEngineering}
                </strong>
                <p className="mt-[0.5rem] text-[hsl(216,15%,52%)] text-opacity-[var(--cl-opacity)] text-[0.875rem] leading-[1.65] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif]">
                  {/* <Link prefetch={false} href="/architect-and-interior/renovation">
                          รีโนเวทบ้าน
                        </Link>
                        ,&nbsp;
                        <Link prefetch={false} href="/architect-and-interior/home-design">
                          ออกแบบบ้าน
                        </Link>
                        ,&nbsp;
                        <Link prefetch={false} href="/engineering-structural-design/boq">
                          ถอดแบบประมาณราคา
                        </Link>
                        ,&nbsp;
                        <Link prefetch={false} href="/engineering-structural-design">
                          เขียนแบบก่อสร้าง
                        </Link>
                        ,&nbsp;<Link prefetch={false} href="/home-inspection">ตรวจรับบ้าน</Link>
                        ,&nbsp;
                        <Link prefetch={false} href="/landscape">จัดสวนหน้าบ้าน งบน้อย</Link>,&nbsp;
                        <Link prefetch={false} href="/engineering-structural-design/residence">
                          เขียนแบบบ้านชั้นเดียว
                        </Link>
                        ,&nbsp;
                        <Link prefetch={false} href="/architect-and-interior/furniture">
                          ออกแบบเตียงนอน
                        </Link>
                        ,&nbsp;
                        <Link prefetch={false} href="/engineering-structural-design/machine">
                          ถอดแบบเครื่องกล
                        </Link>
                        ,&nbsp;
                        <Link prefetch={false} href="/architect-and-engineer">ดูเพิ่มเติม</Link> */}
                  {homeLanguageData?.architectureEngineeringServices}
                </p>
              </div>
              <div className="block">
                <strong className="mb-2 !important font-[Kanit] text-[#2B323BF2]">
                  {homeLanguageData?.websiteProgramming}
                </strong>
                <p className="mt-[0.5rem] text-[hsl(216,15%,52%)] text-opacity-[var(--cl-opacity)] text-[0.875rem] leading-[1.65] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif]">
                  {/* <Link prefetch={false} href="/ux-ui-design-web-app">ออกแบบเว็บไซต์</Link>
                        ,&nbsp;
                        <Link prefetch={false} href="/web-development/ecommerce">
                          สร้างเว็บขายของ
                        </Link>
                        ,&nbsp;
                        <Link prefetch={false} href="/web-development/instant-builder">
                          เว็บไซต์สำเร็จรูป
                        </Link>
                        ,&nbsp;
                        <Link prefetch={false} href="/desktop-application">รับเขียนโปรแกรม</Link>
                        ,&nbsp;<Link prefetch={false} href="/chatbot">Chatbot Facebook</Link>,&nbsp;
                        <Link prefetch={false} href="/chatbot">สร้างบอทไลน์</Link>,&nbsp;
                        <Link prefetch={false} href="/web-scraping">Website Scraping</Link>,&nbsp;
                        <Link prefetch={false} href="/it-solution-and-support/software">
                          รับลงโปรแกรม
                        </Link>
                        ,&nbsp;<Link prefetch={false} href="/web-programming">ดูเพิ่มเติม</Link> */}
                  {homeLanguageData?.websiteProgrammingServices}
                </p>
              </div>
              <div className="block">
                <strong className="mb-2 !important font-[Kanit] text-[#2B323BF2]">
                  {homeLanguageData?.marketingAdvertising}
                </strong>
                <p className="mt-[0.5rem] text-[hsl(216,15%,52%)] text-opacity-[var(--cl-opacity)] text-[0.875rem] leading-[1.65] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif]">
                  {/* <Link prefetch={false} href="/seo">รับทำ SEO</Link>,&nbsp;
                        <Link prefetch={false} href="/google-ads">โฆษณา Google</Link>,&nbsp;
                        <Link prefetch={false} href="/social-media-ads/facebook-ads">
                          โฆษณา Facebook
                        </Link>
                        ,&nbsp;
                        <Link prefetch={false} href="/social-media-ads/tiktok-ads">
                          โฆษณา TikTok
                        </Link>
                        ,&nbsp;<Link prefetch={false} href="/blogger-netidol">บล็อกเกอร์รีวิว</Link>
                        ,&nbsp;
                        <Link prefetch={false} href="/promote-page/product">โปรโมทสินค้า</Link>
                        ,&nbsp;
                        <Link prefetch={false} href="/focus-group">รับจ้างทดลองสินค้า</Link>,&nbsp;
                        <Link prefetch={false} href="/promote-real-estate">รับฝากขายบ้าน</Link>
                        ,&nbsp;
                        <Link prefetch={false} href="/google-map">ปักหมุด google map</Link>,&nbsp;
                        <Link prefetch={false} href="/marketing-advertising">ดูเพิ่มเติม</Link> */}
                  {homeLanguageData?.marketingAdvertisingServices}
                </p>
              </div>
              <div className="block">
                <strong className="mb-2 !important font-[Kanit] text-[#2B323BF2]">
                  {homeLanguageData?.writingTranslation}
                </strong>
                <p className="mt-[0.5rem] text-[hsl(216,15%,52%)] text-opacity-[var(--cl-opacity)] text-[0.875rem] leading-[1.65] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif]">
                  {/* <Link prefetch={false} href="/translation">แปลภาษา</Link>,&nbsp;
                        <Link prefetch={false} href="/translator">ล่ามแปลภาษา</Link>,&nbsp;
                        <Link prefetch={false} href="/transcription">ถอดไฟล์เสียง</Link>,&nbsp;
                        <Link prefetch={false} href="/content-writing">เขียนคอนเทนต์</Link>,&nbsp;
                        <Link prefetch={false} href="/content-writing/seo">เขียนบทความ SEO</Link>
                        ,&nbsp;
                        <Link prefetch={false} href="/content-writing/foreign-language">
                          เขียนบทความภาษาอังกฤษ
                        </Link>
                        ,&nbsp;
                        <Link prefetch={false} href="/content-writing/thesis-report">
                          รับเขียนรายงาน
                        </Link>
                        ,&nbsp;<Link prefetch={false} href="/proofreading">พิสูจน์อักษร</Link>,&nbsp;
                        <Link prefetch={false} href="/story-writing/poets-and-poems">
                          รับแต่งกลอน
                        </Link>
                        ,&nbsp;<Link prefetch={false} href="/writing-translation">ดูเพิ่มเติม</Link> */}
                  {homeLanguageData?.writingTranslationServices}
                </p>
              </div>
              <div className="block">
                <strong className="mb-2 !important font-[Kanit] text-[#2B323BF2]">
                  {homeLanguageData?.mediaAudio}
                </strong>
                <p className="mt-[0.5rem] text-[hsl(216,15%,52%)] text-opacity-[var(--cl-opacity)] text-[0.875rem] leading-[1.65] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif]">
                  {/* <Link prefetch={false} href="/photography">ตากล้อง</Link>,&nbsp;
                        <Link prefetch={false} href="/photography/wedding">ถ่ายพรีเวดดิ้ง</Link>
                        ,&nbsp;
                        <Link prefetch={false} href="/podcast">สร้าง Podcast</Link>,&nbsp;
                        <Link prefetch={false} href="/sound-engineering/edit-mixing-mastering">
                          ตัดต่อเพลง
                        </Link>
                        ,&nbsp;<Link prefetch={false} href="/videography">ตัดต่อวีดีโอ</Link>,&nbsp;
                        <Link prefetch={false} href="/subtitle">ทำซับไตเติ้ล</Link>,&nbsp;
                        <Link prefetch={false} href="/motion-graphics">Motion Graphic</Link>,&nbsp;
                        <Link prefetch={false} href="/videography/live-streaming">รับไลฟ์สด</Link>
                        ,&nbsp;
                        <Link prefetch={false} href="/animations">ทำอนิเมชั่น</Link>,&nbsp;
                        <Link prefetch={false} href="/voice-over">พากย์เสียง</Link>,&nbsp;
                        <Link prefetch={false} href="/photography-video">ดูเพิ่มเติม</Link> */}
                  {homeLanguageData?.mediaAudioServices}
                </p>
              </div>
              <div className="block">
                <strong className="mb-2 !important font-[Kanit] text-[#2B323BF2]">
                  {homeLanguageData?.businessConsulting}
                </strong>
                <p className="mt-[0.5rem] text-[hsl(216,15%,52%)] text-opacity-[var(--cl-opacity)] text-[0.875rem] leading-[1.65] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif]">
                  {/* <Link prefetch={false} href="/accounting-and-finance/accounting-service">
                          รับทำบัญชี
                        </Link>
                        ,&nbsp;<Link prefetch={false} href="/counseling">รับปรึกษาปัญหาชีวิต</Link>
                        ,&nbsp;
                        <Link prefetch={false} href="/financial-planning">ที่ปรึกษาทางการเงิน</Link>
                        ,&nbsp;
                        <Link prefetch={false} href="/legal">ที่ปรึกษากฎหมาย</Link>,&nbsp;
                        <Link prefetch={false} href="/psychologist">ปรึกษาสุขภาพจิต</Link>,&nbsp;
                        <Link prefetch={false} href="/order-from-china">สั่งสินค้าจากจีน</Link>
                        ,&nbsp;
                        <Link prefetch={false} href="/secretary">เลขาส่วนตัว</Link>,&nbsp;
                        <Link prefetch={false} href="/commercial-registration">จดทะเบียนบริษัท</Link>
                        ,&nbsp;
                        <Link prefetch={false} href="/business">ปรึกษาธุรกิจ</Link>,&nbsp;
                        <Link prefetch={false} href="/consultant">ดูเพิ่มเติม</Link> */}
                  {homeLanguageData?.businessConsultingServices}
                </p>
              </div>
              <div className="block">
                <strong className="mb-2 !important font-[Kanit] text-[#2B323BF2]">
                  {homeLanguageData?.lifestyle}
                </strong>
                <p className="mt-[0.5rem] text-[hsl(216,15%,52%)] text-opacity-[var(--cl-opacity)] text-[0.875rem] leading-[1.65] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif]">
                  {/* <Link prefetch={false} href="/car-inspection">ตรวจรถมือสอง</Link>,&nbsp;
                        <Link prefetch={false} href="/feng-shui">ซินแสดูฮวงจุ้ยบ้าน</Link>,&nbsp;
                        <Link prefetch={false} href="/gaming">รับจ้างเล่นเกม</Link>,&nbsp;
                        <Link prefetch={false} href="/horoscope">ดูดวง</Link>,&nbsp;
                        <Link prefetch={false} href="/makeup">ช่างแต่งหน้า</Link>,&nbsp;
                        <Link prefetch={false} href="/personnal-trainer">จ้างเทรนเนอร์</Link>,&nbsp;
                        <Link prefetch={false} href="/nutrition">ปรึกษานักโภชนาการ</Link>,&nbsp;
                        <Link prefetch={false} href="/singer-band">หานักร้อง</Link>,&nbsp;
                        <Link prefetch={false} href="/trip-planner">รับวางแผนเที่ยว</Link>,&nbsp;
                        <Link prefetch={false} href="/prop-stylist">สไตล์ลิส</Link>,&nbsp;
                        <Link prefetch={false} href="/lifestyle">ดูเพิ่มเติม</Link> */}
                  {homeLanguageData?.lifestyleServices}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

// Memoize the component to prevent unnecessary re-renders
const IntroductionSection = memo(IntroductionSectionComponent);

export default IntroductionSection;
