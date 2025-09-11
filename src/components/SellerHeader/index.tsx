"use client";
import {LanguageFile} from "@/constants/language";
import {useClickOutside} from "@/hooks/useClickOutside";
import {interpolate} from "@/utils/interpolate";
import {faBell, faComment} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {LogOut, Settings, User} from "lucide-react";
import Link from "next/link";
import {useState} from "react";
import LanguageDropdown from "../LanguageDropDown";
import Loading from "../Loading";
import Image from "next/image";
import {ProfileImage} from "@/constants/images";
import {useLanguage} from "@/contexts/LanguageContext";
import {UserService} from "@/services";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {getNamespace} from "@/utils/i18nHelper";
import {useTranslation} from "react-i18next";

const SellerHeader = () => {
  const {lang} = useLanguage();
  const {t} = useTranslation();
  const {data: globalLanguageData, isLoading, error} = getNamespace(LanguageFile.GLOBAL);
  const {person} = useMyUser();
  const logout = () => UserService.Instance.logout();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useClickOutside<HTMLDivElement>(() =>
    setIsProfileMenuOpen(false)
  );

  // Handle loading and error states
  if (isLoading) return <header className="bg-white border-b border-gray-200">
    <div className="flex items-center justify-between px-8 py-4"><Loading/></div>
  </header>;
  if (error) return <header className="bg-white border-b border-gray-200">
    <div className="flex items-center justify-between px-8 py-4 text-red-500">Error loading translations</div>
  </header>;
  if (!globalLanguageData) return <header className="bg-white border-b border-gray-200">
    <div className="flex items-center justify-between px-8 py-4">No translation data available</div>
  </header>;


  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-8 py-4">
        <h1 className="text-xl text-text-primary">
          {interpolate(t("global.greetingUser"),
            {
              username: person?.name || "",
            })}
        </h1>
        <div className="flex items-center space-x-4">
          <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center">
            <span>{t("global.fastworkRewardsButton")}</span>
            <span className="ml-2 bg-blue-500 px-2 py-0.5 rounded text-xs">
              {t("global.fastworkRewardsSubtext")}
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
            <LanguageDropdown/>
          </div>
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={toggleProfileMenu}
              className="flex justify-center items-center"
            >
              <Image
                src={person?.avatar || ProfileImage.avatar}
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
                        href={`${lang}/user/${person?.name}`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="w-4 h-4 mr-3 text-gray-500"/>
                    <span>{t("global.freelancerProfile")}</span>
                  </Link>
                  <Link prefetch={false}
                        href="/seller-account-setting/freelance-profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="w-4 h-4 mr-3 text-gray-500"/>
                    <span>{t("global.menuAccountSettings")}</span>
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={logout}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 mr-3 text-gray-500"/>
                    <span>{t("global.menuLogout")}</span>
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
