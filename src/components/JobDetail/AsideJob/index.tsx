"use client";
import { JobDetailIcon } from "@/constants/icons";
import { JobDetailLanguage } from "@/types/language";
import { scrollToElementById } from "@/utils/scrollSmooth";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface PackageInfo {
  price: string;
  title: string;
  description: string;
}

interface AsideJobProps {
  language: Partial<JobDetailLanguage> | undefined | null;
}

const AsideJob = ({ language }: AsideJobProps) => {
  const [selectedPackage, setSelectedPackage] = useState(0);

   const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      scrollToElementById("package");
    };

  const packages: PackageInfo[] = [
    {
      price: "฿1,600",
      title: "แพ็กเกจ : เพิ่ม Traffic 30 วัน ดันอันดับ เร่ง Index",
      description:
        "Traffic Package ทุก Package Traffic ทำงาน 30 วันค่ะ Traffic Package 6,000 Traffic View เหมาะสำหรับเว็บคู่แข่งน้อย 1,600 บาท 1 Link 1 Keyword",
    },
    {
      price: "฿2,600",
      title: "แพ็กเกจ: Backlink Package ดันอันดับ เร่ง Index",
      description:
        "Backlink Package ใช้เวลาทำงานไม่เกิน 5 วันคะ QUALITY BLOG COMMENTS เหมาะสำหรับ...",
    },
    {
      price: "฿3,600",
      title:
        "แพ็กเกจ: Traffic + Backlink Offpage SEO mix ขั้นเทพ ออกแบบตามความต้องการ ดันหน้า 1",
      description:
        "สูตรที่ 1 ทำ SEO ระดับความยากสี่ ชุดเริ่มต้น Keyword ลูกน้อย เว็บใหม่ เว็บต้องการตั้งตัว...",
    },
  ];

  return (
    <aside className="text-black sticky top-40 self-start">
      <div className="bg-[#F6F9FE] rounded-md shadow-jobCard p-4">
        <div className="flex items-center ">
          <div className="mr-4">
            <Image
              src={JobDetailIcon.guarantee}
              alt="guarantee"
              className="w-16 h-[45px]"
            />
          </div>
          <div className="">
            <strong className="text-third ">
              {language?.fastwork_guarantee}
            </strong>
            <p className="mt-1 text-[0.75rem] text-text_secondary font-sans">
              {language?.fastwork_guarantee_description}
            </p>
            <Link href="#" className="text-third text-[0.75rem] font-sans">
              {language?.read_additional_protection_terms}
            </Link>
          </div>
        </div>
      </div>
      <div className="rounded-md overflow-hidden mt-4 shadow-jobCard ">
        <section className="grid-cols-[1fr_1fr_1fr] grid min-w-0 min-h-0">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`relative ${
                selectedPackage === index
                  ? "bg-white text-[#1a73e8]"
                  : "bg-[#F6F7F8] text-[#8793a6]"
              } py-5 text-center cursor-pointer ${
                index === 0 ? "rounded-tl-md" : ""
              } ${index === 2 ? "rounded-tr-md" : ""}`}
              onClick={() => setSelectedPackage(index)}
            >
              <strong>{pkg.price}</strong>
            </div>
          ))}
        </section>
        <section className="p-6 bg-white">
          <h3 className="font-medium text-third">
            {packages[selectedPackage].title}
          </h3>
          <p className="line-clamp-2 text-ellipsis overflow-hidden break-words mt-2 text-[0.875rem] text-text_secondary font-sans ">
            {packages[selectedPackage].description}
          </p>
          <Link
            href="/seo/job-detail#package"
            onClick={(e) => handleClick(e)}
            className="text-third mt-2 font-semibold text-[0.875rem] cursor-pointer font-sans"
          >
            {language?.view_package_info}
          </Link>
          <hr className="mt-4 bg-border_primary block overflow-visible w-full h-[1px] m-0" />
          <button className="relative inline-flex justify-center items-center overflow-hidden min-h-[2.5rem] px-[1.125rem] border-none rounded-[0.25rem] bg-third text-[0.875rem] font-medium w-full text-white">
            <span>{language?.chat_with_freelancers}</span>
          </button>
          <div className="text-center mt-2">
            <small className="text-[0.75rem] text-text_secondary">
              {language?.no_charges_message}
            </small>
          </div>
        </section>
      </div>
      <div className="mt-4 overflow-hidden shadow-jobCard rounded-[0.5rem] ">
        <Link href="#">
          <div className="aspect-[320/68] h-[68px] w-full relative">
            <Image src={JobDetailIcon.company} alt="company" className="" />
          </div>
        </Link>
      </div>
      <div className="grid grid-cols-[1fr_1fr] text-center mt-4 font-medium text-text_secondary ">
        <div className="flex flex-row items-center justify-center min-w-[34px] border-r-1 border-border_primary p-2 cursor-pointer">
          <FontAwesomeIcon icon={faHeart} className="text-text_secondary" />
          <p className="ml-2 cursor-pointer text-center">{language?.save}</p>
        </div>
        <div className="flex flex-row items-center justify-center min-w-[34px] p-2 cursor-pointer">
          <FontAwesomeIcon icon={faShareAlt} className="text-text_secondary" />
          <p className="ml-2 cursor-pointer text-center">{language?.share}</p>
        </div>
      </div>
    </aside>
  );
};

export default AsideJob;
