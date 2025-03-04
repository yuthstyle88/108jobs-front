"use client";
import { X } from "lucide-react";
import { useEffect } from "react";

interface FilterSidebarProps {
    isOpen: boolean;
    onClose: () => void;
  }
  
  const FilterSidebar = ({ isOpen, onClose }: FilterSidebarProps) => {
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
      className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-150 ${isOpen ? "opacity-100" : "opacity-0"}`}
      onClick={onClose}
    />
    
    <div 
      className={`fixed inset-y-0 left-0 w-full sm:w-[560px] bg-white shadow-xl transform transition-all duration-150 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="h-full flex flex-col">
          <div className="flex justify-end p-4 border-b">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-100 hover:scale-110 duration-150"
            >
              <X className="h-5 w-5 text-black" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 text-text_primary">
                Type
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="offpage-analysis"
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="offpage-analysis"
                    className="ml-3 text-gray-700"
                  >
                    Offpage Analysis
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="onpage-analysis"
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="onpage-analysis"
                    className="ml-3 text-gray-700"
                  >
                    Onpage Analysis
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="competitor-analysis"
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="competitor-analysis"
                    className="ml-3 text-gray-700"
                  >
                    Competitor Analysis
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="keyword-analysis"
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="keyword-analysis"
                    className="ml-3 text-gray-700"
                  >
                    Keyword Analysis
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="build-backlinks"
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="build-backlinks"
                    className="ml-3 text-gray-700"
                  >
                    Build Backlinks
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="customize-tags"
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="customize-tags"
                    className="ml-3 text-gray-700"
                  >
                    Customize H1 H2 H3 Tags
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 text-text_primary">
                Included in the package
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="write-content"
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="write-content" className="ml-3 text-gray-700">
                    Write content
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="promote-web-pages"
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="promote-web-pages"
                    className="ml-3 text-gray-700"
                  >
                    Promote web pages
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="buy-advertising"
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="buy-advertising"
                    className="ml-3 text-gray-700"
                  >
                    Buy online advertising
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 text-text_primary">
                Price range
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
                  placeholder="Highest price"
                  className="text-text_primary w-full p-3 border border-gray-300 rounded-md focus:outline-blue-500"
                />
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 text-text_primary">
                Language used to communicate with employers
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="thai"
                    type="checkbox"
                    className="text-text_primary h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="thai" className="ml-3 text-gray-700">
                    Thai
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="english"
                    type="checkbox"
                    className="text-text_primary h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="english" className="ml-3 text-gray-700">
                    English
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 text-text_primary">
                Points received
              </h3>
              <div className="grid grid-cols-2 gap-2 text-text_primary">
                <button className="w-full p-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-blue-500">
                  5
                </button>
                <button className="w-full p-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-blue-500">
                  4 and up
                </button>
                <button className="w-full p-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-blue-500">
                  4 and up
                </button>
                <button className="w-full p-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-blue-500">
                  4 and up
                </button>
                <button className="w-full p-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-blue-500">
                  4 and up
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
              Clean the filter
            </button>
            <button
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
              onClick={() => {
                console.log("Applying filters");
                onClose();
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
