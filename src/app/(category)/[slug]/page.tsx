import BreadCrumb from "@/components/BreadCrumb";
import SubCategory from "@/components/SubCategory";
import { CategoriesIcon } from "@/constants/icons";
import { faFilter, faUpDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

const SpecificCategory = () => {
  return (
    <>
      <section className="grid grid-cols-[1fr_1216px_1fr] h-12 bg-[#E3EDFD] ">
        <Link href="#" className="col-start-2 col-end-auto flex justify-center items-center gap-3">
          <Image src={CategoriesIcon.guaranteed} alt="guaranteed" width={22} />
          <p className="text-base font-medium ">
            <span className="text-primary">ปลอดภัย ไม่โดนโกง </span>
            <span className="text-third">ดูแลตลอดการจ้างงาน</span>
          </p>
        </Link>
      </section>
      <section className="grid grid-cols-[1fr_1216px_1fr]">
        <BreadCrumb />
        <div className="col-start-2 col-end-auto ">
          <h1 className="mb-6 mt-4 text-[32px] text-text_primary font-semibold">
            ทำ SEO
          </h1>
        </div>
      </section>
      <section className="grid grid-cols-[1fr_1216px_1fr] pb-4">
        <SubCategory />
        <div className="col-start-2 col-end-auto ">
          <div className="flex justify-between items-center pt-3 pb-3">
            <div className="inline-grid grid-flow-col justify-start gap-x-2">
              <div className="filter-button">
                <FontAwesomeIcon icon={faFilter} className="text-third pr-2" />
                ตัวกรอง
              </div>
              <div className="filter-button">
                <FontAwesomeIcon icon={faUpDown} className="text-third pr-2" />
                เรียงตาม
              </div>
            </div>
            {/* <div className="inline-grid grid-flow-col justify-start gap-x-2">
              <div className="filter-button">
                <FontAwesomeIcon icon={faFilter} className="text-third pr-2" />
                ตัวกรอง
              </div>
              <div className="filter-button">
                <FontAwesomeIcon icon={faUpDown} className="text-third pr-2" />
                เรียงตาม
              </div>
            </div> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default SpecificCategory;
