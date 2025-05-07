import Header from "@/components/Header";
import { defaultMetadata } from "@/config/metadata";
import AccountSettingWrapper from "@/containers/AccountSettingWrapper";
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
        <SpHeader showSearch={false} />
      </div>

      <section className="min-h-screen pt-[3rem] sm:pt-[4.5rem] bg-[#F6F7F8]">
        <div className="grid-container-desktop-banner w-full pt-6 pb-16 px-4 sm:px-0 sm:py-8">
          <div className="col-start-2 col-end-3">
            <div className="grid-cols-1 sm:grid-cols-[286px_1fr] grid gap-6 items-start">
              <AccountSettingWrapper />
              <div className="">{children}</div>
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
