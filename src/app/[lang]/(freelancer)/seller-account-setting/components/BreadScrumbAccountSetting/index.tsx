"use client";
import {LanguageFile} from "@/constants/language";
import {useLanguage} from "@/contexts/LanguageContext";
import {getNamespace} from "@/utils/i18nHelper";
import Link from "next/link";
import {usePathname} from "next/navigation";
import React from "react";


const BreadCrumbAccountSetting = () => {
  const breadcrumbLanguage = getNamespace(
    LanguageFile.BREAD_CRUMB
  );

  const pathname = usePathname();
  const {lang} = useLanguage();

  const menuItems = [
    {
      href: "/seller-account-setting/freelance-profile",
      label: breadcrumbLanguage?.freelancerInforBreadcrumb,
    },
    {
      href: "/seller-account-setting/contact-info",
      label: breadcrumbLanguage?.contactInfoBreadcrumb,
    },
    {
      href: "/seller-account-setting/personal-info",
      label: breadcrumbLanguage?.idCardInformationBreadcrumb,
    },
    {
      href: "/seller-account-setting/commitment-letter",
      label: breadcrumbLanguage?.commitmentLetterBreadcrumb,
    },
    {
      href: "/seller-account-setting/bank-account",
      label: breadcrumbLanguage?.bankAccountInformationBreadcrumb,
    },
  ];

  const currentItem = menuItems.find(
    (item) => `/${lang}${item.href}` === pathname
  );

  return (
    <div className="flex items-center text-blue-600 text-[13px]">
      <Link prefetch={false} href="/seller" className="text-blue-600 font-medium">
        {breadcrumbLanguage?.sellerCenterBreadcrumb}
      </Link>
      <span className="mx-2 text-gray-400">/</span>
      <span className="text-gray-600">
        {breadcrumbLanguage?.accountSettingsBreadcrumb}
      </span>
      <span className="mx-2 text-gray-400">/</span>
      <span className="text-gray-600">{currentItem?.label}</span>
    </div>
  );
};

export default BreadCrumbAccountSetting;
