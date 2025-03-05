import CategoryDetail from "@/components/CategoryDetail";
import { defaultMetadata } from "@/config/metadata";
const SpecificCategory = () => {
  return (
    <>
      <CategoryDetail />
    </>
  );
};

export default SpecificCategory;

export const metadata = {
  ...defaultMetadata,
  title: "รับทำ SEO ให้ติดหน้าแรกบน Google - จ้างมืออาชีพได้ที่ Fastwork.co",
  description:
    "หามืออาชีพรับทำ SEO ให้เว็บไซต์ติดหน้าแรกบน Google สร้างโอกาสทางการตลาด เพิ่มยอดขายให้ธุรกิจ การันตีคุณภาพ ที่ Fastwork.co แหล่งรวมผู้เชี่ยวชาญที่พร้อมช่วยคุณ",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "รับทำ SEO ให้ติดหน้าแรกบน Google - จ้างมืออาชีพได้ที่ Fastwork.co",
    description:
      "หามืออาชีพรับทำ SEO ให้เว็บไซต์ติดหน้าแรกบน Google สร้างโอกาสทางการตลาด เพิ่มยอดขายให้ธุรกิจ การันตีคุณภาพ ที่ Fastwork.co แหล่งรวมผู้เชี่ยวชาญที่พร้อมช่วยคุณ",
  },
};
