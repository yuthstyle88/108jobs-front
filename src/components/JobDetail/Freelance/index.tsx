import { JobDetailIcon } from "@/constants/icons";
import { JobDetailImage } from "@/constants/images";
import { JobDetailLanguage } from "@/types/language";
import Image from "next/image";
import Link from "next/link";

type Props = {
  language: Partial<JobDetailLanguage> | undefined | null;
};




const Freelance = ({ language }: Props) => {

  const freelancer = [
  {
    title: language?.work_completed,
    icon: JobDetailIcon.completed,
    percentage: "100%",
  },
  {
    title: language?.can_be_sold,
    icon: JobDetailIcon.sold,
    percentage: `1.2K ${language?.times}`,
  },
  {
    title: language?.re_hiring,
    icon: JobDetailIcon.response,
    percentage: `596 ${language?.times}`,
  },
  {
    title: language?.respond,
    icon: JobDetailIcon.hiring,
    percentage: `2 ${language?.minutes}`,
  },
];
  return (
    <div className="grid grid-cols-[1fr] gap-y-6">
      <h2 className="text-[1.25rem] text-third font-medium">{language?.freelancer}</h2>
      <div className="mx-auto bg-white rounded-xl border-border_primary border-1 shadow-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <Link href="/user/profile" className="flex items-start space-x-4">
            <Image
              src={JobDetailImage.freelancer_avt}
              alt="Profile"
              className="w-[88px] h-[88px] rounded-full object-cover"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg text-text_primary font-semibold">
                  taratra
                </h2>
                <button className="px-3 py-1 text-blue-600 border border-blue-600 rounded-lg text-sm hover:bg-blue-50">
                  {language?.view_profile}
                </button>
              </div>
              <p className="text-gray-600 text-sm mt-1 leading-relaxed font-sans text-text_secondary">
                ประสบการณ์กว่า 10 ปี ทางด้าน Digital Marketing
                ยิงโฆษณาให้เรื่องการทำ SEO สามขาเน้น ความเป็นธรรมชาติ สามารถใช้
                HTML CSS SASS ได้ ทำ Keyword ติดหน้าแรกมาแล้วกว่า 100000 KW จาก
                2000+ Website ปัจจุบันเป็น Freelance ให้คำปรึกษาหลาย ๆ ทั้งในเกม
                อสังหา โรงงาน โรงแรม Shipping แฟชั่น คลินิก
              </p>
            </div>
          </Link>
        </div>

        <div className="flex items-center justify-between mt-6 pt-6 border-t">
          {freelancer.map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center space-x-2">
              <Image
                src={item.icon}
                alt="icon"
                className="h-6"
              />
              <div>
                <div className="text-text_secondary font-sans">
                  {item.title}
                </div>
                <div className="text-blue-600 font-semibold">{item.percentage}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Freelance;
