import {defaultMetadata} from "@/config/metadata";
import SpProfile from "@/containers/SpProfile";
import {getAppName} from "@/utils/appConfig";

const Profile = () => {
  return (
    <>
      <SpProfile/>
    </>
  );
};

export default Profile;

export const metadata = {
  ...defaultMetadata,
  title: "รับทำ SEO ให้ติดหน้าแรกบน Google - จ้างมืออาชีพได้ที่ "+getAppName(),
  description:
    "หามืออาชีพรับทำ SEO ให้เว็บไซต์ติดหน้าแรกบน Google สร้างโอกาสทางการตลาด เพิ่มยอดขายให้ธุรกิจ การันตีคุณภาพ ที่ "+getAppName()+" แหล่งรวมผู้เชี่ยวชาญที่พร้อมช่วยคุณ",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "รับทำ SEO ให้ติดหน้าแรกบน Google - จ้างมืออาชีพได้ที่ "+getAppName(),
    description:
      "หามืออาชีพรับทำ SEO ให้เว็บไซต์ติดหน้าแรกบน Google สร้างโอกาสทางการตลาด เพิ่มยอดขายให้ธุรกิจ การันตีคุณภาพ ที่ "+getAppName()+" แหล่งรวมผู้เชี่ยวชาญที่พร้อมช่วยคุณ",
  },
};
