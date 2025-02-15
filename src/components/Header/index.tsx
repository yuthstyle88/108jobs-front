import { AssetIcon } from "@/constants/icons";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faSearch } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const [scrollY, setScrollY] = useState(0);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setShowSearch(currentScrollY > window.innerHeight / 2); // Nếu scroll quá nửa màn hình thì hiện search
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrollY > 0 ? "bg-primary" : "bg-transparent"
      }`}
    >
      <nav className="mx-[1.5rem] flex h-[70px] items-center justify-between">
        <div className="grid grid-flow-col items-center gap-x-4">
          <Link href="#">
            <Image src={AssetIcon.logo} alt="logo" className="w-full h-full" />
          </Link>

          <div
            className={`flex text-black h-[40px] relative w-full transition-all duration-300 ${
              showSearch
                ? "opacity-100 "
                : "opacity-0 pointer-events-none"
            }`}
          >
            <input
              type="text"
              className="focus:outline-none rounded-[20px] border-2-white px-5 text-sm font-mono w-full"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="w-[14px] h-[14px] text-primary absolute right-3 top-1/2 -translate-y-1/2"
            />
          </div>
        </div>
        <div className="flex items-center gap-4 h-full">
          <div className="relative">
            <div className="hover:bg-blue-800 hover:text-white text-[14px] text-[#1d6cd2] px-3 py-2 bg-white rounded-md font-medium flex flex-row items-center gap-2">
              <p className="">Tuyển dụng</p>
              <FontAwesomeIcon icon={faChevronDown} />
            </div>
          </div>
          <div className="text-white text-sm hover:bg-blue-800 hover:text-white border-r-[1px] pr-4">
            Đăng ký làm freelancer
          </div>
          <div className="text-white text-sm hover:bg-blue-800 hover:text-white">
            Đăng nhập
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
