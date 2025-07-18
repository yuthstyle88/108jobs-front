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
import { JobList, Tags } from "@/types/jobSearch";
import JobCard from "../JobCard";
import NotFoundJob from "./components/NotFoundJob";
import buildQueryParams from "@/utils/buildJobQueryParams";
import { ServiceCatalogData } from "@/types/catalog";
import { Category } from "@/types/category";
import JobCardSkeleton from "../ui/JobCardSkeleton";
import Error from "@/app/error";

const categoryRelated = [
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
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const selectedTag = searchParams.get("q") || "";
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const rating = searchParams.get("rating") || "";
  const sort = searchParams.get("sortBy") || "";

  const {
    data: jobCategoryLanguage,
    isLoading,
    error,
  } = useGlobalTranslate(LanguageFile.JOB_CATEGORY);

  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    error: errorCategory,
  } = usePrivateFetchParams<Category[]>(
    `${API_ROUTES.job.getCategoryBySlug}/${slug}`
  );

  const serviceCategoryId = categoryData?.[0]?.id || "";
  const categoryTitle = categoryData?.[0]?.title || "";

  const {
    data: catalogData,
    isLoading: isCatalogLoading,
    error: errorCatalog,
  } = usePrivateFetchParams<ServiceCatalogData>(
    serviceCategoryId
      ? `${API_ROUTES.job.getCatalogById}/${serviceCategoryId}`
      : null
  );

  const catalogTitle = catalogData?.serviceCatalogs?.[0]?.name || "";
  const catalogSlug = catalogData?.serviceCatalogs?.[0]?.slug || "";

  const { data: tagsData, isLoading: isTagLoading } =
    usePrivateFetchParams<Tags>(
      serviceCategoryId
        ? `${API_ROUTES.job.getTagsById}/${serviceCategoryId}`
        : null
    );

  const queryParams = buildQueryParams({
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    rating,
    sortBy: sort,
    page: currentPage,
    limit: 10,
    serviceCategoryId: serviceCategoryId,
    q: selectedTag,
  });

  const {
    data: jobList,
    isLoading: isJobListLoading,
    error: errorJobList,
  } = usePrivateFetchParams<JobList>(
    serviceCategoryId ? `${API_ROUTES.job.getJobById}?${queryParams}` : null
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
    minPrice?: number;
    maxPrice?: number;
    rating?: string;
  }) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (filter.minPrice === undefined) newParams.delete("minPrice");
    else newParams.set("minPrice", filter.minPrice.toString());

    if (filter.maxPrice === undefined) newParams.delete("maxPrice");
    else newParams.set("maxPrice", filter.maxPrice.toString());

    if (!filter.rating) newParams.delete("rating");
    else newParams.set("rating", filter.rating);

    newParams.set("page", "1");
    router.push(`?${newParams.toString()}`);
  };

  const handleSortChange = (sort: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (!sort) newParams.delete("sortBy");
    else newParams.set("sortBy", sort);
    newParams.set("page", "1");
    router.push(`?${newParams.toString()}`);
  };

  const breadcrumbItems = [
    { label: jobCategoryLanguage?.allJobTypes || "", href: "/categories" },
    ...(catalogTitle
      ? [{ label: catalogTitle, href: `/categories/${catalogSlug}` }]
      : []),
    ...(categoryTitle ? [{ label: categoryTitle, href: `/job/${slug}` }] : []),
    ...(selectedTag ? [{ label: selectedTag }] : []),
  ];

  if (isLoading || !jobCategoryLanguage || !jobList) return <Loading />;

  if (error || errorJobList || errorCategory || errorCatalog)
    return <Error/>;

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
              {jobCategoryLanguage?.safeNoScam}{" "}
            </span>
            <span className="text-text-primary">
              {jobCategoryLanguage?.supportThroughout}
            </span>
          </p>
        </Link>
      </section>

      <section className="grid-container-job pt-2 sm:pt-0">
        {(!isCategoryLoading || !isCatalogLoading) && (
          <BreadCrumb items={breadcrumbItems} />
        )}
        <div className="col-start-2 col-end-auto">
          <h1 className="mb-2 sm:mb-6 mt-4 text-[20px] md:text-[32px] text-text-primary font-semibold">
            {categoryTitle} Service, Hire Freelancer to {categoryTitle}
          </h1>
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
          isSticky ? "shadow-filter-section" : ""
        }`}
      >
        <div className="col-start-2 col-end-auto">
          <div className="flex justify-between items-center pt-3 pb-3">
            <div className="inline-grid grid-flow-col justify-start gap-x-2">
              <FilterSection
                language={jobCategoryLanguage}
                onFilterChange={handleFilterChange}
                currentFilters={{
                  minPrice: minPrice ? parseFloat(minPrice) : undefined,
                  maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
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
          <div className="flex justify-between col-start-2 col-end-auto mb-3 text-[0.875rem] text-text-primary font-sans">
            <div>
              {interpolateDouble(jobCategoryLanguage?.foundJobs || "", {
                jobNumber: jobList.jobs.length,
              })}
            </div>
            <div>
              {interpolateDouble(jobCategoryLanguage?.pageInfo || "", {
                currentPage: jobList.page,
                totalPages: jobList.totalPages,
              })}
            </div>
          </div>
          <div className="col-start-2 col-end-auto text-[0.875rem] text-text-primary font-sans">
            {isJobListLoading ? (
              <section className="col-start-2 col-end-auto grid grid-cols-1 sm:grid-cols-[repeat(2,minmax(1px,1fr))] md:grid-cols-[repeat(3,minmax(1px,1fr))] lg:grid-cols-[repeat(4,minmax(1px,1fr))] 2xl:grid-cols-[repeat(5,minmax(1px,1fr))] gap-[0.75rem] md:gap-5">
                {Array.from({ length: 20 }).map((_, index) => (
                  <JobCardSkeleton key={index} />
                ))}
              </section>
            ) : jobList.jobs.length === 0 ? (
              <NotFoundJob language={jobCategoryLanguage}/>
            ) : (
              <section className="col-start-2 col-end-auto grid grid-cols-1 sm:grid-cols-[repeat(2,minmax(1px,1fr))] md:grid-cols-[repeat(3,minmax(1px,1fr))] lg:grid-cols-[repeat(4,minmax(1px,1fr))] 2xl:grid-cols-[repeat(5,minmax(1px,1fr))] gap-[0.75rem] md:gap-5">
                {jobList.jobs.map((job, index) => (
                  <JobCard data={job} key={index} />
                ))}
              </section>
            )}
          </div>

          <section className="flex justify-center col-start-2 col-end-auto mt-12">
            {jobList.totalPages > 1 && (
              <Pagination
                totalPages={jobList.totalPages}
                currentPage={jobList.page}
                onPageChange={handlePageChange}
              />
            )}
          </section>
          <section className="col-start-2 col-end-auto mt-12">
            <h2 className="mb-6 text-text-primary font-medium text-[1.5rem] leading-[1.15]">
              {interpolateDouble(
                jobCategoryLanguage?.categoriesRelatedToJobType || "",
                { jobType: "SEO" }
              )}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-[repeat(4,minmax(1px,1fr))] gap-[1.25rem] my-3">
              {categoryRelated.map((category, index) => (
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
