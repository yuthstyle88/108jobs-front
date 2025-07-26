"use client";
import { AssetIcon } from "@/constants/icons";
import { LanguageFile } from "@/constants/language";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import LanguageDropdown from "../LanguageDropDown";
import MegaMenu from "./components/MegaMenu";
import Search from "./components/Search";
import { useScrollHandler } from "./hooks/useScrollHandler";
import Error from "@/app/error";
import { RoleType } from "lemmy-js-client";
import LazyImage from "@/components/ui/LazyImage";
import { memo } from "react";
import { UserService } from "@/services";
import ClientOnlyRoleSection from "./components/ClientOnlyRoleSection";
import ClientOnlyGuestSection from "./components/ClientOnlyGuestSection";

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
  forceShowSearch?: boolean;
}

const HeaderComponent = ({ type, forceShowSearch = false }: BgProps) => {
  const { scrollY, showSearch } = useScrollHandler(forceShowSearch);

  const {
    data: globalLanguageData,
    isLoading,
    error,
  } = useGlobalTranslate(LanguageFile.GLOBAL);

  const { bg } = TYPES[type];

  // if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <header
      className={`fixed top-0 z-[999] w-full transition-all duration-300 ${scrollY > 0 ? "bg-primary" : bg
        }`}
    >
      <nav className="mx-[1.5rem] flex flex-wrap items-center justify-center h-auto min-h-[70px] py-4 xl:py-1 xl:justify-between">
        <section className="flex items-center gap-x-4 w-full md:w-auto">
          <Link prefetch={false} href="/" className="shrink-0">
            <LazyImage
              imagePath="logo.svg"
              assetType="icons"
              alt="Fastwork Logo"
              className="w-full h-full"
              width={150}
              height={40}
              preload={true}
              trackPerformance={true}
              blurUp={true}
              fallback={AssetIcon.logo.src}
            />
          </Link>

          <Search language={globalLanguageData} showSearch={showSearch} />
        </section>

        <section className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0 justify-end">
          <ClientOnlyRoleSection globalLanguageData={globalLanguageData}/>
          <ClientOnlyGuestSection globalLanguageData={globalLanguageData} />
        </section>
      </nav>
    </header>
  );
};

// Memoize the component to prevent unnecessary re-renders
const Header = memo(HeaderComponent);

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
//           <Link prefetch={false} href="/">
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
//                 <p className="">{languageData?.labelEmploymentButton}</p>
//                 <FontAwesomeIcon icon={faChevronDown} />
//               </div>
//               <div className="absolute left-0 right-0 w-[110px] bg-transparent h-4"></div>
//             </div>
//             <div className="absolute left-0 right-0 w-screen opacity-0 scale-y-0 origin-top top-[70px] shadow-mega-menu px-[2rem] py-[3rem] flex text-[rgba(43,50,59,.95)] z-50 bg-white group-hover:opacity-100 group-hover:scale-y-100 group-hover:min-h-[550px] transition-all duration-300">
//               <MegaMenu />
//             </div>
//           </div>
//           <Link prefetch={false}
//             href="/seller"
//             className="text-white text-sm hover:bg-blue-800 hover:text-white border-r-[1px] pr-4"
//           >
//             {languageData?.labelSellerCenter}
//           </Link>
//           <Link prefetch={false}
//             href="/start-selling"
//             className="text-white text-sm hover:bg-blue-800 hover:text-white border-r-[1px] pr-4"
//           >
//             {languageData?.labelApplyToBeFreelancerButton}
//           </Link>
//           <Link prefetch={false}
//             href="/login"
//             className="text-white text-sm hover:bg-blue-800 hover:text-white"
//           >
//             {languageData?.labelSigninButton}
//           </Link>
//           <Link prefetch={false}
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
//           <Link prefetch={false}
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
//               <div className="absolute right-0 mt-2 w-[22rem] bg-white rounded-lg shadow-job-card z-50 select-none">
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
//                       <Link prefetch={false}
//                         href="/user"
//                         className="text-sm text-blue-600 hover:underline"
//                       >
//                         {languageData?.labelViewProfile}
//                       </Link>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="py-2">
//                   <Link prefetch={false}
//                     href="/coin"
//                     className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
//                   >
//                     <FontAwesomeIcon
//                       icon={faCoins}
//                       className="text-[24px] text-primary "
//                     />
//                     <span className="text-gray-700">Coins 0.00</span>
//                   </Link>
//                   <Link prefetch={false}
//                     href="/account-setting"
//                     className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
//                   >
//                     <FontAwesomeIcon
//                       icon={faGear}
//                       className="text-[24px] text-primary "
//                     />
//                     <span className="text-gray-700">
//                       {languageData?.menuAccountSettings}
//                     </span>
//                   </Link>
//                   <Link prefetch={false}
//                     href="/chat"
//                     className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
//                   >
//                     <FontAwesomeIcon
//                       icon={faMessage}
//                       className="text-[24px] text-primary "
//                     />
//                     <span className="text-gray-700">
//                       {languageData?.menuMessagesOrders}
//                     </span>
//                   </Link>
//                   <Link prefetch={false}
//                     href="/promotion"
//                     className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
//                   >
//                     <FontAwesomeIcon
//                       icon={faTicket}
//                       className="text-[24px] text-primary "
//                     />
//                     <span className="text-gray-700">
//                       {languageData?.menuCoupons}
//                     </span>
//                   </Link>
//                   <Link prefetch={false}
//                     href="/favorites"
//                     className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
//                   >
//                     <FontAwesomeIcon
//                       icon={faHeart}
//                       className="text-[24px] text-primary "
//                     />
//                     <span className="text-gray-700">
//                       {languageData?.menuFavoriteJobs}
//                     </span>
//                   </Link>
//                   <Link prefetch={false}
//                     href="/job-board"
//                     className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
//                   >
//                     <FontAwesomeIcon
//                       icon={faBullhorn}
//                       className="text-[24px] text-primary "
//                     />
//                     <span className="text-gray-700">
//                       {languageData?.menuJobBoard}
//                     </span>
//                   </Link>
//                   <Link prefetch={false}
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
//                   <Link prefetch={false}
//                     href="/start-selling"
//                     className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
//                   >
//                     <FontAwesomeIcon
//                       icon={faCodePullRequest}
//                       className="text-[24px] text-primary "
//                     />
//                     <span className="text-gray-700">
//                       {languageData?.menuBecomeFreelancer}
//                     </span>
//                   </Link>
//                   <Link prefetch={false}
//                     href="/consent-management"
//                     className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
//                   >
//                     <FontAwesomeIcon
//                       icon={faBarsProgress}
//                       className="text-[24px] text-primary "
//                     />
//                     <span className="text-gray-700">
//                       {languageData?.menuDataManagement}
//                     </span>
//                   </Link>
//                   <Link prefetch={false}
//                     href="#"
//                     className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50 border-t"
//                   >
//                     <FontAwesomeIcon
//                       icon={faSignOut}
//                       className="text-[24px] text-primary "
//                     />
//                     <span className="text-gray-700">
//                       {languageData?.menuLogout}
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
