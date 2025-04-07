import { useLanguageStore } from "@/store/useLanguageStore";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const job = [
  {
    title: "ทำ SEO",
  },
  {
    title: "Logo",
  },
  {
    title: "Web development",
  },
  {
    title: "เขียนแบบวิศวกรรมและออกแบบโครงสร้าง",
  },
  {
    title: "รับจัดดอกไม้",
  },
  {
    title: "ดูดวง โหราศาสตร์ ความเชื่อ",
  },
  {
    title: "แม่บ้าน ทำความสะอาด",
  },
  {
    title: "ล้างแอร์",
  },
];

const Find = () => {
  const { languageData:globalLanguageData } = useLanguageStore();
  return (
    <div className="flex flex-col w-[420px] mt-8">
      <span className="text-third font-medium">
        {globalLanguageData?.global?.hint_label_menu_option_find_hire}
      </span>
      <p className="mt-3 text-[0.875rem] text-text_secondary font-sans">
        ค้นหาฟรีแลนซ์ตามหมวดหมู่ ดูผลงาน รีวิว และแชทเพื่อจ้างฟรีแลนซ์ด้วยตัวเอง
      </p>
      <div className="mt-6">
        <span className="text-[0.875rem] font-medium text-text_primary">
          ประเภทงานยอดนิยม
        </span>
        <div className="mt-2 flex flex-col mr-4">
          {job.map((job, index) => (
            <Link
              href="/seo"
              key={index}
              className="text-[0.875rem] text-text_secondary px-2 py-[4px] flex-1 flex items-center justify-between rounded-sm transition-all duration-150 ease-in-out"
            >
              {job.title}
              <FontAwesomeIcon
                icon={faArrowRight}
                className="text-[rgba(43,50,59,.4)]"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Find;
