"use client";
import Loading from "@/components/Loading";
import { AssetIcon } from "@/constants/icons";
import { ProfileImage } from "@/constants/images";
import { LanguageFile } from "@/constants/language";
import { usePrivateFetchParams } from "@/hooks/api-hooks";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { ProfileShow } from "@/types/freelancerPofile";
import { formatDateToLong } from "@/utils/formatDateToLong";
import { interpolateDouble } from "@/utils/interpolate";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
  username: string;
};
const UserProfile = ({ username }: Props) => {
  const { data: userProfile, isLoading } = usePrivateFetchParams<ProfileShow>(
    `/users/${username}`
  );

  const { data: goToProfileLanguage } = useGlobalTranslate(
    LanguageFile.GO_TO_PROFILE
  );

  const [showFullBio, setShowFullBio] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const bioRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (bioRef.current) {
      const el = bioRef.current;
      setIsClamped(el.scrollHeight > el.clientHeight);
    }
  }, [userProfile?.bio]);

  if (isLoading) return <Loading />;
  return (
    <main className="min-h-screen">
      <div className="relative bg-primary h-[200px]">
        <div className="relative block sm:hidden">
          <Image
            src={AssetIcon.logoIcon}
            alt="logoIcon"
            className="absolute top-[-110px] left-1/2 -translate-x-1/2 object-cover opacity-30"
            width={200}
            height={200}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1216px_1fr] w-full pb-16">
        <div className="col-start-2 col-end-3 gap-x-[4rem] flex flex-col sm:flex-row sm:items-start">
          <aside>
            <div className="w-full sm:w-[320px] mt-[-128px] relative py-8 border-[0.0625rem] border-borderPrimary bg-white rounded-[0.25rem]">
              <div className="flex items-center justify-center">
                <Image
                  src={userProfile?.avatarUrl || ProfileImage.avatar}
                  alt="avatar"
                  className="rounded-full w-[175px] object-cover"
                  width={175}
                  height={500}
                />
              </div>
              <p className="text-[28px] font-medium text-text-primary text-center pt-2">
                {userProfile?.username}
              </p>
              <div className="flex items-center justify-center pt-2">
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <FontAwesomeIcon
                    icon={faStar}
                    key={index}
                    className="text-[14px] text-[#D6DAE1] "
                  />
                ))}
              </div>
              <div className="flex flex-row justify-between pt-10 gap-4 px-6">
                <p className="text-[14px] text-text-primary">
                  {goToProfileLanguage?.memberSince}
                </p>
                <p className="text-[14px] text-third">
                  {formatDateToLong(userProfile?.memberSince)}
                </p>
              </div>
              {userProfile?.bio && (
                <div className="mt-6 px-6">
                  <div className="text-text_secondary px-4 py-3 border border-borderSecondary rounded-[4px] max-w-full bg-[#FBFBFC]">
                    <p
                      ref={bioRef}
                      className={`text-text_secondary text-[0.875rem] leading-[1.65] p-0 break-words ${
                        showFullBio ? "" : "line-clamp-5"
                      }`}
                    >
                      <i>{userProfile?.bio}</i>
                    </p>
                    {userProfile?.bio && isClamped && !showFullBio && (
                      <button
                        onClick={() => setShowFullBio(true)}
                        className="mt-2 text-blue-600 text-sm font-medium hover:underline"
                      >
                        {goToProfileLanguage?.seeMore}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>
          <section className="w-full px-4">
            <h2 className="py-[3rem] text-[28px] font-medium text-text-primary w-full">
              {interpolateDouble(goToProfileLanguage?.workTitle || "", {
                username: userProfile?.username,
              })}
            </h2>
            <div className="grid grid-cols-[1fr_1fr_1fr] border-b-[2px] border-b-borderPrimary">
              <div className="relative whitespace-nowrap border-b-2 border-borderPrimary hover:text-third duration-150 flex justify-center items-center cursor-pointer px-1 py-3 font-bold text-third  after:absolute after:bottom-[-3px] after:h-[2px] after:w-full after:bg-third">
                {goToProfileLanguage?.freelancerReview}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default UserProfile;
