"use client";
import { API_ROUTES } from "@/api/endpoints";
import Loading from "@/components/Loading";
import { ProfileIcon } from "@/constants/icons";
import { ProfileImage } from "@/constants/images";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrivateFetch } from "@/hooks/api-hooks";
import { useLogout } from "@/hooks/useLogout";
import { ProfileData } from "@/types/userData";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import {
  faBriefcase,
  faCoins,
  faGift,
  faMoneyBill1,
  faMoneyBillTrendUp,
  faTicket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {RoleType} from "lemmy-js-client";

const SpProfile = () => {
  const { data: user, isLoading } = usePrivateFetch<ProfileData>(
    API_ROUTES.profile.getProfile
  );
  const { lang: currentLang } = useLanguage();
  const { logout } = useLogout();

  if (isLoading) return <Loading />;

  return (
    <main className="min-h-screen bg-white relative">
      <section className="pb-20">
        <svg
          preserveAspectRatio="none"
          width="100%"
          height="150"
          viewBox="0 0 702 232"
        >
          <path
            d="M-6.25277607e-13,0.904411074 L702,0.904411074 L702,132.15625 C592.312351,153.623113 478.060437,164.356544 359.244257,164.356544 C240.428078,164.356544 120.679992,153.623113 -6.25277607e-13,132.15625 L-6.25277607e-13,0.904411074 Z"
            fill="#08439B"
          ></path>
        </svg>
        <div className="grid grid-cols-1 z-10 text-center absolute left-1/2 -translate-x-1/2 top-0 pt-6 justify-center">
          <strong className="text-[1.125rem] text-white">My Profile</strong>
          <Link prefetch={false} href={`/${currentLang}/user/${user?.user.username}`}>
            <Image
              src={user?.user.avatarUrl || ProfileImage.avatar}
              width={80}
              height={80}
              alt="avatar"
              className="inline-flex justify-center items-center w-[80px] min-h-[80px]  rounded-full object-cover object-center mt-4"
            />
          </Link>
          <Link prefetch={false} href={`/${currentLang}/user/${user?.user.username}`}>
            <strong className="text-[1.125rem] text-third">
              {user?.user.username}
            </strong>
          </Link>
          <Link prefetch={false}
            href={`/${currentLang}/user/${user?.user.username}`}
            className="inline-block max-w-full whitespace-nowrap"
          >
            <strong className="text-sm font-sans text-text-primary">
              {user?.contact.email}
            </strong>
          </Link>
        </div>
      </section>
      <section>
        <Link prefetch={false} href="/coin">
          <div
            style={{ height: "52px", borderRadius: "12px 12px 0 0" }}
            className="flex flex-row justify-between items-center gap-2 px-4 profile-gradient "
          >
            <div className="flex flex-row items-center gap-2">
              <Image
                src={ProfileIcon.coins}
                alt="avatar"
                width={20}
                height={20}
              />
              <div className="flex flex-row items-center text-[0.75rem] font-semibold gap-1">
                <span className="text-text-primary">0.00 Points</span>
                <span className="text-third">≈ 0.00 THB</span>
              </div>
            </div>
            <div>
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </div>
          </div>
        </Link>
      </section>
      {user?.roles.includes(RoleType.Employer) &&
        user?.roles.includes(RoleType.Freelancer) && (
          <section className="grid grid-cols-4 px-3 mt-6 gap-y-6 gap-x-3">
            <Link prefetch={false} href="/seller/my-service">
              <div className="flex flex-col items-center text-center gap-2 text-[0.75rem] text-text-secondary font-sans">
                <FontAwesomeIcon
                  icon={faBriefcase}
                  className="text-[24px] text-text-secondary"
                />
                <div>My job</div>
              </div>
            </Link>
            <Link prefetch={false} href="/seller/withdrawal">
              <div className="flex flex-col items-center gap-2 text-[0.75rem] text-text-secondary font-sans">
                <FontAwesomeIcon
                  icon={faMoneyBillTrendUp}
                  className="text-[24px] text-text-secondary"
                />
                <div>Withdraw</div>
              </div>
            </Link>
            <Link prefetch={false} href="/seller">
              <div className="flex flex-col items-center gap-2 text-[0.75rem] text-text-secondary font-sans">
                <FontAwesomeIcon
                  icon={faMoneyBill1}
                  className="text-[24px] text-text-secondary"
                />
                <div>Seller center</div>
              </div>
            </Link>
            <Link prefetch={false} href="/reward/earn">
              <div className="flex flex-col items-center text-center gap-2 text-[0.75rem] text-text-secondary font-sans">
                <FontAwesomeIcon
                  icon={faGift}
                  className="text-[24px] text-text-secondary"
                />
                <div>Rewards</div>
              </div>
            </Link>
            <Link prefetch={false} href="/promotion">
              <div className="flex flex-col items-center gap-2 text-[0.75rem] text-text-secondary font-sans">
                <FontAwesomeIcon
                  icon={faTicket}
                  className="text-[24px] text-text-secondary"
                />
                <div>Coupons</div>
              </div>
            </Link>
            <Link prefetch={false} href="/favorites">
              <div className="flex flex-col items-center gap-2 text-[0.75rem] text-text-secondary font-sans">
                <FontAwesomeIcon
                  icon={faHeart}
                  className="text-[24px] text-text-secondary"
                />
                <div>Favorites</div>
              </div>
            </Link>
          </section>
        )}
      {user?.roles.includes(RoleType.Employer) &&
        !user?.roles.includes(RoleType.Freelancer) && (
          <section className="grid grid-cols-4 px-3 mt-6 gap-y-6 gap-x-3">
            <Link prefetch={false} href="/reward/earn">
              <div className="flex flex-col items-center text-center gap-2 text-[0.75rem] text-text-secondary font-sans">
                <FontAwesomeIcon
                  icon={faGift}
                  className="text-[24px] text-text-secondary"
                />
                <div>Rewards</div>
              </div>
            </Link>
            <Link prefetch={false} href="/promotion">
              <div className="flex flex-col items-center gap-2 text-[0.75rem] text-text-secondary font-sans">
                <FontAwesomeIcon
                  icon={faTicket}
                  className="text-[24px] text-text-secondary"
                />
                <div>Coupons</div>
              </div>
            </Link>
            <Link prefetch={false} href="/coin">
              <div className="flex flex-col items-center gap-2 text-[0.75rem] text-text-secondary font-sans">
                <FontAwesomeIcon
                  icon={faCoins}
                  className="text-[24px] text-text-secondary"
                />
                <div>Coins</div>
              </div>
            </Link>
            <Link prefetch={false} href="/favorites">
              <div className="flex flex-col items-center gap-2 text-[0.75rem] text-text-secondary font-sans">
                <FontAwesomeIcon
                  icon={faHeart}
                  className="text-[24px] text-text-secondary"
                />
                <div>Favorites</div>
              </div>
            </Link>
          </section>
        )}

      <section className="block">
        <div
          style={{ borderBottom: "solid 8px", borderColor: "#f6f7f8" }}
          className="mt-6"
        >
          <ul className="p-0 m-0 list-none">
            {user?.roles.includes(RoleType.Employer) &&
              !user?.roles.includes(RoleType.Freelancer) && (
                <li>
                  <Link prefetch={false}
                    href="/account-setting/basic-info"
                    className="flex items-center justify-between w-full px-6 py-3 text-text-primary text-[15px] font-sans cursor-pointer"
                  >
                    <span>Account Setting</span>
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </Link>
                </li>
              )}
            {user?.roles.includes(RoleType.Employer) &&
              user?.roles.includes(RoleType.Freelancer) && (
                <li>
                  <Link prefetch={false}
                    href="/seller-account-setting/freelance-profile"
                    className="flex items-center justify-between w-full px-6 py-3 text-text-primary text-[15px] font-sans cursor-pointer"
                  >
                    <span>Account Setting</span>
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </Link>
                </li>
              )}
            {user?.roles.includes(RoleType.Employer) &&
              !user?.roles.includes(RoleType.Freelancer) && (
                <li>
                  <Link prefetch={false}
                    href="/start-selling"
                    className="flex items-center justify-between w-full px-6 py-3 text-text-primary text-[15px] font-sans cursor-pointer"
                  >
                    <span>Apply to be a freelancer</span>
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </Link>
                </li>
              )}
          </ul>
        </div>
      </section>
      <section className="block">
        <div className="font-semibold inline-block pt-6 px-6 pb-2 text-text-primary">
          About Freelancer
        </div>
        <div style={{ borderBottom: "solid 8px", borderColor: "#f6f7f8" }}>
          <ul className="p-0 m-0 list-none">
            <li>
              <Link prefetch={false}
                href="/job-board"
                className="flex items-center justify-between w-full px-6 py-3 text-text-primary text-[15px] font-sans cursor-pointer"
              >
                <span>Job board</span>
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </Link>
            </li>
          </ul>
        </div>
      </section>
      <section className="block">
        <div className="font-semibold inline-block pt-6 px-6 pb-2 text-text-primary">
          Other Services
        </div>
        <div style={{ borderBottom: "solid 8px", borderColor: "#f6f7f8" }}>
          <ul className="p-0 m-0 list-none">
            <li>
              <Link prefetch={false}
                href="/promotion"
                className="flex items-center justify-between w-full px-6 py-3 text-text-primary text-[15px] font-sans cursor-pointer"
              >
                <span>Coupons</span>
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </Link>
            </li>
            <li>
              <Link prefetch={false}
                href="/consent-management"
                className="flex items-center justify-between w-full px-6 py-3 text-text-primary text-[15px] font-sans cursor-pointer"
              >
                <span>Data management</span>
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </Link>
            </li>
          </ul>
        </div>
      </section>
      <section className="block">
        <div>
          <ul className="p-0 m-0 list-none">
            <li>
              <button
                onClick={logout}
                className="flex items-center justify-between w-full px-6 py-3 text-text-primary text-[15px] font-sans cursor-pointer"
              >
                <span>Logout</span>
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </button>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
};

export default SpProfile;
