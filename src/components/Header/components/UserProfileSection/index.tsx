"use client";
import LanguageDropdown from "@/components/LanguageDropDown";
import NotificationDropdown from "@/components/NotificationDropdown";
import {ProfileImage} from "@/constants/images";
import {useToggle} from "@/hooks/useToggle";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import UserMegaMenu from "../UserMegaMenu";
import UserImproveMenu from "../UserImproveMenu";
import ProfileUser from "../ProfileUser";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {useTranslation} from "react-i18next";
import ChatBadge from "@/components/Header/components/ChatBadge";
import {ProfileIcon} from "@/constants/icons";

const UserProfileSection = () => {
    const {wallet, person} = useMyUser();
    const {isOpen, toggle, close} = useToggle();
    const {t} = useTranslation();
    return (
        <section className="flex items-center gap-4 h-full">
            <div className="group hidden lg:block">
                <div className="relative">
                    <div
                        className="text-[14px] text-[#1d6cd2] px-3 py-2 bg-white rounded-md font-medium flex flex-row items-center gap-2 cursor-pointer">
                        <p className="">
                            {t("global.increaseHiringOpportunity")}
                        </p>
                        <FontAwesomeIcon icon={faChevronDown}/>
                    </div>
                    <div className="absolute left-0 right-0 w-[230px] bg-transparent h-4"></div>
                </div>
                <div
                    className="absolute left-0 right-0 w-screen opacity-0 scale-y-0 origin-top top-[70px] shadow-mega-menu px-[2rem] py-[3rem] flex text-[rgba(43,50,59,.95)] z-50 bg-white group-hover:opacity-100 group-hover:scale-y-100 group-hover:min-h-[550px] transition-all duration-300">
                    <UserImproveMenu/>
                </div>
            </div>
            <div className="group hidden md:block">
                <div className="relative">
                    <div
                        className="border-r-[1px] border-[#4f8ce8] pr-8 text-[14px] text-white px-3 py-2 font-medium flex flex-row items-center gap-2 cursor-pointer">
                        <p className="">{t("global.recruitment")}</p>
                        <FontAwesomeIcon icon={faChevronDown}/>
                    </div>
                    <div className="absolute left-0 right-0 w-[110px] bg-transparent h-4"></div>
                </div>
                <div
                    className="absolute left-0 right-0 w-screen opacity-0 scale-y-0 origin-top top-[70px] shadow-mega-menu px-[2rem] py-[3rem] flex text-[rgba(43,50,59,.95)] z-50 bg-white group-hover:opacity-100 group-hover:scale-y-100 group-hover:min-h-[550px] transition-all duration-300">
                    <UserMegaMenu/>
                </div>
            </div>
            <ChatBadge/>
            <NotificationDropdown/>
            <Link prefetch={false}
                  href="/coin"
                  className="text-white text-sm"
            >
                <div className="flex items-center gap-2 bg-white rounded-full h-[2rem]">
                    <p className="text-third text-[12px] pl-2">{wallet?.balanceAvailable || 0}</p>
                    <Image
                        src={ProfileIcon.coins}
                        alt="avatar"
                        className="w-full h-full"
                    />
                </div>
            </Link>
            <div className="px-1">
                <LanguageDropdown/>
            </div>
            <div className="relative px-4">
                <button
                    onClick={() => toggle()}
                    className="flex items-center justify-center gap-2 "
                >
                    <div className="flex items-center w-12 h-12 rounded-full overflow-hidden bg-white">
                        {person && (
                            <Image
                                src={ProfileImage.avatar}
                                alt="avatar"
                                className="w-full h-full object-cover object-center"
                                width={48}
                                height={48}
                            />
                        )
                        }
                    </div>
                    <FontAwesomeIcon
                        icon={faChevronDown}
                        className="w-[14px] h-[14px] text-white"
                    />
                </button>
                {isOpen && person && <ProfileUser profile={person}/>}
                {isOpen && (
                    <div className="fixed inset-0 z-40" onClick={() => close()}/>
                )}
            </div>
        </section>
    );
};

export default UserProfileSection;
