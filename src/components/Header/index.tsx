"use client";
import {AssetIcon} from "@/constants/icons";
import {useAuthInfo} from "@/hooks/authenticate-api/useAuthInfo";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import {useTranslation} from "react-i18next";
import LanguageDropdown from "../LanguageDropDown";
import UserProfileSection from "./components/UserProfileSection";
import MegaMenu from "./components/MegaMenu";
import Search from "./components/Search";
import {useScrollHandler} from "./hooks/useScrollHandler";

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
  forceShowSearch?: boolean;
}

const Header = ({ type, forceShowSearch = false }: BgProps) => {
  const { isLoggedIn } = useAuthInfo();
  const { t } = useTranslation();
  const { scrollY, showSearch } = useScrollHandler(forceShowSearch);
  const { bg } = TYPES[type];

  return (
    <header
      className={`fixed top-0 z-[999] w-full transition-all duration-300 ${scrollY > 0 ? "bg-primary" : bg
        }`}
    >
      <nav className="mx-[1.5rem] flex flex-wrap items-center justify-center h-auto min-h-[70px] py-4 xl:py-1 xl:justify-between">
        <section className="flex items-center gap-x-4 w-full md:w-auto">
          <Link prefetch={false} href="/" className="shrink-0">
            <Image
              src={AssetIcon.logo}
              alt="logo"
              className="w-full h-full"
              width={500}
              height={500}
              priority
            />
          </Link>

          <Search showSearch={showSearch} />
        </section>

        <section className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0 justify-end">
          {!isLoggedIn && (
            <Link prefetch={false}
              href="/job-board"
              className="text-white text-sm hover:text-white"
            >
              {t("global.labelJobBoardCenter")}
            </Link>
          )}
          {isLoggedIn && (
            <>
              <UserProfileSection />
            </>
          )}
          {!isLoggedIn && (
            <Link prefetch={false}
              href="/login"
              className="text-white text-sm hover:text-white"
            >
              {t("global.labelSignInButton")}
            </Link>
          )}
          {!isLoggedIn && <LanguageDropdown />}
        </section>
      </nav>
    </header>
  );
};

export default Header;