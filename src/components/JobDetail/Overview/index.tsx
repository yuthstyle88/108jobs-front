import { JobDetailIcon } from "@/constants/icons";
import { CategoriesImage } from "@/constants/images";
import { JobDetailLanguage } from "@/types/language";
import { interpolateDouble } from "@/utils/interpolate";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

type Props = {
  language: Partial<JobDetailLanguage> | undefined | null;
};

const Overview = ({ language }: Props) => {
  return (
    <section>
      <h1 className="text-[1.5rem] text-third font-medium leading-[1.15]">
        เพิ่ม Traffic และ Backlink คุณภาพสูง ดัน Web ติดอันดับ SEO เร่ง index KW
        ให้ติดรัวๆ
      </h1>
      <div className="flex flex-wrap mt-3 gap-3">
        <div className="pr-2 border-r-1 border-r-border_primary flex items-center">
          <span className="font-sans text-text_primary">
            {interpolateDouble(language?.sold_12k_times || "", {
              sell_count: "1.2k",
            })}
          </span>
        </div>
        <div className="pr-2 border-r-1 border-r-border_primary flex items-center">
          <FontAwesomeIcon icon={faStar} className="text-[#E9B10C]" />
          <span className="ml-1 font-sans text-text_primary">4.9</span>
        </div>
        <Link href="#" className="">
          <Image
            src={CategoriesImage.specialist}
            alt="badge_rehire"
            className="h-6 w-full"
          />
        </Link>
        <Link href="#" className="">
          <Image
            src={CategoriesImage.badge_rehire}
            alt="badge_rehire"
            className="h-6 w-full"
          />
        </Link>
      </div>
      <div className="px-3 py-2 gap-x-2 flex rounded-lg bg-[#F6F7F8] items-center my-6 ">
        <Image
          src={JobDetailIcon.icon_rehire}
          alt="icon_rehire"
          className="w-8 h-8"
        />
        <div className="text-[0.875rem] text-text_primary font-sans">
          {language?.employers_trust}
        </div>
      </div>
      <hr className="mt-4 bg-border_primary block overflow-visible w-full h-[1px] m-0" />
      <div className="break-words whitespace-pre-wrap m-0 leading-[1.65]  mt-6">
        <div className="text-text_primary font-sans">
          <p className="">best SEO 168 สวัสดีค่ะ</p>

          <p className="mb-4">
            บริการ SEO ขั้นเทพ
            <br />
            บริการ Offpage SEO ครบวงจร
          </p>

          <ul className="list-disc pl-6 mb-4">
            <li>ประสบการณ์ทำงานทางด้าน SEO</li>
            <li>รับทำ SEO ทุกรูปแบบ ประสบการณ์ มากกว่า 10 ปี</li>
            <li>ทำ SEO มามากกว่า 200 เว็บ</li>
            <li>บริการวิเคราะห์การ ทำ SEO ให้ฟรีค่ะ</li>
            <li>ปรึกษาเรื่องการทำ SEO สอบถามได้มาได้เลยค่ะ</li>
          </ul>

          <p className="mb-4">
            บริการ Traffic และ Backlink
            <br />
            ลูกค้าแจ้ง <br />
            1. Link website ของลูกค้า
            <br />
            2. Keyword ที่ต้องการทำ SEO
          </p>

          <hr className="my-4" />

          <p className="mb-4">รับทำ SEO ทุกรูปแบบ ครบครัน</p>

          <hr className="my-4" />

          <p className="mb-4">
            <strong>Traffic Package</strong>
            <br />
            ทุก Package Traffic ทำงาน 30 วันค่ะ
          </p>

          <p className="mb-4">
            <strong>Traffic</strong>
            <br />
            ทำแบบธรรมชาติ SEO สายขาว 100% <br />
            ไม่โดน Google แบนแน่นอน <br />
            keyword ความยาก SuperHard <br />
            ติดหน้า 1 ไม่พอยังทนนาน
          </p>

          <hr className="my-4" />
          <p className="mb-4">
            <strong>Backlink Package</strong>
            <br />
            ใช้เวลาทำงานไม่เกิน 5 วันค่ะ
          </p>

          <p className="mb-4">
            <strong>QUALITY BLOG COMMENTS</strong>
            <br />
            เหมาะกับเว็บใหม่ <br />
            เหมาะกับเว็บคู่แข่งน้อย <br />
            หรือ ดัน BACKLINK สู้คู่แข่ง
          </p>

          <p className="mb-4">
            <strong>DOFOLLOW BLOG COMMENTS</strong>
            <br />
            เหมาะกับเว็บอันดับอยู่แล้ว <br />
            ต้องการดันอันดับขึ้นหน้าแรก
          </p>

          <p className="mb-4">
            <strong>HIGH PA BLOG COMMENTS</strong>
            <br />
            เหมาะกับเว็บอันดับอยู่แล้ว <br />
            ต้องการดันอันดับขึ้นหน้าแรก
          </p>

          <hr className="my-4" />

          <p>
            การทำ สัญญาณ Offpage SEO สมควรทำคู่กันระหว่าง Traffic กับ Backlink
            ผสานกันแบบเป็นธรรมชาติจะได้ผลดีที่สุดค่ะ
          </p>
        </div>
      </div>
    </section>
  );
};

export default Overview;
