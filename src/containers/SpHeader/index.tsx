"use client";
import { LANGUAGES } from "@/constants/language";
import { useLanguage } from "@/contexts/LanguageContext";
import { faBullhorn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CircleUserRound, Grip, House, Search } from "lucide-react";
// import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LanguageBottomSheet from "../SpBottomTab";
import SPSearch from "./components/SPSearch";
import SpUserAvatar from "./components/SpUserProfile";
import {useSessionContext} from "@/contexts/SessionContext";

type SpHeaderProps = {
  showSearch?: boolean;
};

const SpHeader = ({ showSearch = true }: SpHeaderProps) => {
  // const { data: session } = useSession();
  const { session } = useSessionContext();
  const pathname = usePathname();

  const [showLang, setShowLang] = useState(false);
  const { lang } = useLanguage();
  const currentLang = LANGUAGES[lang as keyof typeof LANGUAGES];

  return (
    <header
      style={{ backgroundColor: "#1754b0" }}
      className="fixed top-0 z-[999] w-full transition-all duration-300"
    >
      <nav className="flex flex-wrap items-center justify-center h-auto min-h-[2.75rem] xl:justify-between">
        <div className="flex items-center w-full md:w-auto">
          <Link prefetch={false}
            href="/"
            className={`flex-1 flex items-center justify-center p-2 text-white cursor-pointer ${
              pathname === `/${lang}` ? "bg-primary" : ""
            }`}
          >
            <House className="w-[27px] h-full mx-2 py-1" />
          </Link>
          <Link prefetch={false}
            href="/categories/popular-service"
            className={`flex-1 flex items-center justify-center p-2 text-white cursor-pointer ${
              pathname === `/${lang}/categories/popular-service` ? "bg-primary" : ""
            }`}
          >
            <Grip className="w-[27px] h-full mx-2 py-1" />
          </Link>
          <Link prefetch={false}
            href="/job/search"
            className={`flex-1 flex items-center justify-center p-2 text-white cursor-pointer ${
              pathname === `/${lang}/job/search` ? "bg-primary" : ""
            }`}
          >
            <Search className="w-[27px] h-full mx-2 py-1" />
          </Link>
          <Link prefetch={false}
            href="/job-board"
            className={`flex-1 flex items-center justify-center p-2 text-white cursor-pointer ${
              pathname === `/${lang}/job-board` ? "bg-primary" : ""
            }`}
          >
            <FontAwesomeIcon
              icon={faBullhorn}
              className="w-[24px] h-full mx-2 py-1"
            />
          </Link>
          <button
            onClick={() => setShowLang(true)}
            className="flex-1 flex items-center justify-center p-2 text-white cursor-pointer"
          >
            <Image
              src={currentLang.flag}
              alt={currentLang.label}
              width={30}
              height={30}
            />
          </button>
          {session ? (
            <SpUserAvatar />
          ) : (
            <Link prefetch={false}
              href="/login"
              className="flex-1 flex items-center justify-center p-2 text-white text-[24px] cursor-pointer"
            >
              <button className="flex items-center justify-center gap-2 w-8 h-8 rounded-full">
                <CircleUserRound className="w-12 h-12" />
              </button>
            </Link>
          )}
        </div>
        {showSearch && (
          <SPSearch/>
        )}
      </nav>
      <LanguageBottomSheet open={showLang} onClose={() => setShowLang(false)} />
    </header>
  );
};

export default SpHeader;
