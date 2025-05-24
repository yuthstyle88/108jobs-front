"use client";
import BreadCrumb from "@/components/BreadCrumb";

import "swiper/css";
import "swiper/css/navigation";
import AsideJob from "./AsideJob";
import SliderJob from "./SliderJob";
import TabNavigation from "../TabNavigation";
import Overview from "./Overview";
import Package from "./Package";
import Freelance from "./Freelance";
import Review from "./Review";
import { CategoriesImage } from "@/constants/images";
import CategoryRelated from "../CategoryDetail/components/CategoryRelated";
import CategoryCard from "../CategoryDetail/components/CategoryCard";
import { LanguageFile } from "@/constants/language";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import Loading from "../Loading";

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

const JobDetail = () => {
  const {
    data: jobDetailLanguage,
    isLoading,
    error,
  } = useGlobalTranslate(LanguageFile.JOB_DETAIL);

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading language data</div>;
  return (
    <>
      <section className="grid-container-job">
        <BreadCrumb />
      </section>
      <section className="grid-container-job pb-4 pt-4 sm:pt-10 min-h-[200vh]">
        <div className="col-start-2 col-end-auto grid grid-cols-1 xl:grid-cols-[1fr_20rem] gap-x-10 gap-y-6">
          <div className="max-w-[850px] h-full relative">
            <SliderJob />
            <div className="block pt-4 xl:pt-0 xl:hidden">
              <AsideJob language={jobDetailLanguage} />
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
                <Overview language={jobDetailLanguage} key="overview" />
                <Package language={jobDetailLanguage} key="package" />
                <Freelance language={jobDetailLanguage} key="freelance" />
                <Review language={jobDetailLanguage} key="review" />
              </TabNavigation>
            </div>
          </div>
          <div className="hidden xl:block">
            <AsideJob language={jobDetailLanguage} />
          </div>
        </div>
      </section>
      <section className="bg-[#F6F7F8]">
        <section className="grid-container-job">
          <div className="col-start-2 col-end-auto pb-6">
            <div className="mt-6">
              <h2 className="text-[1.5rem] text-text_primary font-medium pb-6">
                {jobDetailLanguage?.similar_jobs}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-[repeat(4,minmax(1px,1fr))] grid-rows-[1fr] gap-[1.25rem] my-3 ">
                {Array.from({ length: 4 }, (_, index) => (
                  <CategoryCard key={index} />
                ))}
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
