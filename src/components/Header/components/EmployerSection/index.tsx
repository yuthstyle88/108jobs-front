"use client";
import LanguageDropdown from "@/components/LanguageDropDown";
import NotificationDropdown from "@/components/NotificationDropdown";
import { ProfileIcon } from "@/constants/icons";
import { ProfileImage } from "@/constants/images";
import { useToggle } from "@/hooks/useToggle";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import MegaMenu from "../MegaMenu";
import ProfileSection from "../ProfileSection";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {useTranslation} from "react-i18next";


const EmployerSection = () => {
  const { isOpen, toggle, close } = useToggle();
  const {person } = useMyUser();
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-4 h-full">
      <div className="group">
        <div className="relative">
            <div className="text-[14px] text-[#1d6cd2] px-3 py-2 bg-white rounded-md font-medium flex flex-row items-center gap-2 cursor-pointer">
              {t("global.labelEmploymentButton")}
              <span className="inline-block">
                <FontAwesomeIcon icon={faChevronDown} />
              </span>
            </div>
          <div className="absolute left-0 right-0 w-[110px] bg-transparent h-4"></div>
        </div>
        <div className="absolute left-0 right-0 w-screen opacity-0 scale-y-0 origin-top top-[70px] shadow-mega-menu px-[2rem] py-[3rem] flex text-[rgba(43,50,59,.95)] z-50 bg-white group-hover:opacity-100 group-hover:scale-y-100 group-hover:min-h-[550px] transition-all duration-300">
          <MegaMenu />
        </div>
      </div>
      <Link prefetch={false}
        href="/start-selling"
        className="text-white text-sm hover:bg-blue-800 hover:text-white border-r-[1px] pr-4"
      >
        {t("global.labelApplyToBeFreelancerButton")}
      </Link>
      {/* <ChatBadge /> */}
      <NotificationDropdown />
      <Link prefetch={false}
        href="/reward/earn"
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
          className="flex items-center justify-center gap-2 "
        >
            <Image
                src={person?.avatar || ProfileImage.avatar}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover"
                width={500}
                height={500}
            />

          <span className="inline-block">
            <FontAwesomeIcon
              icon={faChevronDown}
              className="w-[14px] h-[14px] text-white"
            />
          </span>
        </button>

        {isOpen && <ProfileSection profile={person} />}

        {isOpen && (
          <div className="fixed inset-0 z-40" onClick={() => close()} />
        )}
      </div>
    </div>
  );
};

export default EmployerSection;