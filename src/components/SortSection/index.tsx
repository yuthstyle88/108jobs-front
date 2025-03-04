import { useState, useRef, useEffect } from "react";
import { ArrowUpDown } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpDown } from "@fortawesome/free-solid-svg-icons";
import { useClickOutside } from "@/hooks/useClickOutside";

interface SortSectionProps {
  className?: string;
}

const SortSection = ({ className = "" }: SortSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("recommend");
  const dropdownRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  const sortOptions = [
    { value: "recommend", label: "recommend" },
    { value: "highReview", label: "High review score" },
    { value: "sellAlot", label: "Sell a lot" },
    { value: "priceLowToHigh", label: "Price (low to high)" },
    { value: "priceHighToLow", label: "Price (high to low)" },
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value);
    setIsOpen(false);
    console.log(`Sort by: ${value}`);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <div onClick={toggleDropdown} className="filter-button">
        <FontAwesomeIcon icon={faUpDown} className="text-third pr-2" />
        เรียงตาม
      </div>

      <div
        className={`absolute left-0 mt-2 w-44 bg-white rounded-md shadow-lg z-50 border border-gray-200 transition-all duration-200 ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
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
              onClick={() => handleOptionSelect(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SortSection;
