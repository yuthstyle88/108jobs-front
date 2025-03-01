"use client";
import { faBell, faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LogOut, Settings, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SellerHeader = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-8 py-4">
        <h1 className="text-xl text-text_primary">Xin chào, bth335yq</h1>
        <div className="flex items-center space-x-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center">
            <span>Fastlance Rewards</span>
            <span className="ml-2 bg-blue-500 px-2 py-0.5 rounded text-xs">
              Tích điểm để đổi thưởng
            </span>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FontAwesomeIcon
              icon={faComment}
              className="text-[20px] text-third "
            />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FontAwesomeIcon
              icon={faBell}
              className="text-[20px] text-third "
            />
          </button>
          <div className="relative" ref={profileMenuRef}>
                <button 
                  onClick={toggleProfileMenu}
                  className="w-8 h-8 bg-black rounded-full overflow-hidden"
                >
                  {/* Avatar image can be added here */}
                </button>
                
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                    <div className="py-2">
                      <a href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <User className="w-4 h-4 mr-3 text-gray-500" />
                        <span>Hồ sơ freelancer</span>
                      </a>
                      <a href="/profile/edit/education" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Settings className="w-4 h-4 mr-3 text-gray-500" />
                        <span>Cài đặt tài khoản</span>
                      </a>
                      <div className="border-t border-gray-100 my-1"></div>
                      <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <LogOut className="w-4 h-4 mr-3 text-gray-500" />
                        <span>Đăng xuất</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
        </div>
      </div>
    </header>
  );
};

export default SellerHeader;
