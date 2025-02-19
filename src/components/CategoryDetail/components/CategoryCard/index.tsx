import { CategoriesImage } from "@/constants/images";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";


const CategoryCard = () => {
  return (
    <Link href="#" className="flex cursor-pointer ">
      <div className="flex w-full items-stretch ">
        <div className="border-1 border-border_primary w-full flex flex-col overflow-hidden rounded-md bg-white cursor-pointer transition-all ease-in-out duration-150">
          <div className="relative aspect-[3/2] ">
            <Image
              src={CategoriesImage.seo_job}
              alt="seo"
              className="relative object-cover w-full bg-[#e8eaee] aspect-[3/2] align-top"
            />
            <div className="flex flex-1 flex-col p-2 bg-white">
              <h3 className="overflow-hidden max-h-9 leading-[1.25em] text-text_primary text-clip break-words font-normal text-sm font-sans">
                เพิ่ม Traffic และ Backlink คุณภาพสูง ดัน Web ติดอันดับ SEO เร่ง
                index KW ให้ติดรัวๆ
              </h3>
              <div className="flex flex-row items-center mt-2 text-[12px] ">
                <div className="text-text_secondary font-sans">
                  <span>ขายได้ 1.2K</span>
                </div>
                <div className="pl-2 ml-2 border-l-1 border-[#2b323b66] flex">
                  <div className="w-[14px] inline-flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faStar}
                      className="text-[#e9b10c] font-extrabold"
                    />
                  </div>
                  <span className="text-[12px] font-sans text-text_secondary">
                    4.9 (921)
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-[0.625rem]">
                <Image
                  src={CategoriesImage.specialist}
                  alt="seo"
                  className="h-[1.125rem] w-fit align-top"
                />
                <Image
                  src={CategoriesImage.badge_rehire}
                  alt="badge_rehire"
                  className="h-[1.125rem] w-fit align-top"
                />
              </div>
            </div>
            <div className="mt-2 flex gap-1 items-end min-h-10 pt-1 px-2 pb-3 bg-white font-sans">
              <div className="text-text_secondary text-[0.75rem] overflow-hidden text-ellipsis whitespace-nowrap">
                ตอบกลับภายใน 2 นาที
              </div>
              <div className="flex flex-col items-end min-w-fit ml-auto text-text_secondary overflow-hidden text-ellipsis whitespace-nowrap">
                <span className=" text-[0.75rem]">เริ่มต้น</span>
                <span className=" text-[0.75rem] text-third text-right break-words">
                  ฿1,600
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
