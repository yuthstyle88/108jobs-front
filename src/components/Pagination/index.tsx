import {faChevronLeft, faChevronRight,} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";

interface PaginationProps {
  totalPages: number | 0;       // từ API: totalPages
  currentPage: number | 0;      // từ API: page
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      for (
        let i = Math.max(2,
          currentPage - 1);
        i <= Math.min(currentPage + 1,
          totalPages - 1);
        i++
      ) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages.map((page, idx) => {
      if (page === "...") {
        return (
          <span
            key={`dots-${idx}`}
            className="flex h-8 w-8 items-center justify-center text-gray-500"
          >
            ...
          </span>
        );
      }

      return (
        <button
          key={page}
          onClick={() => onPageChange(Number(page))}
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
    <div className="flex items-center justify-center gap-4 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
          currentPage === 1
            ? "cursor-not-allowed text-gray-300"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4"/>
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
        <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4"/>
      </button>
    </div>
  );
};
