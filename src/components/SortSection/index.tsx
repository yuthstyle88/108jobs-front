"use client";
import { useClickOutside } from "@/hooks/useClickOutside";
import { JobCategoryLanguage } from "@/types/language";
import { faUpDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";

interface SortSectionProps {
  className?: string;
  language: Partial<JobCategoryLanguage> | undefined | null;
  onSortChange?: (value: string) => void;
  currentSort?: string;
}

const SortSection = ({
  className = "",
  language,
  onSortChange,
  currentSort = "",
}: SortSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(currentSort);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const toggleRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  const sortOptions = [
    { value: "rating", label: language?.highReviewScore },
    { value: "priceAsc", label: language?.priceLowToHigh },
    { value: "priceDesc", label: language?.priceHighToLow },
    { value: "purchaseCount", label: language?.sellALot },
  ];

  const updatePosition = () => {
    if (toggleRef.current) {
      const rect = toggleRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  };

  const toggleDropdown = () => {
    if (!isOpen) updatePosition();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      const handleScroll = () => updatePosition();
      window.addEventListener("scroll", handleScroll, true);
      return () => window.removeEventListener("scroll", handleScroll, true);
    }
  }, [isOpen]);

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value);
    setIsOpen(false);
    onSortChange?.(value); // Notify parent
  };

  return (
    <div className={`relative ${className}`}>
      <div
        onClick={toggleDropdown}
        className={`filter-button cursor-pointer flex items-center gap-2 border rounded-md px-3 py-2 ${
          selectedOption ? "bg-[#E3EDFD] border-blue-500 text-blue-600" : ""
        }`}
        ref={toggleRef}
      >
        <FontAwesomeIcon icon={faUpDown} className="text-third" />
        {selectedOption
          ? sortOptions.find((opt) => opt.value === selectedOption)?.label
          : language?.sortBy}
        {selectedOption && (
          <X
            onClick={(e) => {
              e.stopPropagation();
              setSelectedOption("");
              onSortChange?.("");
            }}
            className="w-4 h-4 text-third cursor-pointer"
          />
        )}
      </div>

      {isOpen &&
        ReactDOM.createPortal(
          <div
            ref={dropdownRef}
            className="absolute mt-2 w-44 bg-white rounded-md shadow-lg z-20 border border-gray-200 transition-opacity duration-200"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
            }}
          >
            <div className="py-1">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    selectedOption === option.value
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOptionSelect(option.value);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default SortSection;
