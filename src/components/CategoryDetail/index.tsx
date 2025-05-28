"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BreadCrumb from "@/components/BreadCrumb";
import CategoryFilter from "@/components/CategoryDetail/components/CategoryFilter";
import CategoryFooter from "@/components/CategoryDetail/components/CategoryFooter";
import CategoryRelated from "@/components/CategoryDetail/components/CategoryRelated";
import SubCategory from "@/components/CategoryDetail/components/SubCategory";
import { Pagination } from "@/components/Pagination";
import { CategoriesIcon } from "@/constants/icons";
import { CategoriesImage } from "@/constants/images";
import Image from "next/image";
import Link from "next/link";
import FilterSection from "../FilterSection";
import SortSection from "../SortSection";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { LanguageFile } from "@/constants/language";
import Loading from "../Loading";
import { interpolateDouble } from "@/utils/interpolate";
import { API_ROUTES } from "@/api/endpoints";
import { usePrivateFetchParams } from "@/hooks/api-hooks";
import { JobList } from "@/types/jobSearch";
import JobCard from "../JobCard";
import NotFoundJob from "./components/NotFoundJob";
import buildQueryParams from "@/utils/buildJobQueryParams";

const category_related = [
  {
    image: CategoriesImage.wordpress,
    title: "ทำเว็บไซต์ Wordpress เว็บสำเร็จรูป",
  },
  { image: CategoriesImage.google, title: "ทำโฆษณา Google Ads" },
  {
    image: CategoriesImage.promote,
    title: "โปรโมทเพจ Facebook / IG / Youtube",
  },
  { image: CategoriesImage.marketing, title: "เป็นที่ปรึกษาการตลาด" },
];

