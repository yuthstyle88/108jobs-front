"use client";
import Loading from "@/components/Loading";
import { LanguageFile } from "@/constants/language";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const BreadCrumbAccountSetting = () => {
  const { data: breadcrumbLanguage, isLoading } = useGlobalTranslate(
    LanguageFile.BREAD_CRUMB
  );

  const pathname = usePathname();
  const { lang } = useLanguage();

  const menuItems = [
    {
      href: "/seller-account-setting/freelance-profile",
      label: breadcrumbLanguage?.freelancer_infor_breadcrumb,
    },
    {
      href: "/seller-account-setting/contact-info",
      label: breadcrumbLanguage?.contact_info_breadcrumb,
    },
    {
      href: "/seller-account-setting/personal-info",
      label: breadcrumbLanguage?.id_card_information_breadcrumb,
    },
    {
      href: "/seller-account-setting/commitment-letter",
      label: breadcrumbLanguage?.commitment_letter_breadcrumb,
    },
    {
      href: "/seller-account-setting/bank-account",
      label: breadcrumbLanguage?.bank_account_information_breadcrumb,
    },
  ];

  const currentItem = menuItems.find(
    (item) => `/${lang}${item.href}` === pathname
  );

  if (isLoading) return <Loading />;
  return (
    <div className="flex items-center text-blue-600 text-[13px]">
      <Link href="/seller" className="text-blue-600 font-medium">
        {breadcrumbLanguage?.seller_center_breadcrumb}
      </Link>
      <span className="mx-2 text-gray-400">/</span>
      <span className="text-gray-600">
        {breadcrumbLanguage?.account_settings_breadcrumb}
      </span>
      <span className="mx-2 text-gray-400">/</span>
      <span className="text-gray-600">{currentItem?.label}</span>
    </div>
  );
};

export default BreadCrumbAccountSetting;
