"use client";
import { API_ROUTES } from "@/api/endpoints";
import Error from "@/app/error";
import CategoryFilter from "@/components/CategoryDetail/components/CategoryFilter";
import CategoryFooter from "@/components/CategoryDetail/components/CategoryFooter";
import CategoryRelated from "@/components/CategoryDetail/components/CategoryRelated";
import NotFoundJob from "@/components/CategoryDetail/components/NotFoundJob";
import SubCategory from "@/components/CategoryDetail/components/SubCategory";
import FilterSection from "@/components/FilterSection";
import JobCard from "@/components/JobCard";
import Loading from "@/components/Loading";
import { Pagination } from "@/components/Pagination";
import SortSection from "@/components/SortSection";
import JobCardSkeleton from "@/components/ui/JobCardSkeleton";
import { CategoriesIcon } from "@/constants/icons";
import { CategoriesImage } from "@/constants/images";
import { LanguageFile } from "@/constants/language";
import { usePrivateFetchParams } from "@/hooks/api-hooks";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { JobList, Tags } from "@/types/jobSearch";
import buildQueryParams from "@/utils/buildJobQueryParams";
import { interpolateDouble } from "@/utils/interpolate";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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

const CategoryDetail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const selectedTag = searchParams.get("q") || "";
  const minPrice = searchParams.get("min_price");
  const maxPrice = searchParams.get("max_price");
  const rating = searchParams.get("rating") || "";
  const sort = searchParams.get("sort_by") || "";
  const titleSearch = searchParams.get("title_search") || "";

  const encodedTitleSearch = encodeURIComponent(titleSearch);

  const queryParams = buildQueryParams({
    min_price: minPrice ? parseFloat(minPrice) : undefined,
    max_price: maxPrice ? parseFloat(maxPrice) : undefined,
    rating,
    sort_by: sort,
    page: currentPage,
    limit: 10,
    q: selectedTag,
    title_search: encodedTitleSearch,
  });

  const {
    data: jobCategoryLanguage,
    isLoading,
    error,
  } = useGlobalTranslate(LanguageFile.JOB_CATEGORY);

  const {
    data: searchResults,
    isLoading: isJobListLoading,
    error: errorJobList,
  } = usePrivateFetchParams<JobList>(
    `${API_ROUTES.job.get_job_by_id}?${queryParams}`
  );

  const serviceCategoryId = searchResults?.service_categories?.[0]?.id ?? null;

  const { data: tagsData, isLoading: isTagLoading } =
    usePrivateFetchParams<Tags>(
      serviceCategoryId
        ? `${API_ROUTES.job.get_tags_by_id}/${serviceCategoryId}`
        : null
    );

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

    if (!tag) {
      newParams.delete("q");
    } else {
      newParams.set("q", tag);
    }

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

  if (isLoading || !jobCategoryLanguage || !searchResults) return <Loading />;

  if (error || errorJobList) return <Error/>;

  return (
    <>
      <section className="grid-container-job h-12 bg-[#E3EDFD]">
        <Link prefetch={false}
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
        <div className="col-start-2 col-end-auto flex flex-row items-center gap-2 mb-2 sm:mb-6 mt-4 ">
          <h1 className="text-[20px] md:text-[32px] text-text_primary font-semibold ">
            Search results “ {titleSearch} ” in
          </h1>
          <Link prefetch={false} href={`/categories`}>
            <h3 className="text-third underline text-[20px] md:text-[32px] font-semibold">
              {jobCategoryLanguage?.all_job_types}
            </h3>
          </Link>
        </div>
      </section>

      {!isTagLoading && tagsData?.tags && tagsData.tags.length > 0 && (
        <section className="grid-container-job overflow-x-auto pb-4">
          <SubCategory
            language={jobCategoryLanguage}
            tagList={tagsData.tags}
            selectedTag={selectedTag}
            onSelectTag={handleTagChange}
          />
        </section>
      )}

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
                job_number: searchResults.jobs.length,
              })}
            </div>
            <div>
              {interpolateDouble(jobCategoryLanguage?.page_info || "", {
                current_page: searchResults.page,
                total_pages: searchResults.total_pages,
              })}
            </div>
          </div>
          <div className="col-start-2 col-end-auto text-[0.875rem] text-text_primary font-sans">
            {isJobListLoading ? (
              <section className="col-start-2 col-end-auto grid grid-cols-1 sm:grid-cols-[repeat(2,minmax(1px,1fr))] md:grid-cols-[repeat(3,minmax(1px,1fr))] lg:grid-cols-[repeat(4,minmax(1px,1fr))] 2xl:grid-cols-[repeat(5,minmax(1px,1fr))] gap-[0.75rem] md:gap-5">
                {Array.from({ length: 20 }).map((_, index) => (
                  <JobCardSkeleton key={index} />
                ))}
              </section>
            ) : searchResults.jobs.length === 0 ? (
              <NotFoundJob language={jobCategoryLanguage} />
            ) : (
              <section className="col-start-2 col-end-auto grid grid-cols-1 sm:grid-cols-[repeat(2,minmax(1px,1fr))] md:grid-cols-[repeat(3,minmax(1px,1fr))] lg:grid-cols-[repeat(4,minmax(1px,1fr))] 2xl:grid-cols-[repeat(5,minmax(1px,1fr))] gap-[0.75rem] md:gap-5">
                {searchResults.jobs.map((job, index) => (
                  <JobCard data={job} key={index} />
                ))}
              </section>
            )}
          </div>

          <section className="flex justify-center col-start-2 col-end-auto mt-12">
            {searchResults.total_pages > 1 && (
              <Pagination
                totalPages={searchResults.total_pages}
                currentPage={searchResults.page}
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
