import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}
export const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  const [expandedNumbers, setExpandedNumbers] = useState(false);
  const renderPageNumbers = () => {
    const pages = [];
    const DOTS = "...";

    pages.push(1);
    if (expandedNumbers) {
      for (let i = 2; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage > 3) {
        pages.push(DOTS);
      }
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(currentPage + 1, totalPages - 1);
        i++
      ) {
        if (pages[pages.length - 1] !== i) {
          pages.push(i);
        }
      }
      if (currentPage < totalPages - 2) {
        pages.push(DOTS);
      }
      if (pages[pages.length - 1] !== totalPages) {
        pages.push(totalPages);
      }
    }
    return pages.map((page, index) => {
      if (page === DOTS) {
        return (
          <button
            key={`dots-${index}`}
            className="flex h-8 w-8 items-center justify-center text-gray-600 hover:text-primary duration-300"
            onClick={() => setExpandedNumbers(true)}
          >
            {DOTS}
          </button>
        );
      }
      return (
        <button
          key={page}
          onClick={() => {
            onPageChange(Number(page));
            setExpandedNumbers(false);
          }}
          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors ${
            currentPage === page
              ? "bg-third text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      );
    });
  };
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
          currentPage === 1
            ? "cursor-not-allowed text-gray-300"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <FontAwesomeIcon
          icon={faChevronLeft}
          className="text-[#8793a6] w-4 h-4 border-1 border-border_primary px-2 py-[7px] rounded-full"
        />
      </button>
      {renderPageNumbers()}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
          currentPage === totalPages
            ? "cursor-not-allowed text-gray-300"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <FontAwesomeIcon
          icon={faChevronRight}
          className="text-[#8793a6] w-4 h-4 border-1 border-border_primary px-2 py-[7px] rounded-full"
        />
      </button>
    </div>
  );
};
