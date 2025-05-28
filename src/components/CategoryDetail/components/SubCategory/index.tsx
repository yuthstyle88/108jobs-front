"use client";
import React from "react";

interface SubCategoryProps {
  selectedTag: string;
  onSelectTag: (tag: string) => void;
}

const subCategory = [
  { title: "ทั้งหมด" },
  { title: "TikTok" },
  { title: "Amazon" },
  { title: "Backlink" },
  { title: "Wordpress" },
  { title: "Youtube" },
  { title: "Facebook" },
  { title: "Audit" },
  { title: "Full Service" },
];

const SubCategory = ({ selectedTag, onSelectTag }: SubCategoryProps) => {
  return (
    <div className="col-start-2 col-end-auto">
      <div className="overflow-hidden relative">
        <div className="flex gap-2 duration-150">
          {subCategory.map((item, index) => {
            const isActive =
              item.title === selectedTag ||
              (item.title === "ทั้งหมด" && selectedTag === "");

            return (
              <div
                key={index}
                onClick={() => onSelectTag(item.title === "ทั้งหมด" ? "" : item.title)}
                className={`${
                  isActive
                    ? "text-third border-third bg-[#E3EDFD]"
                    : "hover:bg-[#F6F7F8] text-text_secondary border-border_primary"
                } text-[14px] sm:text-base font-medium leading-[1.5] px-2 py-[5px] sm:px-4 sm:py-[7px] whitespace-nowrap border-[1px] rounded-[4px] cursor-pointer select-none flex justify-center items-center`}
              >
                <span>{item.title}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubCategory;
