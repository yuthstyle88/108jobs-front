"use client";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import FilterSidebar from "./FilterSidebar";
import { JobCategoryLanguage } from "@/types/language";
import { X } from "lucide-react";

type Props = {
  language: Partial<JobCategoryLanguage> | undefined | null;
  onFilterChange: (filters: {
    min_price?: number;
    max_price?: number;
    rating?: string;
  }) => void;
  currentFilters: {
    min_price?: number;
    max_price?: number;
    rating: string;
  };
};

const FilterSection = ({ language, onFilterChange, currentFilters }: Props) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const countActiveFilters = () => {
    let count = 0;
    if (currentFilters.rating) count += 1;
    if (currentFilters.min_price !== undefined) count += 1;
    if (currentFilters.max_price !== undefined) count += 1;
    return count;
  };

  const activeFilterCount = countActiveFilters();

  return (
    <>
      {activeFilterCount > 0 ? (
        <div
          className={`${activeFilterCount > 0 ? "bg-secondary text-third border-third hover:bg-[#dae5f7]" : "hover:bg-[#F6F7F8] border-border_primary"} filter-button px-4 py-2 rounded-md flex items-center gap-2 text-text_primary cursor-pointer hover:bg-gray-100 transition`}
          onClick={() => setIsFilterOpen(true)}
        >
          <span className="bg-third text-white flex items-center justify-center rounded-full w-4 h-4 text-sm font-bold ">
            {activeFilterCount}
          </span>
          {language?.filter}
          <X
            onClick={(e) => {
              e.stopPropagation();
              onFilterChange({
                rating: "",
                min_price: undefined,
                max_price: undefined,
              });
            }}
            className="w-4 h-4 text-gray-500 hover:text-third cursor-pointer"
          />
         
        </div>
      ) : (
        <div
          onClick={() => setIsFilterOpen(true)}
          className="filter-button border border-border_primary px-4 py-2 rounded-md flex items-center gap-2 text-text_primary cursor-pointer hover:bg-gray-100 transition"
        >
          <FontAwesomeIcon icon={faFilter} className="text-third" />
          {language?.filter}
        </div>
      )}

      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        language={language}
        onApply={onFilterChange}
        currentFilters={currentFilters}
      />
    </>
  );
};

export default FilterSection;
