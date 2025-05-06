"use client";
import { API_ROUTES } from "@/api/endpoints";
import { AssetIcon } from "@/constants/icons";
import { ProfileImage } from "@/constants/images";
import { LanguageFile, LANGUAGES } from "@/constants/language";
import { ROLE } from "@/constants/role";
import LanguageBottomSheet from "@/containers/SpBottomTab";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrivateFetch } from "@/hooks/api-hooks";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { useToggle } from "@/hooks/useToggle";
import { ProfileData } from "@/types/userData";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ProfileFreelancer from "../Header/components/ProfileFreelancer";
import ProfileSection from "../Header/components/ProfileSection";
import LanguageDropdown from "../LanguageDropDown";
import Loading from "../Loading";

const RewardHeader = () => {
  const { data: session } = useSession();
  const { data: user } = usePrivateFetch<ProfileData>(
    API_ROUTES.profile.get_profile
  );

  const {
    data: globalLanguageData,
    isLoading,
    error,
  } = useGlobalTranslate(LanguageFile.GLOBAL);

  const [showLang, setShowLang] = useState(false);
  const { lang } = useLanguage();
  const { isOpen, toggle, close } = useToggle();
  const currentLang = LANGUAGES[lang as keyof typeof LANGUAGES];

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading language data</div>;

  return (
    <header className="sticky top-0 z-[999] w-full transition-all duration-300 bg-transparent">
      <nav className="mx-3 sm:mx-[1.5rem] flex items-center justify-between h-auto min-h-[70px] py-4 ">
        <section className="flex items-center gap-x-4 w-full md:w-auto">
          <Link href="/" className="shrink-0">
            <Image
              src={AssetIcon.logo_reward}
              alt="logo"
              className="w-full h-full"
            />
          </Link>
        </section>

        <section className="flex items-center gap-4 w-full justify-end">
          <div className="hidden sm:block">
            <LanguageDropdown />
          </div>
          <div className="block sm:hidden">
            <button
              onClick={() => setShowLang(true)}
              className="flex-1 flex items-center justify-center p-2 text-white cursor-pointer"
            >
              <Image
                src={currentLang.flag}
                alt={currentLang.label}
                width={30}
                height={30}
              />
            </button>
          </div>
          <Link
            href="/profile"
            className="flex sm:hidden items-center justify-center p-2 text-white text-[24px] cursor-pointer"
          >
            <Image
              src={user?.user.avatar_url || ProfileImage.avatar}
              alt="avatar"
              className="rounded-full w-8 h-8"
              width={500}
              height={500}
            />
          </Link>
          <div className="hidden sm:block">
            {session?.user.roles?.includes(ROLE.EMPLOYER) &&
              session?.user.roles?.includes(ROLE.FREELANCER) && (
                <div className="relative px-4">
                  <button
                    onClick={() => toggle()}
                    className="flex items-center justify-center gap-2 w-12 h-12 rounded-full "
                  >
                    <Image
                      src={user?.user.avatar_url || ProfileImage.avatar}
                      alt="avatar"
                      className="rounded-full"
                      width={500}
                      height={500}
                    />
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className="w-[14px] h-[14px] text-white"
                    />
                  </button>

                  {isOpen && (
                    <ProfileFreelancer user={user} data={globalLanguageData} />
                  )}
                  {isOpen && (
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => close()}
                    />
                  )}
                </div>
              )}
            {session?.user.roles?.includes(ROLE.EMPLOYER) &&
              !session?.user.roles?.includes(ROLE.FREELANCER) && (
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

                  {isOpen && (
                    <ProfileSection user={user} data={globalLanguageData} />
                  )}

                  {isOpen && (
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => close()}
                    />
                  )}
                </div>
              )}
          </div>
        </section>
      </nav>
      <LanguageBottomSheet open={showLang} onClose={() => setShowLang(false)} />
    </header>
  );
};

export default RewardHeader;
