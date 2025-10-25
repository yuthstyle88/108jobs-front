import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

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
    <nav className={className}>
      <button
        type="button"
        className="lg:hidden w-10 h-10 grid place-items-center rounded-lg border border-gray-300 text-gray-700 hover:text-blue-600 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={onToggleSidebar}
        aria-label={isSidebarOpen ? "Close catalog menu" : "Open catalog menu"}
      >
        <FontAwesomeIcon icon={faBars} className="w-6 h-6" />
      </button>
    </nav>
  );
};

export default NavBar;
