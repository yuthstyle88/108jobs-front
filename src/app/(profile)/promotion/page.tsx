"use client";
import Loading from "@/components/Loading";
import { AssetIcon } from "@/constants/icons";
import { LanguageFile } from "@/constants/language";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { faGift } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tags } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const Promotion = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const {
    data: couponLanguageData,
    isLoading,
    error,
  } = useGlobalTranslate(LanguageFile.COUPON);

  const tabs = [
    {
      name: couponLanguageData?.tab_for_hiring,
      content: couponLanguageData?.message_no_offers,
    },
    {
      name: couponLanguageData?.tab_for_freelancers,
      content: couponLanguageData?.message_no_offers,
    },
  ];

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading language data</div>;
  return (
    <>
      {/* <CategoryDetail /> */}
      <main>
        <section
          className="flex items-center justify-center w-full h-[200px] relative overflow-hidden"
          style={{ background: "linear-gradient(282deg, #27c8f8, #1850c2)" }}
        >
          <div className="px-[1.5rem] relative">
            <div className="text-center text-white">
              <h1 className="text-[28px]">
                {couponLanguageData?.section_discounts_promotions}
              </h1>
              <p className="text-[16px]">
                {couponLanguageData?.subtitle_discounts_promotions}
              </p>
            </div>
          </div>
          <div className="absolute right-[-100px] bottom-[150px] h-[150px] ml-auto opacity-30 pointer-events-none">
            <Image
              src={AssetIcon.logo_icon}
              alt="Logo"
              width={350}
              height={350}
            />
          </div>
        </section>
        <section className="py-6 sm:py-24 grid grid-container-desktop-banner gap-y-4 sm:gap-y-12 pt-4 sm:pt-[4rem]">
          <div className="col-start-2 col-end-3">
            <h2 className="text-[20px] sm:text-[1.75rem] text-black">
              {couponLanguageData?.label_your_coupons}{" "}
            </h2>
            <p className="text-[12px] sm:text-[20px] text-gray-500">
              {couponLanguageData?.description_your_coupons}
            </p>
          </div>
          <div className=" flex col-start-2 col-end-3 py-[8rem] justify-center items-center">
            <div className="grid-cols-1 items-center justify-center text-center">
              <div className="flex justify-center items-center">
                <Tags className="text-text_secondary w-9 h-9"/>
              </div>
              <div className="text-text_secondary mt-2">
                {" "}
                {couponLanguageData?.message_no_coupons}
              </div>
            </div>
          </div>
          <div className="col-start-2 col-end-3 border-t border-gray-300 mt-8"></div>
        </section>
        <section className="py-24 grid grid-container-desktop-banner gap-y-12 pt-[4rem]">
          <div className="col-start-2 col-end-3">
            <h2 className="text-[1.75rem] text-black">
              {couponLanguageData?.section_special_offers}{" "}
            </h2>
            <p className="text-[20px] text-gray-500">
              {couponLanguageData?.description_special_offers}
            </p>
          </div>
          <div className="col-start-2 col-end-3">
            <div className="flex border-b border-gray-300">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  className={`${
                    selectedTab === index
                      ? "border-b-2 border-blue-500 text-blue-500"
                      : "text-gray-500"
                  } py-2 px-4 text-lg font-medium`}
                  onClick={() => setSelectedTab(index)}
                >
                  {tab.name}
                </button>
              ))}
            </div>
            <div className=" flex justify-center items-center py-[8rem]">
              <div className="grid-cols-1 items-center justify-center text-center">
                <FontAwesomeIcon icon={faGift} className="text-text_secondary text-[28px]"  />

                <p className="text-text_secondary mt-2">
                  {tabs[selectedTab].content}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Promotion;