type Props = {
  slug: string;
};
const CategoryDetail = ({ slug }: Props) => {
  console.log("CategoryDetail rendered with slug:", slug);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const selectedTag = searchParams.get("q") || "";
  const serviceCategoryId = searchParams.get("service_category_id") || "";
  const minPrice = searchParams.get("min_price");
  const maxPrice = searchParams.get("max_price");
  const rating = searchParams.get("rating") || "";
  const sort = searchParams.get("sort_by") || "";

  const queryParams = buildQueryParams({
    min_price: minPrice ? parseFloat(minPrice) : undefined,
    max_price: maxPrice ? parseFloat(maxPrice) : undefined,
    rating,
    sort_by: sort,
    page: currentPage,
    limit: 10,
    service_category_id: serviceCategoryId,
    q: selectedTag,
  });

  const {
    data: jobList,
    isLoading: isJobListLoading,
    error: errorJobList,
  } = usePrivateFetchParams<JobList>(
    `${API_ROUTES.job.get_job_by_slug}?${queryParams}`
  );

  const {
    data: jobCategoryLanguage,
    isLoading,
    error,
  } = useGlobalTranslate(LanguageFile.JOB_CATEGORY);

  const [isSticky, setIsSticky] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 320);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("page", page.toString());
    router.push(`?${newParams.toString()}`);
  };

  const handleTagChange = (tag: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("q", tag);
    newParams.set("page", "1");
    router.push(`?${newParams.toString()}`);
  };

  const handleFilterChange = (filter: {
    min_price?: number;
    max_price?: number;
    rating?: string;
  }) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (filter.min_price === undefined) newParams.delete("min_price");
    else newParams.set("min_price", filter.min_price.toString());

    if (filter.max_price === undefined) newParams.delete("max_price");
    else newParams.set("max_price", filter.max_price.toString());

    if (!filter.rating) newParams.delete("rating");
    else newParams.set("rating", filter.rating);

    newParams.set("page", "1");
    router.push(`?${newParams.toString()}`);
  };

  const handleSortChange = (sort: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (!sort) newParams.delete("sort_by");
    else newParams.set("sort_by", sort);
    newParams.set("page", "1");
    router.push(`?${newParams.toString()}`);
  };

  const breadcrumbItems = [
    { label: "ประเภทงานทั้งหมด", href: "/categories" },
    { label: "การตลาดและโฆษณา", href: "/marketing" },
    { label: "ทำ SEO", href: "/marketing/seo" },
    ...(selectedTag ? [{ label: `${selectedTag}` }] : []),
  ];

  if (isLoading || isJobListLoading) return <Loading />;
  if (error || errorJobList || !jobList) return <div>Error loading data</div>;

  return (
    <>
      <section className="grid-container-job h-12 bg-[#E3EDFD]">
        <Link
          href="#"
          className="col-start-2 col-end-auto flex justify-center items-center gap-3"
        >
          <Image src={CategoriesIcon.guaranteed} alt="guaranteed" width={22} />
          <p className="text-base font-medium">
            <span className="text-third">
              {jobCategoryLanguage?.safe_no_scam}{" "}
            </span>
            <span className="text-text_primary">
              {jobCategoryLanguage?.support_throughout}
            </span>
          </p>
        </Link>
      </section>

      <section className="grid-container-job pt-2 sm:pt-0">
        <BreadCrumb items={breadcrumbItems} />
        <div className="col-start-2 col-end-auto">
          <h1 className="mb-2 sm:mb-6 mt-4 text-[20px] md:text-[32px] text-text_primary font-semibold">
            ทำ SEO
          </h1>
        </div>
      </section>

      <section className="grid-container-job overflow-x-auto pb-4">
        <SubCategory selectedTag={selectedTag} onSelectTag={handleTagChange} />
      </section>

      <section
        className={`grid-container-job sticky top-[110px] sm:top-[70px] overflow-hidden bg-white z-10 transition-shadow duration-300 ${
          isSticky ? "shadow-filterSection" : ""
        }`}
      >
        <div className="col-start-2 col-end-auto">
          <div className="flex justify-between items-center pt-3 pb-3">
            <div className="inline-grid grid-flow-col justify-start gap-x-2">
              <FilterSection
                language={jobCategoryLanguage}
                onFilterChange={handleFilterChange}
                currentFilters={{
                  min_price: minPrice ? parseFloat(minPrice) : undefined,
                  max_price: maxPrice ? parseFloat(maxPrice) : undefined,
                  rating,
                }}
              />
              <SortSection
                language={jobCategoryLanguage}
                currentSort={sort}
                onSortChange={handleSortChange}
              />
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
                job_number: jobList.jobs.length,
              })}
            </div>
            <div>
              {interpolateDouble(jobCategoryLanguage?.page_info || "", {
                current_page: jobList.page,
                total_pages: jobList.total_pages,
              })}
            </div>
          </div>
          <div className="col-start-2 col-end-auto text-[0.875rem] text-text_primary font-sans">
            {jobList.jobs.length === 0 ? (
              <NotFoundJob />
            ) : (
              <>
                <section className="col-start-2 col-end-auto grid grid-cols-1 sm:grid-cols-[repeat(2,minmax(1px,1fr))] md:grid-cols-[repeat(3,minmax(1px,1fr))] lg:grid-cols-[repeat(4,minmax(1px,1fr))] 2xl:grid-cols-[repeat(5,minmax(1px,1fr))] gap-[0.75rem] md:gap-5">
                  {jobList.jobs.map((job, index) => (
                    <JobCard data={job} key={index} />
                  ))}
                </section>
              </>
            )}
          </div>
          <section className="flex justify-center col-start-2 col-end-auto mt-12">
            {jobList.total_pages > 1 && (
              <Pagination
                totalPages={jobList.total_pages}
                currentPage={jobList.page}
                onPageChange={handlePageChange}
              />
            )}
          </section>
          <section className="col-start-2 col-end-auto mt-12">
            <h2 className="mb-6 text-text_primary font-medium text-[1.5rem] leading-[1.15]">
              {interpolateDouble(
                jobCategoryLanguage?.categories_related_to_job_type || "",
                { job_type: "SEO" }
              )}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-[repeat(4,minmax(1px,1fr))] gap-[1.25rem] my-3">
              {category_related.map((category, index) => (
                <CategoryRelated items={category} key={index} />
              ))}
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
