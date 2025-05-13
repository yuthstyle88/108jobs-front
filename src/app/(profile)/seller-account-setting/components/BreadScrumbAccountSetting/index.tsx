"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const menuItems = [
  {
    href: "/seller-account-setting/freelance-profile",
    label: "Freelancer's Info",
  },
  {
    href: "/seller-account-setting/contact-info",
    label: "Contact Info",
  },
  {
    href: "/seller-account-setting/personal-info",
    label: "Id Card Information",
  },
  {
    href: "/seller-account-setting/commitment-letter",
    label: "Income submission information to the tax authorities",
  },
  {
    href: "/seller-account-setting/bank-account",
    label: "Bank Account Information",
  },
];

const BreadCrumbAccountSetting = () => {
  const pathname = usePathname();

  const currentItem = menuItems.find((item) => item.href === pathname);
  return (
    <div className="flex items-center text-blue-600 text-[13px]">
      <Link href="/seller" className="text-blue-600 font-medium">
        Seller center
      </Link>
      <span className="mx-2 text-gray-400">/</span>
      <span className="text-gray-600">Account setting</span>
      <span className="mx-2 text-gray-400">/</span>
      <span className="text-gray-600">{currentItem?.label}</span>
    </div>
  );
};

export default BreadCrumbAccountSetting;
