import { ProfileImage } from "@/constants/images";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLogout } from "@/hooks/useLogout";
import { GlobalLanguage } from "@/types/language";
import { ProfileData } from "@/types/userData";
import { interpolateElement } from "@/utils/interpolateElement";
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
  const { lang: currentLang } = useLanguage();
  return (
    <div className="absolute right-0 mt-2 w-[22rem] bg-white rounded-lg shadow-jobCard z-50 select-none">
      <Link prefetch={false} href={`/${currentLang}/user/${user?.user.username}`}>
        <div className="p-4 bg-secondary hover:bg-[#D0E1FB] duration-150 rounded-tl-lg rounded-tr-lg relative">
          <div className="flex items-center space-x-3">
            <div className="bg-gray-200 flex items-center justify-center rounded-full">
              <Image
                src={user?.user.avatarUrl || ProfileImage.avatar}
                alt="avatar"
                className="rounded-full w-12 h-12 object-cover border-1 border-borderPrimary"
                width={500}
                height={500}
              />
            </div>
            <div>
              <p className="font-medium text-gray-900">{user?.user.username}</p>
              <p className="text-sm font-sans text-textSecondary underline">
                {data?.labelViewProfile}
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
      <Link prefetch={false} href="/seller">
        <div className="relative">
          <div className="text-[13px] font-light text-white relative hover:bg-black/20 transition-all duration-150 ease-in-out z-10 px-6 py-3">
            {interpolateElement(data?.labelFreelancerLevel || "", {
              level: (
                <span className="font-semibold text-[0.875rem] ml-1">
                  Member
                </span>
              ),
            })}
            <FontAwesomeIcon
              icon={faChevronRight}
              className="text-[14px] ml-1"
            />
          </div>
          <div className="absolute profile-member-gradient inset-0 "></div>
        </div>
      </Link>
      <div className="py-2">
        <Link prefetch={false}
          href="/seller-account-setting/freelance-profile"
          className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
        >
          <FontAwesomeIcon
            icon={faGear}
            className="text-[24px] text-primary "
          />
          <span className="text-gray-700">{data?.menuAccountSettings}</span>
        </Link>
        <Link prefetch={false}
          href="/chat"
          className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
        >
          <FontAwesomeIcon
            icon={faMessage}
            className="text-[24px] text-primary "
          />
          <span className="text-gray-700">{data?.menuMessagesOrders}</span>
        </Link>
        <Link prefetch={false}
          href="/promotion"
          className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
        >
          <FontAwesomeIcon
            icon={faTicket}
            className="text-[24px] text-primary "
          />
          <span className="text-gray-700">{data?.menuCoupons}</span>
        </Link>
        <Link prefetch={false}
          href="/favorites"
          className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
        >
          <FontAwesomeIcon
            icon={faHeart}
            className="text-[24px] text-primary "
          />
          <span className="text-gray-700">{data?.menuFavoriteJobs}</span>
        </Link>
        <Link prefetch={false}
          href="/seller"
          className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50 border-t"
        >
          <FontAwesomeIcon
            icon={faMoneyBill1}
            className="text-[24px] text-primary "
          />
          <span className="text-gray-700">{data?.menuSellerCenter}</span>
        </Link>
        <Link prefetch={false}
          href="/job-board"
          className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
        >
          <FontAwesomeIcon
            icon={faBullhorn}
            className="text-[24px] text-primary "
          />
          <span className="text-gray-700">{data?.menuJobBoard}</span>
        </Link>
        <Link prefetch={false}
          href="/reward/earn"
          className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
        >
          <FontAwesomeIcon
            icon={faGift}
            className="text-[24px] text-primary "
          />
          <span className="text-gray-700">{data?.menuRewards}</span>
          <span className="ml-[-6px] px-3 py-1 text-xs text-white bg-third rounded">
            New
          </span>
        </Link>
        <Link prefetch={false}
          href="/seller/my-service"
          className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
        >
          <FontAwesomeIcon
            icon={faBriefcase}
            className="text-[24px] text-primary "
          />
          <span className="text-gray-700">{data?.menuMyJob}</span>
        </Link>
        <Link prefetch={false}
          href="/seller/withdrawal"
          className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
        >
          <FontAwesomeIcon
            icon={faMoneyBillTrendUp}
            className="text-[24px] text-primary "
          />
          <span className="text-gray-700">{data?.menuAccumulate}</span>
        </Link>
        <Link prefetch={false}
          href="/consent-management"
          className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50 border-t"
        >
          <FontAwesomeIcon
            icon={faBarsProgress}
            className="text-[24px] text-primary "
          />
          <span className="text-gray-700">{data?.menuDataManagement}</span>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-5 px-4 py-3 hover:bg-gray-50 "
        >
          <FontAwesomeIcon
            icon={faSignOut}
            className="text-[24px] text-primary "
          />
          <span className="text-gray-700">{data?.menuLogout}</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileFreelancer;
