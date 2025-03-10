import { useClickOutside } from "@/hooks/useClickOutside";
import { faUpDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";

interface SortSectionProps {
  className?: string;
}

const SortSection = ({ className = "" }: SortSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("recommend");
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const toggleRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  const sortOptions = [
    { value: "recommend", label: "recommend" },
    { value: "highReview", label: "High review score" },
    { value: "sellAlot", label: "Sell a lot" },
    { value: "priceLowToHigh", label: "Price (low to high)" },
    { value: "priceHighToLow", label: "Price (high to low)" },
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
    if (!isOpen) {
      updatePosition();
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      const handleScroll = () => {
        updatePosition();
      };
      window.addEventListener("scroll", handleScroll, true);
      return () => window.removeEventListener("scroll", handleScroll, true);
    }
  }, [isOpen]);

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value);
    setIsOpen(false);
    console.log(`Sort by: ${value}`);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <div
        onClick={toggleDropdown}
        className="filter-button cursor-pointer"
        ref={toggleRef}
      >
        <FontAwesomeIcon icon={faUpDown} className="text-third pr-2" />
        เรียงตาม
      </div>

      {isOpen &&
        ReactDOM.createPortal(
          <div
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
                  onClick={() => handleOptionSelect(option.value)}
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
