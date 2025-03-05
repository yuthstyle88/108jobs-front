import JobDetail from "@/components/JobDetail";
import { defaultMetadata } from "@/config/metadata";

const JobDetailPage = () => {
  
  return (
    <JobDetail/>
  );
};

export default JobDetailPage;

export const metadata = {
  ...defaultMetadata,
  title: "เพิ่ม Traffic และ Backlink คุณภาพสูง ดัน Web ติดอันดับ SEO เร่ง index KW ให้ติดรัวๆ",
  description:
    "หามืออาชีพรับทำ SEO ให้เว็บไซต์ติดหน้าแรกบน Google สร้างโอกาสทางการตลาด เพิ่มยอดขายให้ธุรกิจ การันตีคุณภาพ ที่ Fastwork.co แหล่งรวมผู้เชี่ยวชาญที่พร้อมช่วยคุณ",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "เพิ่ม Traffic และ Backlink คุณภาพสูง ดัน Web ติดอันดับ SEO เร่ง index KW ให้ติดรัวๆ",
    description:
      "หามืออาชีพรับทำ SEO ให้เว็บไซต์ติดหน้าแรกบน Google สร้างโอกาสทางการตลาด เพิ่มยอดขายให้ธุรกิจ การันตีคุณภาพ ที่ Fastwork.co แหล่งรวมผู้เชี่ยวชาญที่พร้อมช่วยคุณ",
  },
};