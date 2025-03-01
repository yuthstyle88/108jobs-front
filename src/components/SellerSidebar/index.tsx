"use client";

import { AssetIcon } from "@/constants/icons";
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

const SellerSidebar = () => {
  const [isClose, setIsClose] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div
      className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-150 ${
        isClose ? "w-16" : "w-64"
      }`}
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
          { href: "/seller", icon: faFileContract, label: "Tổng quan" },
          {
            href: "/seller/project-management",
            icon: faListCheck,
            label: "Quản lý dự án",
          },
          {
            href: "/seller/account-statistics",
            icon: faIdCard,
            label: "Thống kê tài khoản",
          },
          {
            href: "/seller/my-service",
            icon: faCalendar,
            label: "Dịch vụ của tôi",
          },
          {
            href: "/seller/withdrawal",
            icon: faMoneyBill1Wave,
            label: "Rút tiền freelancer",
          },
          {
            href: "/reward/earn",
            icon: faGift,
            label: "Phần thưởng Fastlance",
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
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
            Gửi phản hồi
          </Link>
          <Link
            href="#"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            Trung tâm hỗ trợ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellerSidebar;
