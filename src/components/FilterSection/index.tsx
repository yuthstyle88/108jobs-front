"use client";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import FilterSidebar from "./FilterSidebar";
import { JobCategoryLanguage } from "@/types/language";

type Props = {
  language: Partial<JobCategoryLanguage> | undefined | null;
}

const FilterSection = ({language}:Props) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <>
      <div onClick={() => setIsFilterOpen(true)} className="filter-button">
        <FontAwesomeIcon icon={faFilter} className="text-third pr-2" />
        {language?.filter}
      </div>
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        language={language}
      />
    </>
  );
};

export default FilterSection;
