"use client";
import {useTranslation} from "react-i18next";
import {usePathname} from "next/navigation";
import {useLanguage} from "@/contexts/LanguageContext";
import Link from "next/link";
import {Briefcase, CreditCard, IdCard, MapPin, ShieldCheck, User} from "lucide-react";

const AccountSettingWrapper = () => {
    const { t } = useTranslation();
    const pathname = usePathname();
    const { lang } = useLanguage();

    const accountMenu = [
        {
            href: "/account-setting/basic-info",
            label: t("profileNavbar.accountInfo"),
            icon: User
        },
        {
            href: "/account-setting/id-card",
            label: t("profileNavbar.idInfo"),
            icon: IdCard
        },
        {
            href: "/account-setting/address",
            label: t("profileContact.sectionAddressInfo"),
            icon: MapPin
        },
        {
            href: "/account-setting/bank-account",
            label: t("profileNavbar.bankInfo"),
            icon: CreditCard
        },
    ];

    const hiringMenu = [
        {
            href: "/account-setting/manage",
            label: t("profileNavbar.consentManage"),
            icon: ShieldCheck
        },
        {
            href: "/account-setting/job-available-setting",
            label: t("profileNavbar.jobAvailability"),
            icon: Briefcase
        }
    ];

    const renderMenu = (items: typeof accountMenu) =>
        items.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === `/${lang}${href}`;
            return (
                <li key={href}>
                    <Link
                        prefetch={false}
                        href={href}
                        className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-4 ${isActive
                                ? "text-blue-600 border-l-4 border-third bg-blue-50"
                                : "text-gray-600 hover:text-gray-800 border-l-transparent hover:bg-gray-50"
                            }`}
                    >
                        <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : ""}`} />
                        {label}
                    </Link>
                </li>
            );
        });

    return (
        <div>
            <p className="font-medium text-[16px] text-text-primary pb-[16px]">
                {t("profileNavbar.sectionAccount")}
            </p>
            <ul className="flex flex-col mt-4">{renderMenu(accountMenu)}</ul>

            <p className="font-medium text-[16px] text-text-primary py-4">
                {t("profileNavbar.sectionSetting")}
            </p>
            <ul>{renderMenu(hiringMenu)}</ul>
        </div>
    );
};

export default AccountSettingWrapper;
