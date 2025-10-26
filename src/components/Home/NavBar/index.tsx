import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faMagnifyingGlass, faBagShopping} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Image from "next/image";
import {AssetIcon} from "@/constants/icons";
import Search from "@/components/Header/components/Search";

/**
 * Minimal NavBar: renders a mobile menu toggle button.
 * State is controlled by parent via props.
 */
export type NavBarProps = {
    isSidebarOpen?: boolean;
    onToggleSidebar?: () => void;
    showSearch?: boolean;
    className?: string; // optional styling from parent
};

const NavBar: React.FC<NavBarProps> = ({
                                           isSidebarOpen = false,
                                           onToggleSidebar,
                                           showSearch = false,
                                           className = "",
                                       }) => {
    return (
        <nav className={`flex items-center justify-between px-3 py-2 ${className}`}>
            <Link href="/" aria-label="Home"
               className="p-2 text-white/90 hover:text-white focus:outline-none rounded-full hover:bg-white/10">
                <Image
                    src={AssetIcon.logo}
                    alt="logo"
                    className="w-full h-full"
                    width={200}
                    height={200}
                    priority
                />
            </Link>

            {/* Right: search, bag, hamburger */}
            <div className="flex items-center gap-2">
                <div className="block md:hidden">
                    <Search showSearch={showSearch} />
                </div>
                <button
                    type="button"
                    className="md:hidden w-9 h-9 grid place-items-center rounded-full text-white/90 hover:text-white hover:bg-white/10 focus:outline-none"
                    onClick={onToggleSidebar}
                    aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
                >
                    <FontAwesomeIcon icon={faBars} className="w-4 h-4"/>
                </button>
            </div>
        </nav>
    );
};

export default NavBar;
