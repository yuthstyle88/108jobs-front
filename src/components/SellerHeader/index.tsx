"use client";
import { API_ROUTES } from "@/api/endpoints";
import { LanguageFile } from "@/constants/language";
import { usePrivateFetch } from "@/hooks/api-hooks";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { useClickOutside } from "@/hooks/useClickOutside";
import { ProfileData } from "@/types/userData";
import { interpolate } from "@/utils/interpolate";
import { faBell, faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Loading from "../Loading";
import { useLogout } from "@/hooks/useLogout";

const SellerHeader = () => {
  const { data: globalLanguageData } = useGlobalTranslate(LanguageFile.GLOBAL);
  const {
    data: user,
    isLoading,
    error,
  } = usePrivateFetch<ProfileData>(API_ROUTES.profile.get_profile);

  const { logout } = useLogout();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useClickOutside<HTMLDivElement>(() =>
    setIsProfileMenuOpen(false)
  );

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading language data</div>;

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-8 py-4">
        <h1 className="text-xl text-text_primary">
          {interpolate(globalLanguageData?.greeting_user || "", {
            username: user?.user.username || "",
          })}
        </h1>
        <div className="flex items-center space-x-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center">
            <span>{globalLanguageData?.fastwork_rewards_button}</span>
            <span className="ml-2 bg-blue-500 px-2 py-0.5 rounded text-xs">
              {globalLanguageData?.fastwork_rewards_subtext}
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
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={toggleProfileMenu}
              className="w-8 h-8 bg-black rounded-full overflow-hidden"
            >
              {/* Avatar image can be added here */}
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                <div className="py-2">
                  <Link
                    href={`/user/${user?.user.username}`}
                    target="_blank"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="w-4 h-4 mr-3 text-gray-500" />
                    <span>Hồ sơ freelancer</span>
                  </Link>
                  <Link
                    href="/seller-account-setting/freelance-profile"
                    target="_blank"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="w-4 h-4 mr-3 text-gray-500" />
                    <span>{globalLanguageData?.menu_account_settings}</span>
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={logout}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 mr-3 text-gray-500" />
                    <span>{globalLanguageData?.menu_logout}</span>
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
