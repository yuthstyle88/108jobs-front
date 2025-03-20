import Header from "@/components/Header";
import { defaultMetadata } from "@/config/metadata";
import AccountSettingWrapper from "@/container/AccountSettingWrapper";
import { ReactNode } from "react";
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
        <div className="grid-container-desktop w-full min-h-screen py-8 bg-[#F6F7F8]">
          <div className="col-start-2 col-end-3">
            <div className="grid-cols-[286px_1fr] grid gap-6 items-start">
              <AccountSettingWrapper />
              <div className="">
                {children}
              </div>
            </div>
          </div>
        </div>
      </section>
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
