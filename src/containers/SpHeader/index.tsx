"use client";

import {LANGUAGES} from "@/constants/language";
import {useLanguage} from "@/contexts/LanguageContext";
import {faBullhorn} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ArrowLeft, CircleUserRound, Grip, House, Search} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import LanguageBottomSheet from "../SpBottomTab";
import SPSearch from "./components/SPSearch";
import SpUserAvatar from "./components/SpUserProfile";
import {UserService} from "@/services";

type SpHeaderProps = {
    showSearch?: boolean;
    showBackButton?: boolean; // New prop for controlling back button visibility
};

const SpHeader = ({ showSearch = true, showBackButton = false }: SpHeaderProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const isLoggedIn = UserService.Instance.isLoggedIn;
    const pathname = usePathname();
    const router = useRouter();
    const [showLang, setShowLang] = useState(false);
    const { lang } = useLanguage();
    const currentLang = LANGUAGES[lang as keyof typeof LANGUAGES];

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;
    if (!isLoggedIn && pathname !== `/${lang}/login`) return null;

    return (
        <header
            style={{ backgroundColor: "#1754b0" }}
            className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300"
        >
            <nav className="flex items-center justify-between h-auto py-2 px-3 sm:px-4">
                <div className="flex items-center gap-2 sm:gap-3">
                    {showBackButton && (
                        <button
                            onClick={() => router.back()}
                            className="p-2 text-white hover:bg-blue-700 rounded-full"
                            aria-label="Go back"
                        >
                            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    )}
                    <div className="flex items-center">
                        <Link
                            prefetch={false}
                            href="/"
                            className={`flex items-center justify-center p-2 text-white cursor-pointer min-w-[44px] ${
                                pathname === `/${lang}` ? "bg-primary" : ""
                            }`}
                        >
                            <House className="w-5 h-5 sm:w-6 sm:h-6 mx-1" />
                        </Link>
                        <Link
                            prefetch={false}
                            href="/categories/popular-service"
                            className={`flex items-center justify-center p-2 text-white cursor-pointer min-w-[44px] ${
                                pathname === `/${lang}/categories/popular-service` ? "bg-primary" : ""
                            }`}
                        >
                            <Grip className="w-5 h-5 sm:w-6 sm:h-6 mx-1" />
                        </Link>
                        <Link
                            prefetch={false}
                            href="/job/search"
                            className={`flex items-center justify-center p-2 text-white cursor-pointer min-w-[44px] ${
                                pathname === `/${lang}/job/search` ? "bg-primary" : ""
                            }`}
                        >
                            <Search className="w-5 h-5 sm:w-6 sm:h-6 mx-1" />
                        </Link>
                        <Link
                            prefetch={false}
                            href="/job-board"
                            className={`flex items-center justify-center p-2 text-white cursor-pointer min-w-[44px] ${
                                pathname === `/${lang}/job-board` ? "bg-primary" : ""
                            }`}
                        >
                            <FontAwesomeIcon
                                icon={faBullhorn}
                                className="w-5 h-5 sm:w-6 sm:h-6 mx-1"
                            />
                        </Link>
                        <button
                            onClick={() => setShowLang(true)}
                            className="flex items-center justify-center p-2 text-white cursor-pointer min-w-[44px]"
                            aria-label={`Select language: ${currentLang.label}`}
                        >
                            <Image
                                src={currentLang.flag}
                                alt={currentLang.label}
                                width={24}
                                height={24}
                                className="sm:w-[30px] sm:h-[30px]"
                            />
                        </button>
                        {isLoggedIn ? (
                            <SpUserAvatar />
                        ) : (
                            <Link
                                prefetch={false}
                                href="/login"
                                className="flex items-center justify-center p-2 text-white cursor-pointer min-w-[44px]"
                                aria-label="Login"
                            >
                                <CircleUserRound className="w-6 h-6 sm:w-8 sm:h-8" />
                            </Link>
                        )}
                    </div>
                </div>
                {showSearch && (
                    <div className="w-full mt-2 sm:w-auto sm:mt-0">
                        <SPSearch />
                    </div>
                )}
            </nav>
            <LanguageBottomSheet open={showLang} onClose={() => setShowLang(false)} />
        </header>
    );
};

export default SpHeader;