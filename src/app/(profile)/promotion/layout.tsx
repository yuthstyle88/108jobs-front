import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SubMenu from "@/components/SubMenu";
import { ReactNode } from "react";
import { defaultMetadata } from "@/config/metadata";
import SpHeader from "@/containers/SpHeader";

interface PromotionLayoutProps {
  children: ReactNode;
}

export default function PromotionLayout({ children }: PromotionLayoutProps) {
  return (
    <>
      <div className="hidden sm:block">
        <Header type="primary" />
      </div>
      <div className="block sm:hidden">
        <SpHeader showSearch={false}/>
      </div>
      <section className="pt-[3rem] sm:pt-[4.5rem] bg-white">
        <div className="hidden sm:block">
          <SubMenu />
        </div>
        {children}
      </section>
      <Footer />
    </>
  );
}

export const metadata = {
  ...defaultMetadata,
  title: "โปรโมชันและสิทธิพิเศษสำหรับผู้ใช้งานบน Fastwork.co",
  description:
    "รวบรวมโปรโมชัน คูปองส่วนลด (Coupon) และสิทธิพิเศษอีกมากมายสำหรับผู้ใช้งานบนแพลตฟอร์ม ที่ Fastwork.co แหล่งรวมฟรีแลนซ์ผู้เชี่ยวชาญ ที่พร้อมช่วยคุณ",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "โปรโมชันและสิทธิพิเศษสำหรับผู้ใช้งานบน Fastwork.co",
    description:
      "รวบรวมโปรโมชัน คูปองส่วนลด (Coupon) และสิทธิพิเศษอีกมากมายสำหรับผู้ใช้งานบนแพลตฟอร์ม ที่ Fastwork.co แหล่งรวมฟรีแลนซ์ผู้เชี่ยวชาญ ที่พร้อมช่วยคุณ",
  },
};
