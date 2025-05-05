"use client";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import FilterSidebar from "./FilterSidebar";


const FilterSection = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <>
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
