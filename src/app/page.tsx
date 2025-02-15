import { Metadata } from "next";
import Image from "next/image";
import Footer from "../components/Footer";
import Header from "@/components/Header";
import imgapp from "@/assets/images/img-app.webp";
import apple from "@/assets/icons/apple.svg";
import google from "@/assets/icons/google-play.svg";
import fastwork from "@/assets/images/fastwork-app-qr.webp";
import fastworksymbol from "@/assets/images/fastwork-symbol.svg";

export default function Home() {
  return (
    <>
      <Header />
      <div className="bg-[#E3EDFD]">
        <div
          style={{ backgroundImage: `url(${fastworksymbol.src})` }}
          className="min-h-[342px] bg-no-repeat bg-[105%_30px] grid w-5/6 place-self-start gap-x-8 pt-[140px] grid-cols-[minmax(1rem,_1fr)_minmax(calc(var(--breakpoint-lg)_-_4rem),_calc(var(--breakpoint-lg)_-_4rem))_minmax(1rem,_1fr)] mx-auto grid-rows-auto"
        >
          <div className="grid grid-cols-[7fr_5fr] min-w-0 min-h-0 ">
            <Image
              alt="Download Application"
              loading="lazy"
              decoding="async"
              data-nimg="1"
              className="justify-self-end h-auto max-w-[1140px] max-h-[741px]"
              src={imgapp}
            />{" "}
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
    </>
  );
}

export const metadata: Metadata = {
  title:
    "Fastlance.vn - Tổng hợp freelancer chất lượng hàng đầu cho doanh nghiệp ",
  description:
    "Nền tảng freelancer chất lượng cao cho doanh nghiệp tại Việt Nam.",
};
