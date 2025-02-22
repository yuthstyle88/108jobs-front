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
  return (
    <>
      <section className="grid grid-cols-[1fr_1216px_1fr]">
        <BreadCrumb />
      </section>
      <section className="grid grid-cols-[1fr_1216px_1fr] pb-4 pt-10 min-h-[200vh]">
        <div className="col-start-2 col-end-auto grid grid-cols-[1fr_20rem] gap-x-10 gap-y-6">
          <div className="max-w-[850px] h-full relative">
            <SliderJob />
            <div className="pt-12 relative h-full">
              <TabNavigation
                tabLabel={["ภาพรวม", "แพ็กเกจ", "ฟรีแลนซ์", "รีวิว"]}
              >
                <Overview key="overview" />
                <Package key="package" />
                <Freelance key="freelance" />
                <Review key="review" />
              </TabNavigation>
            </div>
          </div>
          <AsideJob />
        </div>
      </section>
      <section className="bg-[#F6F7F8]">
        <section className="grid grid-cols-[1fr_1216px_1fr]">
          <div className="col-start-2 col-end-auto pb-6">
            <div>
              <h2 className="text-[1.5rem] text-text_primary font-medium pb-6">
              งานอื่น ๆ ที่คนส่วนใหญ่สนใจ
              </h2>
              <div className="grid grid-cols-[repeat(4,minmax(1px,1fr))] grid-rows-[1fr] gap-[1.25rem] my-3 ">
              {Array.from({ length: 4 }, (_, index) => (
              <CategoryCard key={index} />
            ))}
              </div>
            </div>
          </div>
          <div className="col-start-2 col-end-auto pb-6">
            <div>
              <h2 className="text-[1.5rem] text-text_primary font-medium pb-6">
              งานอื่น ๆ ที่คนส่วนใหญ่สนใจ
              </h2>
              <div className="grid grid-cols-[repeat(4,minmax(1px,1fr))] grid-rows-[1fr] gap-[1.25rem] my-3 ">
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
