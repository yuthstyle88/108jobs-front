import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ReactNode } from "react";
import { defaultMetadata } from "@/config/metadata";

interface StartSellingLayoutProps {
  children: ReactNode;
}

export default function StartSellingLayout({ children }: StartSellingLayoutProps) {
  return (
    <>
      <Header type="primary" />
      <section className="pt-[4.4rem] bg-white">
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
    title: "Fastwork.co แหล่งรวมฟรีแลนซ์คุณภาพอันดับ 1 ที่ธุรกิจทั่วไทยเลือกใช้",
    description:
      "คัดเฉพาะฟรีแลนซ์ผู้เชี่ยวชาญกว่า 5 หมื่นคน รับประกันได้งานตรงทุกความต้องการโดยทีมงานมืออาชีพ ที่ได้รับความไว้ใจจากลูกค้ากว่า 3 แสนราย ให้เราช่วยพัฒนาธุรกิจคุณ!",
  },
};
