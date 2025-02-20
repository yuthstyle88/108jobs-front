"use client";
import { AssetIcon } from "@/constants/icons";
import {
  faChevronDown,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import MegaMenu from "../MegaMenu";

const TYPES: Record<string, { bg: string }> = {
  transparent: {
    bg: "#transparent",
  },
  primary: {
    bg: "bg-primary",
  },
};

interface BgProps {
  type: keyof typeof TYPES;
}

const Header = ({ type }: BgProps) => {
  const [scrollY, setScrollY] = useState(0);
  const [showSearch, setShowSearch] = useState(false);

  const { bg } = TYPES[type];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setShowSearch(currentScrollY > window.innerHeight / 2);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrollY > 0 ? "bg-primary" : bg
      }`}
    >
      <nav className="mx-[1.5rem] flex h-[70px] items-center justify-between">
        <div className="grid grid-flow-col items-center gap-x-4">
          <Link href="#">
            <Image src={AssetIcon.logo} alt="logo" className="w-full h-full" />
          </Link>

          <div
            className={`flex text-black h-[40px] relative w-full transition-all duration-300 ${
              showSearch ? "opacity-100 " : "opacity-0 pointer-events-none"
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
          <div className="group">
            <div className="text-[14px] text-[#1d6cd2] px-3 py-2 bg-white rounded-md font-medium flex flex-row items-center gap-2">
              <p className="">Tuyển dụng</p>
              <FontAwesomeIcon icon={faChevronDown} />
            </div>
            <div className="absolute left-0 right-0 w-screen opacity-0 scale-y-0 origin-top top-[70px] shadow-megaMenu px-[2rem] py-[3rem] flex text-[rgba(43,50,59,.95)] z-10 bg-white group-hover:opacity-100 group-hover:scale-y-100 group-hover:min-h-[450px] transition-all duration-300">
              <MegaMenu />
            </div>
          </div>
          <div className="text-white text-sm hover:bg-blue-800 hover:text-white border-r-[1px] pr-4">
            Đăng ký làm freelancer
          </div>
          <Link
            href="/login"
            className="text-white text-sm hover:bg-blue-800 hover:text-white"
          >
            Đăng nhập
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
