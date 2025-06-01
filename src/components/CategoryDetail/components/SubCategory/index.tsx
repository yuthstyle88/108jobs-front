"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Tag } from "@/types/jobSearch";
import { JobCategoryLanguage } from "@/types/language";

interface SubCategoryProps {
  selectedTag: string;
  onSelectTag: (tag: string) => void;
  tagList: Tag[];
  language: Partial<JobCategoryLanguage> | undefined | null;
}

const SubCategory = ({
  selectedTag,
  onSelectTag,
  tagList,
  language,
}: SubCategoryProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft + container.clientWidth < container.scrollWidth - 5
    );
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    updateScrollButtons();
    container.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      container.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = container.offsetWidth * 0.8;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="col-start-2 col-end-auto relative">
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white  border-1 border-border_secondary shadow-md p-1 rounded-full hidden md:block"
        >
          <ChevronLeft className="text-text_secondary" size={20} />
        </button>
      )}

      <div ref={scrollRef} className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 whitespace-nowrap py-2">
          <div
            onClick={() => onSelectTag("")}
            className={`${
              selectedTag === ""
                ? "text-third border-third bg-[#E3EDFD]"
                : "hover:bg-[#F6F7F8] text-text_secondary border-border_primary"
            } text-[14px] sm:text-base font-medium leading-[1.5] px-2 py-[5px] sm:px-4 sm:py-[7px] border-[1px] rounded-[4px] cursor-pointer select-none flex justify-center items-center`}
          >
            <span>{language?.all_categories}</span>
          </div>

          {tagList.map((item, index) => {
            const isActive = item.name === selectedTag;

            return (
              <div
                key={index}
                onClick={() => onSelectTag(item.name)}
                className={`${
                  isActive
                    ? "text-third border-third bg-[#E3EDFD]"
                    : "hover:bg-[#F6F7F8] text-text_secondary border-border_primary"
                } text-[14px] sm:text-base font-medium leading-[1.5] px-2 py-[5px] sm:px-4 sm:py-[7px] border-[1px] rounded-[4px] cursor-pointer select-none flex justify-center items-center`}
              >
                <span>{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border-1 border-border_secondary shadow-md p-1 rounded-full hidden md:block"
        >
          <ChevronRight className="text-text_secondary" size={20} />
        </button>
      )}
    </div>
  );
};

export default SubCategory;
