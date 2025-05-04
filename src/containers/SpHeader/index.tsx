"use client";
import { API_ROUTES } from "@/api/endpoints";
import { ProfileImage } from "@/constants/images";
import { LANGUAGES } from "@/constants/language";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrivateFetch } from "@/hooks/api-hooks";
import { ProfileData } from "@/types/userData";
import { faBullhorn, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CircleUserRound, Grip, House, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LanguageBottomSheet from "../SpBottomTab";

type SpHeaderProps = {
  showSearch?: boolean;
};

const SpHeader = ({ showSearch = true }: SpHeaderProps) => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const { data: user } = usePrivateFetch<ProfileData>(
    API_ROUTES.profile.get_profile
  );

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
          <Link
            href="/"
            className={`flex-1 flex items-center justify-center p-2 text-white cursor-pointer ${
              pathname === "/" ? "bg-primary" : ""
            }`}
          >
            <House className="w-[27px] h-full mx-2 py-1" />
          </Link>
          <Link
            href="/popular-subcat"
            className={`flex-1 flex items-center justify-center p-2 text-white cursor-pointer ${
              pathname === "/popular-subcat" ? "bg-primary" : ""
            }`}
          >
            <Grip className="w-[27px] h-full mx-2 py-1" />
          </Link>
          <Link
            href="/search"
            className={`flex-1 flex items-center justify-center p-2 text-white cursor-pointer ${
              pathname === "/search" ? "bg-primary" : ""
            }`}
          >
            <Search className="w-[27px] h-full mx-2 py-1" />
          </Link>
          <Link
            href="/job-board"
            className={`flex-1 flex items-center justify-center p-2 text-white cursor-pointer ${
              pathname === "/job-board" ? "bg-primary" : ""
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
            <Link
              href="/profile"
              className={`flex-1 flex items-center justify-center p-2 text-white text-[24px] cursor-pointer ${
                pathname === "/profile" ? "bg-primary" : ""
              }`}
            >
              <Image
                src={user?.user.avatar_url || ProfileImage.avatar}
                alt="avatar"
                className="rounded-full w-8 h-8"
                width={500}
                height={500}
              />
            </Link>
          ) : (
            <Link
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
          <section className="flex items-center gap-x-4 w-full md:w-auto">
            <div className="flex text-black h-[40px] w-full md:w-[250px] relative transition-all duration-300 mx-3 my-3">
              <input
                type="text"
                placeholder="Find freelancers..."
                className="focus:outline-none rounded-[20px] border-2-white px-5 text-sm font-mono w-full"
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="w-[14px] h-[14px] text-primary absolute right-3 top-1/2 -translate-y-1/2"
              />
            </div>
          </section>
        )}
      </nav>
      <LanguageBottomSheet open={showLang} onClose={() => setShowLang(false)} />
    </header>
  );
};

export default SpHeader;
