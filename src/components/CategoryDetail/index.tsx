"use client";
import BreadCrumb from "@/components/BreadCrumb";
import CategoryCard from "@/components/CategoryDetail/components/CategoryCard";
import CategoryFilter from "@/components/CategoryDetail/components/CategoryFilter";
import CategoryFooter from "@/components/CategoryDetail/components/CategoryFooter";
import CategoryRelated from "@/components/CategoryDetail/components/CategoryRelated";
import SubCategory from "@/components/CategoryDetail/components/SubCategory";
import { Pagination } from "@/components/Pagination";
import { CategoriesIcon } from "@/constants/icons";
import { CategoriesImage } from "@/constants/images";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import FilterSection from "../FilterSection";
import SortSection from "../SortSection";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { LanguageFile } from "@/constants/language";
import Loading from "../Loading";
import { interpolateDouble } from "@/utils/interpolate";

const category_related = [
  {
    image: CategoriesImage.wordpress,
    title: "ทำเว็บไซต์ Wordpress เว็บสำเร็จรูป",
  },
  {
    image: CategoriesImage.google,
    title: "ทำโฆษณา Google Ads",
  },
  {
    image: CategoriesImage.promote,
    title: "โปรโมทเพจ Facebook / IG / Youtube",
  },
  {
    image: CategoriesImage.marketing,
    title: "เป็นที่ปรึกษาการตลาด",
  },
];

const CategoryDetail = () => {
  const {
    data: jobCategoryLanguage,
    isLoading,
    error,
  } = useGlobalTranslate(LanguageFile.JOB_CATEGORY);

  const [currentPage, setCurrentPage] = useState(1);
  const TOTAL_PAGES = 6;

  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 320);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading language data</div>;

  return (
    <>
      <section className="grid-container-job h-12 bg-[#E3EDFD] ">
        <Link
          href="#"
          className="col-start-2 col-end-auto flex justify-center items-center gap-3"
        >
          <Image src={CategoriesIcon.guaranteed} alt="guaranteed" width={22} />
          <p className="text-base font-medium ">
            <span className="text-third">ปลอดภัย ไม่โดนโกง </span>
            <span className="text-text_primary">ดูแลตลอดการจ้างงาน</span>
          </p>
        </Link>
      </section>
      <section className="grid-container-job pt-2 sm:pt-0">
        <BreadCrumb />
        <div className="col-start-2 col-end-auto ">
          <h1 className="mb-2 sm:mb-6 mt-4 text-[20px] md:text-[32px] text-text_primary font-semibold">
            ทำ SEO
          </h1>
        </div>
      </section>
      <section className="grid-container-job overflow-x-auto pb-4">
        <SubCategory />
      </section>
      <section
        className={`grid-container-job sticky top-[110px] sm:top-[70px] overflow-hidden bg-white z-10 transition-shadow duration-300 ${
          isSticky ? "shadow-filterSection" : ""
        }`}
      >
        <div className="col-start-2 col-end-auto">
          <div className=" flex justify-between items-center pt-3 pb-3">
            <div className="inline-grid grid-flow-col justify-start gap-x-2">
              <FilterSection language={jobCategoryLanguage} />
              <SortSection language={jobCategoryLanguage} />
            </div>
            <CategoryFilter />
          </div>
        </div>
      </section>
      <section className="pb-10 mt-4">
        <div className="grid-container-job">
          <div className="flex justify-between col-start-2 col-end-auto mb-3 text-[0.875rem] text-text_primary font-sans">
            <div>
              {interpolateDouble(jobCategoryLanguage?.found_jobs || "", {
                job_number: 4,
              })}
            </div>
            <div>
              {interpolateDouble(jobCategoryLanguage?.page_info || "", {
                current_page: 1,
                total_pages: 4,
              })}
            </div>
          </div>
          <section className="col-start-2 col-end-auto grid grid-cols-1 md:grid-cols-[repeat(4,minmax(1px,1fr))] gap-[0.75rem] md:gap-5">
            {Array.from({ length: 16 }, (_, index) => (
              <CategoryCard key={index} />
            ))}
          </section>
          <section className="flex justify-center col-start-2 col-end-auto mt-12">
            <Pagination
              totalPages={TOTAL_PAGES}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </section>
          <section className="col-start-2 col-end-auto mt-12 ">
            <div>
              <h2 className="mb-6 text-text_primary font-medium text-[1.5rem] leading-[1.15] p-0 m-0">
                {interpolateDouble(
                  jobCategoryLanguage?.categories_related_to_job_type || "",
                  {
                    job_type: "SEO",
                  }
                )}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-[repeat(4,minmax(1px,1fr))] grid-rows-[1fr] gap-[1.25rem] my-3 ">
                {category_related.map((category, index) => (
                  <CategoryRelated items={category} key={index} />
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>
      <section className="grid-container-job pt-3 pb-12 bg-[#f6f7f8]">
        <CategoryFooter />
      </section>
    </>
  );
};

export default CategoryDetail;
