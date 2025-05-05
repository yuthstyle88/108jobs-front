"use client";
import React, { useState } from "react";

const subCategory = [
  {
    title: "ทั้งหมด",
  },
  {
    title: "TikTok",
  },
  {
    title: "Amazon",
  },
  {
    title: "Backlink",
  },
  {
    title: "Wordpress",
  },
  {
    title: "Youtube",
  },
  {
    title: "Facebook",
  },
  {
    title: "Audit",
  },
  {
    title: "Full Service",
  },
];

const SubCategory = () => {
  const [category, setCategory] = useState<number | null>(0);

  return (
    <div className="col-start-2 col-end-auto ">
      <div className="overflow-hidden relative ">
        <div className="flex gap-2 duration-150">
          {subCategory.map((item, index) => (
            <div
              key={index}
              onClick={() => setCategory(index)}
              className={`${
                index === category
                  ? "text-third border-third bg-[#E3EDFD]"
                  : "hover:bg-[#F6F7F8] text-text_secondary border-border_primary"
              } text-[14px] sm:text-base font-medium leading-[1.5] px-2 py-[5px] sm:px-4 sm:py-[7px] whitespace-nowrap text-text_secondary border-[1px] border-border_primary rounded-[4px] cursor-pointer select-none flex justify-center items-center `}
            >
              <span>{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubCategory;
