"use client";
import { AssetIcon, ProfileIcon } from "@/constants/icons";
import { ProfileImage } from "@/constants/images";
import { LanguageFile } from "@/constants/language";
import { ROLE } from "@/constants/role";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { useToggle } from "@/hooks/useToggle";
import {
  faChevronDown,
  faComment,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Loading from "../Loading";
import MegaMenu from "../MegaMenu";
import NotificationDropdown from "../NotificationDropdown";
import { useScrollHandler } from "./hooks/useScrollHandler";
import ProfileSection from "./ProfileSection";

const TYPES: Record<string, { bg: string }> = {
  transparent: {
    bg: "#transparent",
  },
  primary: {
    bg: "bg-primary",
  },
};

interface BgProps {
  type: keyof typeof TYPES;
}

const Header = ({ type }: BgProps) => {
  const { data: session } = useSession();

  const { scrollY, showSearch } = useScrollHandler();
  const { isOpen, toggle, close } = useToggle();

    const {
      data: globalLanguageData,
      isLoading,
      error,
    } = useGlobalTranslate(LanguageFile.GLOBAL);

  const { bg } = TYPES[type];

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading language data</div>;

  return (
    <header
      className={`fixed top-0 z-[999] w-full transition-all duration-300 ${
        scrollY > 0 ? "bg-primary" : bg
      }`}
    >
      <nav className="mx-[1.5rem] flex h-[70px] items-center justify-between">
        <div className="grid grid-flow-col items-center gap-x-4">
          <Link href="/">
            <Image src={AssetIcon.logo} alt="logo" className="w-full h-full" />
          </Link>

          <div
            className={`flex text-black h-[40px] relative w-full transition-all duration-300 ${
              showSearch ? "opacity-100 " : "opacity-0 pointer-events-none"
            }`}
          >
            <input
              type="text"
              className="focus:outline-none rounded-[20px] border-2-white px-5 text-sm font-mono w-full"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="w-[14px] h-[14px] text-primary absolute right-3 top-1/2 -translate-y-1/2"
            />
          </div>
        </div>
        <div className="flex items-center gap-4 h-full">
          <div className="group">
            <div className="relative">
              <div className="text-[14px] text-[#1d6cd2] px-3 py-2 bg-white rounded-md font-medium flex flex-row items-center gap-2 cursor-pointer">
                <p className="">
                  {globalLanguageData?.label_employment_button}
                </p>
                <FontAwesomeIcon icon={faChevronDown} />
              </div>
              <div className="absolute left-0 right-0 w-[110px] bg-transparent h-4"></div>
            </div>
            <div className="absolute left-0 right-0 w-screen opacity-0 scale-y-0 origin-top top-[70px] shadow-megaMenu px-[2rem] py-[3rem] flex text-[rgba(43,50,59,.95)] z-50 bg-white group-hover:opacity-100 group-hover:scale-y-100 group-hover:min-h-[550px] transition-all duration-300">
              <MegaMenu />
            </div>
          </div>
          {session?.user.roles?.includes(ROLE.FREELANCER) && (
            <Link
              href="/seller"
              className="text-white text-sm hover:bg-blue-800 hover:text-white border-r-[1px] pr-4"
            >
              {globalLanguageData?.label_seller_center}
            </Link>
          )}
          <Link
            href="/start-selling"
            className="text-white text-sm hover:bg-blue-800 hover:text-white border-r-[1px] pr-4"
          >
            {globalLanguageData?.label_apply_to_be_freelancer_button}
          </Link>
          {session?.user.roles?.includes(ROLE.EMPLOYER) && (
            <>
              <Link
                href="/chat"
                className="text-white text-sm hover:bg-blue-800 hover:text-white px-3"
              >
                <FontAwesomeIcon
                  icon={faComment}
                  className="w-[24px] h-[24px] text-white"
                  size="4x"
                />
              </Link>
              <NotificationDropdown />
              <Link
                href="/login"
                className="text-white text-sm hover:bg-blue-800 hover:text-white"
              >
                <div className="flex items-center gap-2 bg-white rounded-full h-[2rem]">
                  <p className="text-third text-[12px] pl-2">0.00</p>
                  <Image
                    src={ProfileIcon.coins}
                    alt="avatar"
                    className="w-full h-full"
                  />
                </div>
              </Link>
              <div className="relative px-4">
                <button
                  onClick={() => toggle()}
                  className="flex items-center justify-center gap-2 w-12 h-12 rounded-full "
                >
                  <Image
                    src={ProfileImage.avatar}
                    alt="avatar"
                    className="rounded-full"
                  />
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className="w-[14px] h-[14px] text-white"
                  />
                </button>

                {isOpen && <ProfileSection data={globalLanguageData} />}

                {isOpen && (
                  <div className="fixed inset-0 z-40" onClick={() => close()} />
                )}
              </div>
            </>
          )}

          {!session && (
            <Link
              href="/login"
              className="text-white text-sm hover:bg-blue-800 hover:text-white"
            >
              {globalLanguageData?.label_login_button}
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;

// "use client";
// import { AssetIcon, ProfileIcon } from "@/constants/icons";
// import { ProfileImage } from "@/constants/images";
// import { GlobalLanguage } from "@/types/language";
// import {
//   faBarsProgress,
//   faBullhorn,
//   faChevronDown,
//   faCodePullRequest,
//   faCoins,
//   faComment,
//   faGear,
//   faGift,
//   faHeart,
//   faMessage,
//   faSearch,
//   faSignOut,
//   faTicket,
// } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import MegaMenu from "../MegaMenu";
// import NotificationDropdown from "../NotificationDropdown";

// const TYPES: Record<string, { bg: string }> = {
//   transparent: {
//     bg: "#transparent",
//   },
//   primary: {
//     bg: "bg-primary",
//   },
// };

// interface BgProps {
//   type: keyof typeof TYPES;
// }

// interface HeaderProps extends BgProps {
//   languageData: GlobalLanguage | null;
// }

// const Header = ({ type, languageData }: HeaderProps) => {
//   const [scrollY, setScrollY] = useState(0);
//   const [showSearch, setShowSearch] = useState(false);

//   const [isOpen, setIsOpen] = useState(false);

//   const { bg } = TYPES[type];

//   useEffect(() => {
//     const handleScroll = () => {
//       const currentScrollY = window.scrollY;
//       setScrollY(currentScrollY);
//       setShowSearch(currentScrollY > window.innerHeight / 2);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <header
//       className={`fixed top-0 z-[999] w-full transition-all duration-300 ${
//         scrollY > 0 ? "bg-primary" : bg
//       }`}
//     >
//       <nav className="mx-[1.5rem] flex h-[70px] items-center justify-between">
//         <div className="grid grid-flow-col items-center gap-x-4">
//           <Link href="/">
//             <Image src={AssetIcon.logo} alt="logo" className="w-full h-full" />
//           </Link>

//           <div
//             className={`flex text-black h-[40px] relative w-full transition-all duration-300 ${
//               showSearch ? "opacity-100 " : "opacity-0 pointer-events-none"
//             }`}
//           >
//             <input
//               type="text"
//               className="focus:outline-none rounded-[20px] border-2-white px-5 text-sm font-mono w-full"
//             />
//             <FontAwesomeIcon
//               icon={faSearch}
//               className="w-[14px] h-[14px] text-primary absolute right-3 top-1/2 -translate-y-1/2"
//             />
//           </div>
//         </div>
//         <div className="flex items-center gap-4 h-full">
//           <div className="group">
//             <div className="relative">
//               <div className="text-[14px] text-[#1d6cd2] px-3 py-2 bg-white rounded-md font-medium flex flex-row items-center gap-2 cursor-pointer">
//                 <p className="">{languageData?.label_employment_button}</p>
//                 <FontAwesomeIcon icon={faChevronDown} />
//               </div>
//               <div className="absolute left-0 right-0 w-[110px] bg-transparent h-4"></div>
//             </div>
//             <div className="absolute left-0 right-0 w-screen opacity-0 scale-y-0 origin-top top-[70px] shadow-megaMenu px-[2rem] py-[3rem] flex text-[rgba(43,50,59,.95)] z-50 bg-white group-hover:opacity-100 group-hover:scale-y-100 group-hover:min-h-[550px] transition-all duration-300">
//               <MegaMenu />
//             </div>
//           </div>
//           <Link
//             href="/seller"
//             className="text-white text-sm hover:bg-blue-800 hover:text-white border-r-[1px] pr-4"
//           >
//             {languageData?.label_seller_center}
//           </Link>
//           <Link
//             href="/start-selling"
//             className="text-white text-sm hover:bg-blue-800 hover:text-white border-r-[1px] pr-4"
//           >
//             {languageData?.label_apply_to_be_freelancer_button}
//           </Link>
//           <Link
//             href="/login"
//             className="text-white text-sm hover:bg-blue-800 hover:text-white"
//           >
//             {languageData?.label_login_button}
//           </Link>
//           <Link
//             href="/chat"
//             className="text-white text-sm hover:bg-blue-800 hover:text-white px-3"
//           >
//             <FontAwesomeIcon
//               icon={faComment}
//               className="w-[24px] h-[24px] text-white"
//               size="4x"
//             />
//           </Link>
//           <NotificationDropdown />
//           <Link
//             href="/login"
//             className="text-white text-sm hover:bg-blue-800 hover:text-white"
//           >
//             <div className="flex items-center gap-2 bg-white rounded-full h-[2rem]">
//               <p className="text-third text-[12px] pl-2">0.00</p>
//               <Image
//                 src={ProfileIcon.coins}
//                 alt="avatar"
//                 className="w-full h-full"
//               />
//             </div>
//           </Link>
//           <div className="relative px-4">
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="flex items-center justify-center gap-2 w-12 h-12 rounded-full "
//             >
//               <Image
//                 src={ProfileImage.avatar}
//                 alt="avatar"
//                 className="rounded-full"
//               />
//               <FontAwesomeIcon
//                 icon={faChevronDown}
//                 className="w-[14px] h-[14px] text-white"
//               />
//             </button>

//             {isOpen && (
//               <div className="absolute right-0 mt-2 w-[22rem] bg-white rounded-lg shadow-jobCard z-50 select-none">
//                 <div className="p-4 border-b border-gray-100 bg-[#D0E1FB] rounded-tl-lg rounded-tr-lg">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
//                       <Image
//                         src={ProfileImage.avatar}
//                         alt="avatar"
//                         className="rounded-full"
//                       />
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-900">uykpfzno</p>
//                       <Link
//                         href="/user"
//                         className="text-sm text-blue-600 hover:underline"
//                       >
//                         {languageData?.label_view_profile}
//                       </Link>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="py-2">
//                   <Link
//                     href="/coin"
//                     className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
//                   >
//                     <FontAwesomeIcon
//                       icon={faCoins}
//                       className="text-[24px] text-primary "
//                     />
//                     <span className="text-gray-700">Coins 0.00</span>
//                   </Link>
//                   <Link
//                     href="/account-setting"
//                     className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
//                   >
//                     <FontAwesomeIcon
//                       icon={faGear}
//                       className="text-[24px] text-primary "
//                     />
//                     <span className="text-gray-700">
//                       {languageData?.menu_account_settings}
//                     </span>
//                   </Link>
//                   <Link
//                     href="/chat"
//                     className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
//                   >
//                     <FontAwesomeIcon
//                       icon={faMessage}
//                       className="text-[24px] text-primary "
//                     />
//                     <span className="text-gray-700">
//                       {languageData?.menu_messages_orders}
//                     </span>
//                   </Link>
//                   <Link
//                     href="/promotion"
//                     className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
//                   >
//                     <FontAwesomeIcon
//                       icon={faTicket}
//                       className="text-[24px] text-primary "
//                     />
//                     <span className="text-gray-700">
//                       {languageData?.menu_coupons}
//                     </span>
//                   </Link>
//                   <Link
//                     href="/favorites"
//                     className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
//                   >
//                     <FontAwesomeIcon
//                       icon={faHeart}
//                       className="text-[24px] text-primary "
//                     />
//                     <span className="text-gray-700">
//                       {languageData?.menu_favorite_jobs}
//                     </span>
//                   </Link>
//                   <Link
//                     href="/job-board"
//                     className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
//                   >
//                     <FontAwesomeIcon
//                       icon={faBullhorn}
//                       className="text-[24px] text-primary "
//                     />
//                     <span className="text-gray-700">
//                       {languageData?.menu_job_board}
//                     </span>
//                   </Link>
//                   <Link
//                     href="/reward/earn"
//                     className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
//                   >
//                     <FontAwesomeIcon
//                       icon={faGift}
//                       className="text-[24px] text-primary "
//                     />
//                     <span className="text-gray-700">Rewards</span>
//                     <span className="ml-2 px-2 py-1 text-xs text-white bg-blue-500 rounded">
//                       New
//                     </span>
//                   </Link>
//                   <Link
//                     href="/start-selling"
//                     className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
//                   >
//                     <FontAwesomeIcon
//                       icon={faCodePullRequest}
//                       className="text-[24px] text-primary "
//                     />
//                     <span className="text-gray-700">
//                       {languageData?.menu_become_freelancer}
//                     </span>
//                   </Link>
//                   <Link
//                     href="/consent-management"
//                     className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
//                   >
//                     <FontAwesomeIcon
//                       icon={faBarsProgress}
//                       className="text-[24px] text-primary "
//                     />
//                     <span className="text-gray-700">
//                       {languageData?.menu_data_management}
//                     </span>
//                   </Link>
//                   <Link
//                     href="#"
//                     className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50 border-t"
//                   >
//                     <FontAwesomeIcon
//                       icon={faSignOut}
//                       className="text-[24px] text-primary "
//                     />
//                     <span className="text-gray-700">
//                       {languageData?.menu_logout}
//                     </span>
//                   </Link>
//                 </div>
//               </div>
//             )}

//             {isOpen && (
//               <div
//                 className="fixed inset-0 z-40"
//                 onClick={() => setIsOpen(false)}
//               />
//             )}
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Header;
