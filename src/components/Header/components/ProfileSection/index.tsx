import { ProfileImage } from "@/constants/images";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLogout } from "@/hooks/useLogout";
import { GlobalLanguage } from "@/types/language";
import { ProfileData } from "@/types/userData";
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
  data: Partial<GlobalLanguage> | null | undefined;
  user?: ProfileData;
};

const ProfileSection = ({ data, user }: ProfileSectionProps) => {
  const { logout } = useLogout();
const { lang } = useLanguage();
  return (
    <div className="absolute right-0 mt-2 w-[22rem] bg-white rounded-lg shadow-jobCard z-50 select-none">
      <Link prefetch={false} href={`${lang}/user/${user?.user.username}`}>
        <div className="p-4 bg-secondary hover:bg-[#D0E1FB] duration-150 rounded-tl-lg rounded-tr-lg relative">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-gray-200 flex items-center justify-center">
              <Image
                src={user?.user.avatarUrl || ProfileImage.avatar}
                alt="avatar"
                className="rounded-full w-12 h-12 object-cover"
                width={500}
                height={500}
              />
            </div>
            <div>
              <p className="font-medium text-gray-900">{user?.user.username}</p>
              <p className="text-sm font-sans text-text_secondary underline">
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

      <div className="py-2">
        <Link prefetch={false}
          href="/coin"
          className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
        >
          <FontAwesomeIcon
            icon={faCoins}
            className="text-[24px] text-primary "
          />
          <span className="text-gray-700">Coins 0.00</span>
        </Link>
        <Link prefetch={false}
          href="/account-setting/basic-info"
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
          href="/job-board"
          className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50 border-t"
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
          <span className="text-gray-700">Rewards</span>
          <span className="ml-2 px-2 py-1 text-xs text-white bg-blue-500 rounded">
            New
          </span>
        </Link>
        <Link prefetch={false}
          href="/start-selling"
          className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50"
        >
          <FontAwesomeIcon
            icon={faCodePullRequest}
            className="text-[24px] text-primary "
          />
          <span className="text-gray-700">{data?.menuBecomeFreelancer}</span>
        </Link>
        <Link prefetch={false}
          href="/consent-management"
          className="flex items-center gap-5 px-4 py-3 hover:bg-gray-50 border-t w-full"
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

export default ProfileSection;
