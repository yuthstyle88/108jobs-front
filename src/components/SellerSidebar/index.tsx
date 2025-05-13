"use client";

import { AssetIcon } from "@/constants/icons";
import { LanguageFile } from "@/constants/language";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import {
  faArrowRightToBracket,
  faCalendar,
  faFileContract,
  faGift,
  faIdCard,
  faListCheck,
  faMoneyBill1Wave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Loading from "../Loading";

const SellerSidebar = () => {
  const {
    data: globalLanguageData,
    isLoading,
    error,
  } = useGlobalTranslate(LanguageFile.GLOBAL);
  const [isClose, setIsClose] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const sidebarWidth = isClose ? "w-16" : "w-64";

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading language data</div>;

  return (
    <>
      <div className={`hidden md:block ${sidebarWidth}`} aria-hidden="true" />
      <div>
        <div
          className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-40 transition-all duration-200 hidden md:flex flex-col ${sidebarWidth}`}
        >
          <div className="h-[73px] border-b border-gray-200 flex items-center px-4">
            <div
              className={`flex items-center gap-3 min-w-0 overflow-hidden ${
                isClose ? "hidden" : "block"
              }`}
            >
              <div className="relative overflow-hidden flex items-center p-4">
                <Link href="/">
                  <Image
                    src={AssetIcon.logo_seller}
                    alt="avatar"
                    className="w-full h-full"
                  />
                </Link>
              </div>
            </div>
            <button onClick={() => setIsClose(!isClose)} className="ml-1">
              <FontAwesomeIcon
                icon={faArrowRightToBracket}
                className={`text-[18px] text-text_primary transition-transform ${
                  isClose ? "" : "rotate-180"
                }`}
              />
            </button>
          </div>

          <nav className="flex-1">
            {[
              {
                href: "/seller",
                icon: faFileContract,
                label: globalLanguageData?.sidebar_overview,
              },
              {
                href: "/seller/project-management",
                icon: faListCheck,
                label: globalLanguageData?.sidebar_project_management,
              },
              {
                href: "/seller/account-statistics",
                icon: faIdCard,
                label: globalLanguageData?.sidebar_account_statistics,
              },
              {
                href: "/seller/my-service",
                icon: faCalendar,
                label: globalLanguageData?.sidebar_my_services,
              },
              {
                href: "/seller/withdrawal",
                icon: faMoneyBill1Wave,
                label: globalLanguageData?.sidebar_withdraw_freelancer,
              },
              {
                href: "/reward/earn",
                icon: faGift,
                label: globalLanguageData?.sidebar_fastwork_rewards,
                target: "_blank",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                target={item.target}
                className={`group flex items-center gap-3 px-3 py-4 text-base ${
                  isActive(item.href)
                    ? "text-third border-primary bg-secondary"
                    : "text-text_secondary bg-white hover:border-primary hover:bg-secondary hover:text-third"
                } border-l-4 `}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className={`text-[16px] ${
                    isActive(item.href)
                      ? "text-third"
                      : "text-text_secondary group-hover:text-third"
                  }`}
                />
                <span
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                    isClose ? "hidden" : "block"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className={`${isClose ? "hidden" : "block"}`}>
              <Link
                href="#"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                {globalLanguageData?.sidebar_feedback}
              </Link>
              <Link
                href="#"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                {globalLanguageData?.sidebar_support_center}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerSidebar;
