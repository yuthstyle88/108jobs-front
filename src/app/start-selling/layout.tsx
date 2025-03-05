import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SubMenu from "@/components/SubMenu";
import { ReactNode } from "react";
import { defaultMetadata } from "@/config/metadata";

interface StartSellingLayoutProps {
  children: ReactNode;
}

export default function StartSellingLayout({ children }: StartSellingLayoutProps) {
  return (
    <>
      <Header type="primary" />

      <section className="pt-[4.5rem] bg-white">
        <SubMenu />
        {children}
      </section>
      <Footer />
    </>
  );
}

export const metadata = {
  ...defaultMetadata,
  title: "สมัครเป็นฟรีแลนซ์ อิสระของการทำงานที่คุณเลือกเองได้ | Fastwork.co",
  description: "ฟรีแลนซ์ฟาสต์เวิร์ค เพิ่มโอกาสถูกจ้างงานผ่านการค้นหาบน Google เข้าถึงโบนัสและสิทธิพิเศษมากมาย มีทีมงานคอยให้ความช่วยเหลือเพื่อมอบประสบการณ์ที่ดีที่สุดให้คุณ!",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "สมัครเป็นฟรีแลนซ์ อิสระของการทำงานที่คุณเลือกเองได้ | Fastwork.co",
    description:
      "ฟรีแลนซ์ฟาสต์เวิร์ค เพิ่มโอกาสถูกจ้างงานผ่านการค้นหาบน Google เข้าถึงโบนัสและสิทธิพิเศษมากมาย มีทีมงานคอยให้ความช่วยเหลือเพื่อมอบประสบการณ์ที่ดีที่สุดให้คุณ!",
  },
};
