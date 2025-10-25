import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMagnifyingGlass, faBagShopping } from "@fortawesome/free-solid-svg-icons";
import { faApple } from "@fortawesome/free-brands-svg-icons";

/**
 * Minimal NavBar: renders a mobile menu toggle button.
 * State is controlled by parent via props.
 */
export type NavBarProps = {
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  className?: string; // optional styling from parent
};

const NavBar: React.FC<NavBarProps> = ({
  isSidebarOpen = false,
  onToggleSidebar,
  className = "",
}) => {
  return (
    <nav className={`flex items-center justify-between px-3 py-2 ${className}`}>
      {/* Left: Apple logo (home) */}
      <a href="/" aria-label="Home" className="p-2 text-white/90 hover:text-white focus:outline-none rounded-full hover:bg-white/10">
        <FontAwesomeIcon icon={faApple} className="w-5 h-5" />
      </a>

      {/* Right: search, bag, hamburger */}
      <div className="flex items-center gap-2">
        <button type="button" aria-label="Search" className="w-9 h-9 grid place-items-center rounded-full text-white/90 hover:text-white hover:bg-white/10 focus:outline-none">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="w-4 h-4" />
        </button>
        <button type="button" aria-label="Bag" className="w-9 h-9 grid place-items-center rounded-full text-white/90 hover:text-white hover:bg-white/10 focus:outline-none">
          <FontAwesomeIcon icon={faBagShopping} className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="md:hidden w-9 h-9 grid place-items-center rounded-full text-white/90 hover:text-white hover:bg-white/10 focus:outline-none"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
        >
          <FontAwesomeIcon icon={faBars} className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
