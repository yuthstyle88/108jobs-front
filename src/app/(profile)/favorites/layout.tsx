import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SubMenu from "@/components/SubMenu";
import { ReactNode } from "react";
import { defaultMetadata } from "@/config/metadata";
import SpHeader from "@/containers/SpHeader";

interface ProfileLayoutProps {
  children: ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
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
  title: "Fastwork.co แหล่งรวมฟรีแลนซ์คุณภาพอันดับ 1 ที่ธุรกิจทั่วไทยเลือกใช้",
  description:
    "คัดเฉพาะฟรีแลนซ์ผู้เชี่ยวชาญกว่า 5 หมื่นคน รับประกันได้งานตรงทุกความต้องการโดยทีมงานมืออาชีพ ที่ได้รับความไว้ใจจากลูกค้ากว่า 3 แสนราย ให้เราช่วยพัฒนาธุรกิจคุณ!",
  openGraph: {
    ...defaultMetadata.openGraph,
    title:
      "Fastwork.co แหล่งรวมฟรีแลนซ์คุณภาพอันดับ 1 ที่ธุรกิจทั่วไทยเลือกใช้",
    description:
      "คัดเฉพาะฟรีแลนซ์ผู้เชี่ยวชาญกว่า 5 หมื่นคน รับประกันได้งานตรงทุกความต้องการโดยทีมงานมืออาชีพ ที่ได้รับความไว้ใจจากลูกค้ากว่า 3 แสนราย ให้เราช่วยพัฒนาธุรกิจคุณ!",
  },
};
