"use client";
import NotificationDropdown from "@/components/NotificationDropdown";
import { ProfileIcon } from "@/constants/icons";
import { ProfileImage } from "@/constants/images";
import { useToggle } from "@/hooks/useToggle";
import { GlobalLanguage } from "@/types/language";
import { faChevronDown, faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import MegaMenu from "../MegaMenu";
import ProfileSection from "../ProfileSection";
import { Session } from "next-auth";
import { ProfileData } from "@/types/userData";
import { usePrivateFetch } from "@/hooks/api-hooks";
import { API_ROUTES } from "@/api/endpoints";
import LanguageDropdown from "@/components/LanguageDropDown";

interface EmployerProps {
  globalLanguageData: Partial<GlobalLanguage> | null | undefined;
  session?: Session;
}

const EmployerSection = ({ globalLanguageData }: EmployerProps) => {
  const { isOpen, toggle, close } = useToggle();
  const { data: user } = usePrivateFetch<ProfileData>(
    API_ROUTES.profile.get_profile
  );
  return (
    <section className="flex items-center gap-4 h-full">
      <div className="group">
        <div className="relative">
          <div className="text-[14px] text-[#1d6cd2] px-3 py-2 bg-white rounded-md font-medium flex flex-row items-center gap-2 cursor-pointer">
            <p className="">{globalLanguageData?.label_employment_button}</p>
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
          <div className="absolute left-0 right-0 w-[110px] bg-transparent h-4"></div>
        </div>
        <div className="absolute left-0 right-0 w-screen opacity-0 scale-y-0 origin-top top-[70px] shadow-megaMenu px-[2rem] py-[3rem] flex text-[rgba(43,50,59,.95)] z-50 bg-white group-hover:opacity-100 group-hover:scale-y-100 group-hover:min-h-[550px] transition-all duration-300">
          <MegaMenu />
        </div>
      </div>
      <Link
        href="/start-selling"
        className="text-white text-sm hover:bg-blue-800 hover:text-white border-r-[1px] pr-4"
      >
        {globalLanguageData?.label_apply_to_be_freelancer_button}
      </Link>
      <Link
        href="/chat"
        className="text-white text-sm hover:bg-blue-800 hover:text-white px-3"
      >
        <FontAwesomeIcon
          icon={faComment}
          className="w-[24px] h-[24px] text-white"
          size="4x"
        />
      </Link>
      <NotificationDropdown />
      <Link
        href="/login"
        className="text-white text-sm hover:bg-blue-800 hover:text-white"
      >
        <div className="flex items-center gap-2 bg-white rounded-full h-[2rem]">
          <p className="text-third text-[12px] pl-2">0.00</p>
          <Image
            src={ProfileIcon.coins}
            alt="avatar"
            className="w-full h-full"
          />
        </div>
      </Link>
      <div className="px-1">
      <LanguageDropdown />
      </div>
      <div className="relative px-4">
        <button
          onClick={() => toggle()}
          className="flex items-center justify-center gap-2 w-12 h-12 rounded-full "
        >
          <Image
            src={ProfileImage.avatar}
            alt="avatar"
            className="rounded-full"
          />
          <FontAwesomeIcon
            icon={faChevronDown}
            className="w-[14px] h-[14px] text-white"
          />
        </button>

        {isOpen && <ProfileSection user={user} data={globalLanguageData} />}

        {isOpen && (
          <div className="fixed inset-0 z-40" onClick={() => close()} />
        )}
      </div>
    </section>
  );
};

export default EmployerSection;
