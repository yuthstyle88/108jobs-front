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
    </>
  );
};

export default JobDetail;
