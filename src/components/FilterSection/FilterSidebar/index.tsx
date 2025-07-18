"use client";
import { JobCategoryLanguage } from "@/types/language";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  language: Partial<JobCategoryLanguage> | undefined | null;
  onApply: (filters: {
    minPrice?: number;
    maxPrice?: number;
    rating?: string;
  }) => void;
  currentFilters: {
    minPrice?: number;
    maxPrice?: number;
    rating: string;
  };
}

const FilterSidebar = ({
  isOpen,
  onClose,
  language,
  onApply,
  currentFilters,
}: FilterSidebarProps) => {
  const [min, setMin] = useState<number | undefined>(currentFilters.minPrice);
  const [max, setMax] = useState<number | undefined>(currentFilters.maxPrice);
  const [rating, setRating] = useState(currentFilters.rating || "");

  useEffect(() => {
    if (isOpen) {
      setMin(currentFilters.minPrice);
      setMax(currentFilters.maxPrice);
      setRating(currentFilters.rating);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleApply = () => {
    onApply({
      minPrice: min,
      maxPrice: max,
      rating,
    });
    onClose();
  };

  const handleClear = () => {
    setMin(undefined);
    setMax(undefined);
    setRating("");
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "visible" : "invisible"}`}>
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-150 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed inset-y-0 left-0 w-full sm:w-[560px] bg-white shadow-xl transform transition-all duration-150 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col pt-[8rem] sm:pt-[5rem] relative">
          <div className="absolute top-[120px] sm:top-20 right-4 z-[199]">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-100 hover:scale-110 duration-150"
            >
              <X className="h-5 w-5 text-black" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {/* Price Filter */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 text-text_primary">
                {language?.priceRange}
              </h3>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="0"
                  value={min ?? ""}
                  onChange={(e) =>
                    setMin(e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="text-text_primary w-full p-3 border border-gray-300 rounded-md focus:outline-blue-500"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder={language?.highestPrice}
                  value={max ?? ""}
                  onChange={(e) =>
                    setMax(e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="text-text_primary w-full p-3 border border-gray-300 rounded-md focus:outline-blue-500"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 text-text_primary">
                {language?.pointsReceived}
              </h3>
              <div className="grid grid-cols-2 gap-2 text-text_primary">
                {[5, 4, 3, 2, 1].map((n) => {
                  const value = n === 5 ? "5" : `${n}Plus`;
                  return (
                    <button
                      key={value}
                      className={`w-full p-2 border border-gray-300 rounded-md ${
                        rating === value
                          ? "bg-secondary text-third font-bold border-third"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() =>
                        setRating((prev) => (prev === value ? "" : value))
                      }
                    >
                      {n}{" "}
                      <FontAwesomeIcon
                        icon={faStar}
                        className="text-[#e9b10c]"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t flex justify-between">
            <button
              className="px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-md"
              onClick={handleClear}
            >
              {language?.cleanTheFilters}
            </button>
            <button
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
              onClick={handleApply}
            >
              {language?.confirm}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
