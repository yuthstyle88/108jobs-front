"use client";
import { CategoriesImage } from "@/constants/images";
import { JobCategoryLanguage } from "@/types/language";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  language: Partial<JobCategoryLanguage> | undefined | null;
}

const FilterSidebar = ({ isOpen, onClose,language }: FilterSidebarProps) => {
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

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
            <div className="grid sm:hidden grid-flow-row gap-6 py-8 w-full">
              <div>
                <span className="flex flex-row justify-between items-center">
                  <div className="mr-2">
                    <Image
                      src={CategoriesImage.specialist}
                      alt="specialist"
                      className="align-top h-[26px] w-full"
                    />
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" />
                    <div className="w-[2.75rem] h-[26px] bg-gray-200  hover:bg-gray-300 peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-1/2 peer-checked:after:border-white after:content-[''] after:absolute after:top-[-3px] after:left-[-2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-8 after:w-8 after:scale-[0.64] after:shadow-toggle after:transition-all peer-checked:bg-third hover:peer-checked:bg-third"></div>
                  </label>
                </span>
              </div>
              <div>
                <span className="flex flex-row justify-between items-center">
                  <div className="mr-2">
                    <Image
                      src={CategoriesImage.milestone}
                      alt="milestone"
                      className="align-top h-[26px] w-full"
                    />
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" />
                    <div className="w-[2.75rem] h-[26px] bg-gray-200  hover:bg-gray-300 peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-1/2 peer-checked:after:border-white after:content-[''] after:absolute after:top-[-3px] after:left-[-2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-8 after:w-8 after:scale-[0.64] after:shadow-toggle after:transition-all peer-checked:bg-third hover:peer-checked:bg-third"></div>
                  </label>
                </span>
              </div>
              <div>
                <span className="flex flex-row justify-between items-center">
                  <div className="mr-2">
                    <Image
                      src={CategoriesImage.fast_reply}
                      alt="fast_reply"
                      className="align-top h-[26px] w-full"
                    />
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" />
                    <div className="w-[2.75rem] h-[26px] bg-gray-200  hover:bg-gray-300 peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-1/2 peer-checked:after:border-white after:content-[''] after:absolute after:top-[-3px] after:left-[-2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-8 after:w-8 after:scale-[0.64] after:shadow-toggle after:transition-all peer-checked:bg-third hover:peer-checked:bg-third"></div>
                  </label>
                </span>
              </div>
            </div>
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 text-text_primary">
                {language?.price_range}
              </h3>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="0"
                  className="text-text_primary text-text_primaryw-full p-3 border border-gray-300 rounded-md focus:outline-blue-500"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder={language?.highest_price}
                  className="text-text_primary w-full p-3 border border-gray-300 rounded-md focus:outline-blue-500"
                />
              </div>
            </div>
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 text-text_primary">
                {language?.points_received}
              </h3>
              <div className="grid grid-cols-2 gap-2 text-text_primary">
                <button className="w-full p-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-blue-500">
                  5
                </button>
                <button className="w-full p-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-blue-500">
                  {language?.["4_and_up"]}
                </button>
                <button className="w-full p-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-blue-500">
                  {language?.["3_and_up"]}
                </button>
                <button className="w-full p-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-blue-500">
                  {language?.["2_and_up"]}
                </button>
                <button className="w-full p-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-blue-500">
                  {language?.["1_and_up"]}
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t flex justify-between">
            <button
              className="px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-md"
              onClick={() => {
                console.log("Clearing filters");
              }}
            >
              {language?.clean_the_filters}
            </button>
            <button
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
              onClick={() => {
                console.log("Applying filters");
                onClose();
              }}
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
