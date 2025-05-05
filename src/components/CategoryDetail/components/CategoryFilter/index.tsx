import { CategoriesImage } from "@/constants/images";
import Image from "next/image";
import React from "react";

const CategoryFilter = () => {
  return (
    <div className="hidden sm:grid grid-flow-col gap-4 justify-start pl-3 ">
      <div>
        <span className="inline-flex items-center">
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
        <span className="inline-flex items-center">
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
        <span className="inline-flex items-center">
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
  );
};

export default CategoryFilter;
