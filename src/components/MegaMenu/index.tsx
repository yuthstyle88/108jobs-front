import { MegaMenuImage } from "@/constants/images";
import {
  faArrowRight,
  faBuilding,
  faChevronRight,
  faStarAndCrescent,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

const mega_freelancer = [
  {
    icon: MegaMenuImage.search,
    title: "ค้นหา และจ้างด้วยตัวเอง",
    description: "เลือกดูฟรีแลนซ์ที่ต้องการ และแชทได้ทันที",
  },
  {
    icon: MegaMenuImage.job,
    title: "โพสต์หาผ่านบอร์ดประกาศงาน",
    description: "โพสต์ และรอฟรีแลนซ์มาเสนองานได้เลย",
  },
  {
    icon: MegaMenuImage.chat,
    title: "ผู้ช่วยค้นหาฟรีแลนซ์ แค่แอดไลน์",
    description: "บริการ Chat to hire หรือผู้ช่วยค้นหาฟรีแลนซ์",
  },
];
const mega_business = [
  {
    icon: MegaMenuImage.company,
    title: "ค้นหา และจ้างด้วยตัวเอง",
    description: "เลือกดูฟรีแลนซ์ที่ต้องการ และแชทได้ทันที",
  },
  {
    icon: MegaMenuImage.business,
    title: "โพสต์หาผ่านบอร์ดประกาศงาน",
    description: "โพสต์ และรอฟรีแลนซ์มาเสนองานได้เลย",
  },
];

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

const MegaMenu = () => {
  return (
    <div className="grid-container-desktop w-full">
      <div className="col-start-2 col-end-3 flex">
        <div className="flex flex-col gap-2 ">
          <div className="">
            <div className="items-center mb-2 flex gap-x-2">
              <FontAwesomeIcon
                icon={faStarAndCrescent}
                className="w-3 h-3 inline-flex items-center justify-center cursor-pointer"
              />
              <span className="text-[0.875rem] font-semibold text-[rgba(43,50,59,.6)]">
                การจ้างงาน
              </span>
            </div>
            {mega_freelancer.map((freelancer, index) => (
              <div key={index} className="group hover:bg-[#F6F9FE] ">
                <Link href="#" className="w-[450px] rounded-md gap-[1.5rem] flex items-center p-4">
                  <Image src={freelancer.icon} alt="search" className="w-9" />
                  <div className="gap-x-1 flex flex-col flex-1 ">
                    <span className="text-[0.875rem] font-medium text-text_primary group-hover:text-third">
                      {freelancer.title}
                    </span>
                    <span className="text-[0.75rem] text-[rgba(43,50,59,.6)]">
                      {freelancer.description}
                    </span>
                  </div>
                  <div>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="w-2 h-2 inline-flex items-center justify-center cursor-pointer"
                    />
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <div className="">
            <div className="items-center mb-2 flex gap-x-2">
              <FontAwesomeIcon
                icon={faBuilding}
                className="w-3 h-3  inline-flex items-center justify-center cursor-pointer"
              />
              <span className="text-[0.875rem] font-semibold text-[rgba(43,50,59,.6)]">
                สำหรับลูกค้าบริษัท
              </span>
            </div>
            {mega_business.map((freelancer, index) => (
              <div key={index} className="text-third hover:bg-[#F6F9FE]">
                <Link href="#" className="w-[450px] rounded-md gap-[1.5rem] flex items-center p-4">
                  <Image src={freelancer.icon} alt="search" className="w-9" />
                  <div className="gap-x-1 flex flex-col flex-1">
                    <span className="text-[0.875rem] font-medium">
                      {freelancer.title}
                    </span>
                    <span className="text-[0.75rem] text-[rgba(43,50,59,.6)]">
                      {freelancer.description}
                    </span>
                  </div>
                  <div>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="w-2 h-2 inline-flex items-center justify-center cursor-pointer"
                    />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div>
          <hr className="w-[0.0625rem] mx-8 h-full inline-block bg-[#e8eeea] m-0" />
        </div>
        <div className="flex flex-col w-[420px] mt-8">
          <span className="text-third font-medium">
            เลือกดูฟรีแลนซ์ที่ต้องการ และแชทได้ทันที
          </span>
          <p className="mt-3 text-[0.875rem] text-text_secondary font-sans">
            ค้นหาฟรีแลนซ์ตามหมวดหมู่ ดูผลงาน รีวิว
            และแชทเพื่อจ้างฟรีแลนซ์ด้วยตัวเอง
          </p>
          <div className="mt-6">
            <span className="text-[0.875rem] font-medium text-text_primary">
              ประเภทงานยอดนิยม
            </span>
            <div className="mt-2 flex flex-col gap-1 mr-4">
              {job.map((job, index) => (
                <Link href="#"
                  key={index}
                  className="text-[0.875rem] text-text_secondary px-2 py-[6px] flex-1 flex items-center justify-between rounded-sm transition-all duration-150 ease-in-out"
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
        <div className="flex flex-col mt-8 ml-8">
          <Image src={MegaMenuImage.job_bg} alt="job" className="align-top " />
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
