"use client";
import { API_ROUTES } from "@/api/endpoints";
import BreadCrumb from "@/components/BreadCrumb";
import { CategoriesIcon } from "@/constants/icons";
import { CategoriesImage } from "@/constants/images";
import { LanguageFile } from "@/constants/language";
import { usePrivateFetchParams } from "@/hooks/api-hooks";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { JobDetailResponse } from "@/types/jobDetail";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import CategoryRelated from "../CategoryDetail/components/CategoryRelated";
import Loading from "../Loading";
import TabNavigation from "../TabNavigation";
import AsideJob from "./AsideJob";
import Freelance from "./Freelance";
import Overview from "./Overview";
import Package from "./Package";
import Review from "./Review";
import SliderJob from "./SliderJob";

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

type Props = {
  slug: string;
  username: string;
};

const JobDetail = ({ username, slug }: Props) => {
  const {
    data: jobDetailLanguage,
    isLoading,
    error,
  } = useGlobalTranslate(LanguageFile.JOB_DETAIL);

  const {
    data: jobCategoryLanguage,
    isLoading: isLoadingCategory,
    error: errorCategory,
  } = useGlobalTranslate(LanguageFile.JOB_CATEGORY);

  const {
    data: jobDetailData,
    isLoading: isJobDetailLoading,
    error: errorJobDetail,
  } = usePrivateFetchParams<JobDetailResponse>(
    `${API_ROUTES.job.get_job_detail_by_id}/${username}/${slug}`
  );

  const jobImages = jobDetailData?.images ?? [];

  const catalogTitle = jobDetailData?.service_catalog.title || "";
  const categoryTitle = jobDetailData?.service_type.title || "";
  const catalogSlug = jobDetailData?.service_catalog.slug || "";
  const categorySlug = jobDetailData?.service_type.slug || "";

  const breadcrumbItems = [
    { label: "ประเภทงานทั้งหมด", href: "/categories" },
    ...(catalogTitle
      ? [{ label: catalogTitle, href: `/categories/${catalogSlug}` }]
      : []),
    ...(categoryTitle
      ? [
          {
            label: categoryTitle,
            href: `/job/${categorySlug}`,
            forceLink: true,
          },
        ]
      : []),
  ];

  if (isLoading || isLoadingCategory || isJobDetailLoading) return <Loading />;
  if (error || errorCategory || errorJobDetail)
    return <div>Error loading language data</div>;
  return (
    <>
      <section className="grid-container-job-detail my-4 px-4 py-2  h-16 md:h-12 md:p-0 md:my-0 bg-[#E3EDFD]">
        <Link
          href="#"
          className="col-start-2 col-end-auto flex justify-center items-center gap-3"
        >
          <Image src={CategoriesIcon.guaranteed} alt="guaranteed" width={22} />
          <p className="text-base font-medium text-center ">
            <span className="text-third">
              {jobCategoryLanguage?.safe_no_scam}{" "}
            </span>
            <span className="text-text_primary">
              {jobCategoryLanguage?.support_throughout}
            </span>
          </p>
        </Link>
      </section>
      <section className="grid-container-job-detail">
        <BreadCrumb items={breadcrumbItems} />
      </section>
      <section className="grid-container-job-detail pb-4 pt-4 sm:pt-10 min-h-[200vh]">
        <div className="col-start-2 col-end-auto grid grid-cols-1 xl:grid-cols-[1fr_20rem] gap-x-10 gap-y-6">
          <div className="max-w-[850px] h-full relative">
            {jobImages.length > 0 && <SliderJob images={jobImages} />}
            <div className="block pt-4 xl:pt-0 xl:hidden">
              {jobDetailData && (
                <AsideJob data={jobDetailData} language={jobDetailLanguage} />
              )}
            </div>
            <div className="pt-4 md:pt-12 relative h-full">
              <TabNavigation
                tabLabel={[
                  jobDetailLanguage?.overview_tab || "Overview",
                  jobDetailLanguage?.package_tab || "Packages",
                  jobDetailLanguage?.freelancer || "Reviews",
                  jobDetailLanguage?.review || "Reviews",
                ]}
              >
                {jobDetailData && (
                  <Overview
                    data={jobDetailData}
                    language={jobDetailLanguage}
                    key="overview"
                  />
                )}
                {jobDetailData && (
                  <Package
                    data={jobDetailData}
                    language={jobDetailLanguage}
                    key="package"
                  />
                )}
                {jobDetailData && (
                  <Freelance
                    data={jobDetailData}
                    language={jobDetailLanguage}
                    key="freelance"
                  />
                )}
                {jobDetailData && (
                  <Review
                    data={jobDetailData}
                    language={jobDetailLanguage}
                    key="review"
                  />
                )}
              </TabNavigation>
            </div>
          </div>
          <div className="hidden xl:block">
            {jobDetailData && (
              <AsideJob data={jobDetailData} language={jobDetailLanguage} />
            )}
          </div>
        </div>
      </section>
      <section className="bg-[#F6F7F8]">
        <section className="grid-container-job-detail">
          <div className="col-start-2 col-end-auto pb-6">
            <div className="mt-6">
              <h2 className="text-[1.5rem] text-text_primary font-medium pb-6">
                {jobDetailLanguage?.similar_jobs}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-[repeat(4,minmax(1px,1fr))] grid-rows-[1fr] gap-[1.25rem] my-3 ">
                {/* {Array.from({ length: 4 }, (_, index) => (
                  <CategoryCard key={index} />
                ))} */}
              </div>
            </div>
          </div>
          <div className="col-start-2 col-end-auto pb-2 md:pb-6">
            <div>
              <h2 className="text-[1.5rem] text-text_primary font-medium pb-6">
                {jobDetailLanguage?.other_jobs_section}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-[repeat(4,minmax(1px,1fr))] gap-[1.25rem] my-3">
                {category_related.map((category, index) => (
                  <CategoryRelated items={category} key={index} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default JobDetail;
