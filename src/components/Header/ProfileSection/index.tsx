import { signOut } from "next-auth/react";
import { ProfileImage } from "@/constants/images";
import { GlobalLanguage } from "@/types/language";
import {
    faBarsProgress,
    faBullhorn,
    faCodePullRequest,
    faCoins,
    faGear,
    faGift,
    faHeart,
    faMessage,
    faSignOut,
    faTicket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

type ProfileSectionProps = {
  data: GlobalLanguage | null;
};

const ProfileSection = ({ data }: ProfileSectionProps) => {
    const handleLogout = async () => {
        try {
          await signOut({ 
            callbackUrl: "/", 
            redirect: true 
          })
        } catch (error) {
          console.error('Logout failed:', error)
        }
      }

  return (
    <div className="absolute right-0 mt-2 w-[22rem] bg-white rounded-lg shadow-jobCard z-50 select-none">
      <div className="p-4 border-b border-gray-100 bg-[#D0E1FB] rounded-tl-lg rounded-tr-lg">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <Image
              src={ProfileImage.avatar}
              alt="avatar"
              className="rounded-full"
            />
          </div>
          <div>
            <p className="font-medium text-gray-900">uykpfzno</p>
            <Link
              href="/user"
              className="text-sm text-blue-600 hover:underline"
            >
              {data?.label_view_profile}
            </Link>
          </div>
        </div>
      </div>

      <div className="py-2">
        <Link
          href="/coin"
          className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
        >
          <FontAwesomeIcon
            icon={faCoins}
            className="text-[24px] text-primary "
          />
          <span className="text-gray-700">Coins 0.00</span>
        </Link>
        <Link
          href="/account-setting"
          className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
        >
          <FontAwesomeIcon
            icon={faGear}
            className="text-[24px] text-primary "
          />
          <span className="text-gray-700">{data?.menu_account_settings}</span>
        </Link>
        <Link
          href="/chat"
          className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
        >
          <FontAwesomeIcon
            icon={faMessage}
            className="text-[24px] text-primary "
          />
          <span className="text-gray-700">{data?.menu_messages_orders}</span>
        </Link>
        <Link
          href="/promotion"
          className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
        >
          <FontAwesomeIcon
            icon={faTicket}
            className="text-[24px] text-primary "
          />
          <span className="text-gray-700">{data?.menu_coupons}</span>
        </Link>
        <Link
          href="/favorites"
          className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
        >
          <FontAwesomeIcon
            icon={faHeart}
            className="text-[24px] text-primary "
          />
          <span className="text-gray-700">{data?.menu_favorite_jobs}</span>
        </Link>
        <Link
          href="/job-board"
          className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
        >
          <FontAwesomeIcon
            icon={faBullhorn}
            className="text-[24px] text-primary "
          />
          <span className="text-gray-700">{data?.menu_job_board}</span>
        </Link>
        <Link
          href="/reward/earn"
          className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
        >
          <FontAwesomeIcon
            icon={faGift}
            className="text-[24px] text-primary "
          />
          <span className="text-gray-700">Rewards</span>
          <span className="ml-2 px-2 py-1 text-xs text-white bg-blue-500 rounded">
            New
          </span>
        </Link>
        <Link
          href="/start-selling"
          className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
        >
          <FontAwesomeIcon
            icon={faCodePullRequest}
            className="text-[24px] text-primary "
          />
          <span className="text-gray-700">{data?.menu_become_freelancer}</span>
        </Link>
        <Link
          href="/consent-management"
          className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
        >
          <FontAwesomeIcon
            icon={faBarsProgress}
            className="text-[24px] text-primary "
          />
          <span className="text-gray-700">{data?.menu_data_management}</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50 border-t w-full"
        >
          <FontAwesomeIcon
            icon={faSignOut}
            className="text-[24px] text-primary "
          />
          <span className="text-gray-700">{data?.menu_logout}</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileSection;
