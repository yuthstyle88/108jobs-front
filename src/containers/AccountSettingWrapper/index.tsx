"use client";
import { LanguageFile } from "@/constants/language";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AccountSettingWrapper() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

   const {
     data: navbarAccountData,
     isLoading,
     error,
   } = useGlobalTranslate(LanguageFile.ACCOUNT_NAVBAR);

   if (isLoading) return <p>Loading...</p>;
   if (error) return <p>Error loading data.</p>;

  return (
    <div>
      <p className="font-medium text-[16px] text-text_primary pb-[16px]">
      {navbarAccountData?.section_account}
      </p>
      <div className="flex flex-col mt-4">
        <Link
          href="/account-setting/basic-info"
          className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-4 ${
            isActive("/account-setting/basic-info")
              ? "text-blue-600 border-l-4 border-third bg-blue-50"
              : "text-gray-600 hover:text-gray-800 border-l-transparent hover:bg-gray-50"
          }`}
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>{navbarAccountData?.account_info}</span>
        </Link>

        <Link
          href="/account-setting/contact-info"
          className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-4  ${
            isActive("/account-setting/contact-info")
              ? "text-blue-600 border-l-4 border-third bg-blue-50"
              : "text-gray-600 hover:text-gray-800 border-l-transparent hover:bg-gray-50"
          }`}
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <span>{navbarAccountData?.contact_info}</span>
        </Link>

        <p className="font-medium text-[16px] text-text_primary py-4">
        {navbarAccountData?.section_hiring}
        </p>

        <Link
          href="/account-setting/document-info"
          className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-4 ${
            isActive("/account-setting/document-info")
              ? "text-blue-600 border-l-4 border-third bg-blue-50"
              : "text-gray-600 hover:text-gray-800 border-l-transparent hover:bg-gray-50"
          }`}
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{navbarAccountData?.personal_hiring_info}</span>
        </Link>

         <Link
          href="/account-setting/company-info"
          className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-4 ${
            isActive("/account-setting/company-info")
              ? "text-blue-600 border-l-4 border-third bg-blue-50"
              : "text-gray-600 hover:text-gray-800 border-l-transparent hover:bg-gray-50"
          }`}
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 3h18v18H3z" />
            <path d="M3 9h18" />
            <path d="M9 21V9" />
          </svg>
          <span>{navbarAccountData?.company_hiring_info}</span>
        </Link>
      </div>
    </div>
  );
}
