import Header from "@/components/Header";
import { defaultMetadata } from "@/config/metadata";
import SpHeader from "@/containers/SpHeader";
import { ReactNode } from "react";
interface ConsentManagementLayoutProps {
  children: ReactNode;
}

export default function ProfileLayout({
  children,
}: ConsentManagementLayoutProps) {
  return (
    <>
      <div className="hidden sm:block">
        <Header type="primary" />
      </div>
      <div className="block sm:hidden">
        <SpHeader />
      </div>
      <section className="pt-[5.5rem] sm:pt-[4.5rem] bg-white min-h-screen">
        {children}
      </section>
    </>
  );
}

export const metadata = {
  ...defaultMetadata,
  title: "หาฟรีแลนซ์ที่ตอบโจทย์ธุรกิจ",
  description:
    "บอร์ดประกาศงานสำหรับค้นหาฟรีแลนซ์ที่ใช่ รวมไปถึงฟรีแลนซ์ได้เลือกงานที่ชอบ ง่าย สะดวก ปลอดภัย ที่ fastwork แพลตฟอร์มรวมผู้เชี่ยวชาญกว่า 100 หมวดหมู่เพื่อธุรกิจคุณ",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "หาฟรีแลนซ์ที่ตอบโจทย์ธุรกิจ",
    description:
      "บอร์ดประกาศงานสำหรับค้นหาฟรีแลนซ์ที่ใช่ รวมไปถึงฟรีแลนซ์ได้เลือกงานที่ชอบ ง่าย สะดวก ปลอดภัย ที่ fastwork แพลตฟอร์มรวมผู้เชี่ยวชาญกว่า 100 หมวดหมู่เพื่อธุรกิจคุณ",
  },
};
