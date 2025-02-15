import { AssetIcon } from "@/constants/icons";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'

const Header = () => {
  return (
    <header className="">
      <nav className="flex flex-row justify-between items-center px-[1.5rem] text-white  bg-primary">
        <div className="grid grid-flow-col gap-x-4">
          <Link href="#" className="text-xl font-bold">
            <Image src={AssetIcon.logo} alt="logo" className="w-full h-full" />
          </Link>
          <div className="text-black rounded-[20px] h-[40px]">
            <input type="text" className="focus:outline-none " />
            <FontAwesomeIcon icon={faThumbsUp} className="fa-fw" />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
