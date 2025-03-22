"use client";
import Loading from "@/components/Loading";
import PointCard from "@/components/PointIcon/PointCard";
import { BannerImage, RewardImage } from "@/constants/images";
import { LanguageFile } from "@/constants/language";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const EarnPage = () => {
  const {
    data: pointLanguageData,
    isLoading,
    error,
  } = useGlobalTranslate(LanguageFile.REWARD);

  const [activeButton, setActiveButton] = useState(0);

  const route = useRouter();

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading language data</div>;

  return (
    <>
      <section className="relative">
        <div className="bg-white absolute top-0 right-0 bottom-0 left-0 flex w-full h-[200px]">
          <div className="flex-shrink-0 h-full">
            <Image
              src={BannerImage.left}
              className="h-full w-auto object-cover"
              alt="left"
            />
          </div>

          <div className="flex-grow flex justify-center h-full">
            <Image
              src={BannerImage.center}
              className="h-full w-auto object-cover"
              alt="center"
            />
          </div>
          <div className="flex-shrink-0 h-full ml-auto">
            <Image
              src={BannerImage.right}
              className="h-full w-auto object-cover"
              alt="right"
            />
          </div>
        </div>
        <div className="absolute top-0 left-0 right-0 flex justify-center items-center h-[200px] text-black">
          <div className="flex flex-col justify-center items-center text-center">
            <div className="text-[20px] font-[500] leading-[23px]">
              {pointLanguageData?.section_rewards_points}
            </div>
            <div className="flex items-center">
              <Image
                src={RewardImage.point}
                alt="point"
                className="w-[2rem] mr-2"
              />
              <div className="text-[28px] font-[600] leading-[46.2px] text-[rgb(29,108,226)]">
                0.00
              </div>
            </div>
            <div className="text-[14px] font-[400] leading-[16.1px] text-[rgba(43,50,59,0.6)]">
              ≈ 0.00 บาท
            </div>
            <div className="text-[14px] font-[400] leading-[16.1px] text-[rgba(43,50,59,0.6)]">
              0.00 {pointLanguageData?.label_total_points} 28/02/2025
            </div>
          </div>
        </div>
      </section>
      <section className="pt-[200px]">
        <div
          className="flex justify-center items-center h-[135px] px-4 pt-0 pr-4 pb-0 pl-4 bg-[hsl(216,85%,94%)]"
          style={{
            borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
            borderTopLeftRadius: "50% 100%",
            borderTopRightRadius: "50% 100%",
            borderBottomRightRadius: "0px",
          }}
        >
          {" "}
          <div className="flex space-x-8">
            <div
              className="text-[20px] font-normal cursor-pointer text-blue-600 border-b-2 border-blue-600"
              onClick={() => route.push("/reward/earn")}
            >
              {pointLanguageData?.tab_collect_points}
            </div>
            <div
              className="text-[20px] font-normal cursor-pointer text-gray-400"
              onClick={() => route.push("/reward/reward")}
            >
              {pointLanguageData?.tab_redeem_rewards}
            </div>
            <div
              className="text-[20px] font-normal cursor-pointer text-gray-400"
              onClick={() => route.push("/reward/point-history")}
            >
              {pointLanguageData?.tab_usage_history}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[hsl(216,85%,94%)] py-24 grid grid-container-desktop gap-y-12 pt-[4rem]">
        <div className="col-start-2 col-end-3">
          <div className="flex">
            <div className="h-[40px] w-[5px] bg-blue-600 mr-2 " />
            <div className="text-[31px] font-semibold text-black">
              {pointLanguageData?.section_free_points_mission}
            </div>
          </div>
          <div className="flex justify-left space-x-4 py-8">
            <button
              className={`py-2 px-6 rounded-full ${
                activeButton === 0
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600 border border-blue-600"
              }`}
              onClick={() => setActiveButton(0)}
            >
              {pointLanguageData?.filter_all}
            </button>
            <button
              className={`py-2 px-6 rounded-full ${
                activeButton === 1
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600 border border-blue-600"
              }`}
              onClick={() => setActiveButton(1)}
            >
              {pointLanguageData?.filter_general}
            </button>
            <button
              className={`py-2 px-6 rounded-full ${
                activeButton === 2
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600 border border-blue-600"
              }`}
              onClick={() => setActiveButton(2)}
            >
              {pointLanguageData?.filter_employment}
            </button>
          </div>
          <div className="text-[24px] font-[500] leading-[27.6px] text-[rgb(29,108,226)] pt-8">
            {pointLanguageData?.label_general_mission}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-[2rem]">
            <PointCard
              title={pointLanguageData?.task_daily_points}
              subtitle="เหลือเวลาอีก 8 ชั่วโมง"
              points={1.0}
              onCheckPoints={() => {}}
              buttonLabel={pointLanguageData?.button_check_get_points}
              viewLabel={pointLanguageData?.label_view_other_rewards}
            />
          </div>
          <div className="text-[24px] font-[500] leading-[27.6px] text-[rgb(29,108,226)] pt-8">
            {pointLanguageData?.label_employment_mission}{" "}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <PointCard
              title={pointLanguageData?.task_first_payment}
              points={50.0}
              onCheckPoints={() => {}}
              buttonLabel={pointLanguageData?.button_check_get_points}
              viewLabel={pointLanguageData?.label_view_other_rewards}
            />
            <PointCard
              title={pointLanguageData?.task_successful_hire}
              points={100.0}
              onCheckPoints={() => {}}
              buttonLabel={pointLanguageData?.button_check_get_points}
              viewLabel={pointLanguageData?.label_view_other_rewards}
            />
            <PointCard
              title={pointLanguageData?.task_repeat_hire}
              points={100.0}
              onCheckPoints={() => {}}
              buttonLabel={pointLanguageData?.button_check_get_points}
              viewLabel={pointLanguageData?.label_view_other_rewards}
            />
            <PointCard
              title={pointLanguageData?.task_first_job_post}
              points={10.0}
              onCheckPoints={() => {}}
              buttonLabel={pointLanguageData?.button_check_get_points}
              viewLabel={pointLanguageData?.label_view_other_rewards}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default EarnPage;
