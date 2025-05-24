import { JobDetailIcon } from "@/constants/icons";
import { JobDetailLanguage } from "@/types/language";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

type Props = {
  language: Partial<JobDetailLanguage> | undefined | null;
};
const Package = ({ language }: Props) => {
  return (
    <div id="package" className="grid grid-cols-[1fr] gap-y-6">
      <h2 className="text-[1.25rem] text-third font-medium">
        {language?.package_details} เพิ่ม Traffic และ Backlink คุณภาพสูง ดัน Web ติดอันดับ SEO
        เร่ง index KW ให้ติดรัวๆ
      </h2>
      <div className="px-6 pt-6 pb-4 border-[0.0625rem] border-border_primary rounded-[0.25rem]">
        <div className="flex flex-row justify-between text-third">
          <h3>
            <strong>เพิ่ม Traffic 30 วัน ดันอันดับ เร่ง Index</strong>
          </h3>
          <strong>฿1,600</strong>
        </div>
        <div className="mt-2 text-[0.875rem] text-text_secondary flex flex-row gap-2 items-center font-sans">
          <FontAwesomeIcon icon={faCalendar} className="text-text_secondary" />
          <p>ระยะเวลาในการทำงาน 5 วัน</p>
        </div>
        <div className="pt-4 text-[14px] font-sans text-text_primary">
          <h2 className="">Traffic Package</h2>
          <p className="mb-4">ทุก Package Traffic ทำงาน 30 วันค่ะ</p>

          <div className="grid gap-6">
            <div className="">
              <p className="">Traffic Package 6,000 Traffic View</p>
              <p>เหมาะสำหรับเว็บคู่แข่งน้อย</p>
              <p className="">1,600 บาท</p>
              <p>1 Link</p>
              <p>1 Keyword</p>
            </div>

            <div className="">
              <h3 className="">Traffic Package 30,000 Traffic View</h3>
              <p>เหมาะสำหรับเว็บคู่แข่งปานกลาง</p>
              <p className="">7,500 บาท</p>
              <p>5 Link</p>
              <p>5 Keyword</p>
            </div>

            <div className="">
              <h3 className="">Traffic Package 100,000 Traffic View</h3>
              <p>เหมาะสำหรับเว็บคู่แข่งสูง</p>
              <p className="">20,000 บาท</p>
              <p>10 Link</p>
              <p>10 Keyword</p>
            </div>
          </div>
          <p className="mb-4">เรามีตัวนับ Traffic view ย้อนหลัง 30 วันค่ะ</p>
          <p>
            การทำ สัญญาณ Offpage SEO สมควรทำคู่กันระหว่าง Traffic กับ Backlink
            ผสานกันแบบเป็นธรรมชาติจะได้ผลดีที่สุดค่ะ
          </p>
        </div>
        <hr className="my-4 bg-border_primary block overflow-visible w-full h-[1px] m-0" />
        <div className="flex justify-end items-end">
          <button className="relative inline-flex justify-center items-center overflow-hidden min-h-[2.5rem] px-[1.125rem] border-none rounded-[0.25rem] bg-third text-[0.875rem] font-medium w-fit text-white">
            <span>{language?.chat_with_freelancers}</span>
          </button>
        </div>
      </div>
      <div className="mt-4 shadow-md">
        <Image
          src={JobDetailIcon.company_hiring}
          alt="company"
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default Package;
