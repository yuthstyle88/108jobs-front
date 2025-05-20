import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SubMenu from "@/components/SubMenu";
import { defaultMetadata } from "@/config/metadata";
import SpHeader from "@/containers/SpHeader";
import { LayoutProps } from "@/types/layout";

export default function StartSellingLayout({
  children,
}: LayoutProps) {
  return (
    <>
      <div className="hidden sm:block">
        <Header type="primary" />
      </div>
      <div className="block sm:hidden">
        <SpHeader showSearch={false} />
      </div>

      <section className="pt-[3rem] md:pt-[4.5rem] bg-white">
        <div className="hidden md:block">
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
  title: "สมัครเป็นฟรีแลนซ์ อิสระของการทำงานที่คุณเลือกเองได้ | Fastwork.co",
  description:
    "ฟรีแลนซ์ฟาสต์เวิร์ค เพิ่มโอกาสถูกจ้างงานผ่านการค้นหาบน Google เข้าถึงโบนัสและสิทธิพิเศษมากมาย มีทีมงานคอยให้ความช่วยเหลือเพื่อมอบประสบการณ์ที่ดีที่สุดให้คุณ!",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "สมัครเป็นฟรีแลนซ์ อิสระของการทำงานที่คุณเลือกเองได้ | Fastwork.co",
    description:
      "ฟรีแลนซ์ฟาสต์เวิร์ค เพิ่มโอกาสถูกจ้างงานผ่านการค้นหาบน Google เข้าถึงโบนัสและสิทธิพิเศษมากมาย มีทีมงานคอยให้ความช่วยเหลือเพื่อมอบประสบการณ์ที่ดีที่สุดให้คุณ!",
  },
};
