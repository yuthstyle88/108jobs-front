"use client";
import { Filter } from "lucide-react";
import { useState } from "react";
import FilterSidebar from "./FilterSidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

interface FilterSectionProps {
  className?: string;
}

const FilterSection = ({ className = "" }: FilterSectionProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <>
      {/* <button
        className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 ${className}`}
        onClick={() => setIsFilterOpen(true)}
      >
        <Filter className="h-5 w-5" />
        <span>Filter</span>
      </button> */}
      <div onClick={() => setIsFilterOpen(true)} className="filter-button">
        <FontAwesomeIcon icon={faFilter} className="text-third pr-2" />
        ตัวกรอง
      </div>
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
    </>
  );
};

export default FilterSection;
