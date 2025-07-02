"use client";
import { LanguageFile } from "@/constants/language";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { CreditCard, FileText, Mail, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Loading from "../Loading";
import Error from "@/app/error";
import { useLanguage } from "@/contexts/LanguageContext";

const SideBarSellerAccountSetting = () => {
  const pathname = usePathname();
const { lang } = useLanguage();
  const {
    data: sellerSidebarLanguage,
    isLoading,
    error,
  } = useGlobalTranslate(LanguageFile.GLOBAL);

  const menuItems = [
    {
      href: "/seller-account-setting/freelance-profile",
      label: sellerSidebarLanguage?.freelancer_account_info,
      icon: User,
    },
    {
      href: "/seller-account-setting/contact-info",
      label: sellerSidebarLanguage?.contact_info,
      icon: Mail,
    },
    {
      href: "/seller-account-setting/personal-info",
      label: sellerSidebarLanguage?.id_info,
      icon: FileText,
    },
    {
      href: "/seller-account-setting/commitment-letter",
      label: sellerSidebarLanguage?.tax_info,
      icon: FileText,
    },
    {
      href: "/seller-account-setting/bank-account",
      label: sellerSidebarLanguage?.bank_info,
      icon: CreditCard,
    },
  ];

  if (isLoading) return <Loading />;
  if (error) return <Error/>;

  return (
    <div className="md:col-span-1">
      <div className="bg-white rounded-md shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-medium text-gray-800">
            {sellerSidebarLanguage?.freelancer_account_section}
          </h3>
        </div>
        <nav>
          <ul>
            {menuItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === `/${lang}${href}`;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex items-center w-full px-4 py-3 text-left ${
                      isActive
                        ? "bg-blue-50 border-l-4 border-blue-500 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className={`w-5 h-5 mr-3 ${isActive ? "text-blue-600":"text-gray-500"}`} />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <h3 className="font-medium text-gray-800 mb-2">
            Job availability information
          </h3>
          <ul>
            <li>
              <Link
                href="/seller-account-setting/document-info"
                className={`flex items-center gap-3 w-full text-left ${
                  pathname === "/seller-account-setting/document-info"
                    ? "bg-blue-50 border-l-4 border-blue-500 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FileText className="min-w-5 w-5 h-5 text-gray-500" />
                Availability Settings
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideBarSellerAccountSetting;
