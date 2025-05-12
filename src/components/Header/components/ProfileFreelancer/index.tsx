import { ProfileImage } from "@/constants/images";
import { useLogout } from "@/hooks/useLogout";
import { GlobalLanguage } from "@/types/language";
import { ProfileData } from "@/types/userData";
import { faMoneyBill1 } from "@fortawesome/free-regular-svg-icons";
import {
  faBarsProgress,
  faBriefcase,
  faBullhorn,
  faChevronRight,
  faGear,
  faGift,
  faHeart,
  faMessage,
  faMoneyBillTrendUp,
  faSignOut,
  faTicket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
type ProfileFreelancerProps = {
  data: Partial<GlobalLanguage> | null | undefined;
  user?: ProfileData;
};

const ProfileFreelancer = ({ data, user }: ProfileFreelancerProps) => {
  const { logout } = useLogout();

  return (
    <div className="absolute right-0 mt-2 w-[22rem] bg-white rounded-lg shadow-jobCard z-50 select-none">
      <Link href={`/user/${user?.user.username}`}>
        <div className="p-4 bg-secondary hover:bg-[#D0E1FB] duration-150 rounded-tl-lg rounded-tr-lg relative">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <Image
                src={user?.user.avatar_url || ProfileImage.avatar}
                alt="avatar"
                className="rounded-full"
                width={500}
            height={500}
              />
            </div>
            <div>
              <p className="font-medium text-gray-900">{user?.user.username}</p>
              <p className="text-sm font-sans text-text_secondary underline">
                {data?.label_view_profile}
              </p>
            </div>
          </div>
          <Image
            src={ProfileImage.decal}
            alt="decal"
            className="absolute top-0 right-0 bottom-0 opacity-40 "
            width={65}
            height={80}
          />
        </div>
      </Link>
      <Link href="/seller" target="_blank">
        <div className="relative">
          <div className="text-[13px] font-light text-white relative hover:bg-black/20 transition-all duration-150 ease-in-out z-10 px-6 py-3">
            Freelance cấp độ
            <span className="font-semibold text-[0.875rem] ml-1">Member</span>
            <FontAwesomeIcon
              icon={faChevronRight}
              className="text-[14px] ml-1"
            />
          </div>
          <div className="absolute profile-member-gradient inset-0 "></div>
        </div>
      </Link>
      <div className="py-2">
        <Link
          href="/seller-account-setting/freelance-profile"
          target="_blank"
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
          href="/seller"
          target="_blank"
          className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50 border-t"
        >
          <FontAwesomeIcon
            icon={faMoneyBill1}
            className="text-[24px] text-primary "
          />
          <span className="text-gray-700">Seller Center</span>
        </Link>
        <Link
          href="/job-board"
          target="_blank"
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
          target="_blank"
          className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
        >
          <FontAwesomeIcon
            icon={faGift}
            className="text-[24px] text-primary "
          />
          <span className="text-gray-700">Rewards</span>
          <span className="ml-[-6px] px-3 py-1 text-xs text-white bg-third rounded">
            New
          </span>
        </Link>
        <Link
          href="/seller/my-service"
          target="_blank"
          className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
        >
          <FontAwesomeIcon
            icon={faBriefcase}
            className="text-[24px] text-primary "
          />
          <span className="text-gray-700">My job</span>
        </Link>
        <Link
          href="/seller/withdrawal"
          target="_blank"
          className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
        >
          <FontAwesomeIcon
            icon={faMoneyBillTrendUp}
            className="text-[24px] text-primary "
          />
          <span className="text-gray-700">Accumulate</span>
        </Link>
        <Link
          href="/consent-management"
          className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50 border-t"
        >
          <FontAwesomeIcon
            icon={faBarsProgress}
            className="text-[24px] text-primary "
          />
          <span className="text-gray-700">{data?.menu_data_management}</span>
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50 "
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

export default ProfileFreelancer;
