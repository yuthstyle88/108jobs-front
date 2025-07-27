"use client";
import { LanguageFile } from "@/constants/language";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { useClickOutside } from "@/hooks/useClickOutside";
import { interpolate } from "@/utils/interpolate";
import { faBell, faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import LanguageDropdown from "../LanguageDropDown";
import Loading from "../Loading";
import Image from "next/image";
import { ProfileImage } from "@/constants/images";
import { useLanguage } from "@/contexts/LanguageContext";
import Error from "@/app/error";
import {UserService} from "@/services";
import {useProfileData} from "@/hooks/profile-api/useProfileData";
import {REQUEST_STATE} from "@/services/HttpService";

const SellerHeader = () => {
    const { lang } = useLanguage();
  const { data: globalLanguageData } = useGlobalTranslate(LanguageFile.GLOBAL);
  const {
    profileData: user,
    profileState,
    isLoadingProfile,
  } = useProfileData();

  const logout = () => UserService.Instance.logout();


  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useClickOutside<HTMLDivElement>(() =>
    setIsProfileMenuOpen(false)
  );

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  if (isLoadingProfile) return <Loading />;
  if (profileState.state === REQUEST_STATE.FAILED) return <Error/>;

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-8 py-4">
        <h1 className="text-xl text-text-primary">
          {interpolate(globalLanguageData?.greetingUser || "", {
            username: user?.person?.name || "",
          })}
        </h1>
        <div className="flex items-center space-x-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center">
            <span>{globalLanguageData?.fastworkRewardsButton}</span>
            <span className="ml-2 bg-blue-500 px-2 py-0.5 rounded text-xs">
              {globalLanguageData?.fastworkRewardsSubtext}
            </span>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FontAwesomeIcon
              icon={faComment}
              className="text-[20px] text-third "
            />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FontAwesomeIcon
              icon={faBell}
              className="text-[20px] text-third "
            />
          </button>
          <div className="p-2">
            <LanguageDropdown />
          </div>
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={toggleProfileMenu}
              className="flex justify-center items-center"
            >
              <Image
                src={user?.person?.avatar || ProfileImage.avatar}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
                width={500}
                height={500}
              />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                <div className="py-2">
                  <Link prefetch={false}
                    href={`${lang}/user/${user?.person?.name}`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="w-4 h-4 mr-3 text-gray-500" />
                    <span>{globalLanguageData?.freelancerProfile}</span>
                  </Link>
                  <Link prefetch={false}
                    href="/seller-account-setting/freelance-profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="w-4 h-4 mr-3 text-gray-500" />
                    <span>{globalLanguageData?.menuAccountSettings}</span>
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={logout}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 mr-3 text-gray-500" />
                    <span>{globalLanguageData?.menuLogout}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default SellerHeader;
