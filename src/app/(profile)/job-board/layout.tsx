import Header from "@/components/Header";
import { ReactNode } from "react";
import { defaultMetadata } from "@/config/metadata";
interface ConsentManagementLayoutProps {
  children: ReactNode;
}

export default function ProfileLayout({
  children,
}: ConsentManagementLayoutProps) {
  return (
    <>
      <Header type="primary" />
      <section className="pt-[4.5rem] bg-white min-h-screen">
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

