"use client";
import CategoryCard from "@/components/CategoryDetail/components/CategoryCard";
import Loading from "@/components/Loading";
import { AssetIcon } from "@/constants/icons";
import { ProfileImage } from "@/constants/images";
import { LanguageFile } from "@/constants/language";
import { usePrivateFetchParams } from "@/hooks/api-hooks";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import {
  Certificate,
  Education,
  LanguageSkill,
  ProfileShow,
  Skill,
  WorkExperience,
} from "@/types/freelancerPofile";
import { formatDateToLong } from "@/utils/formatDateToLong";
import { interpolateDouble } from "@/utils/interpolate";
import { faEdit, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SquarePen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Props = {
  username: string;
};

const CurrentProfileFreelance = ({ username }: Props) => {
  const { data: userProfile, isLoading } = usePrivateFetchParams<ProfileShow>(
    `/users/${username}`
  );

  const { data: goToProfileLanguage } = useGlobalTranslate(
    LanguageFile.GO_TO_PROFILE
  );
  const [activeTab, setActiveTab] = useState<"reviews" | "clients">("reviews");
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
    <main className="min-h-screen bg-[#FBFBFC]">
      <div className="relative bg-primary h-[200px]">
        <div className="relative block sm:hidden">
          <Image
            src={AssetIcon.logo_icon}
            alt="logo_icon"
            className="absolute top-[-110px] left-1/2 -translate-x-1/2 object-cover opacity-30"
            width={200}
            height={200}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1216px_1fr] w-full pb-16">
        <div className="col-start-2 col-end-3 gap-x-[4rem] flex flex-col sm:flex-row sm:items-start">
          <aside>
            <div className="w-full sm:w-[320px] mt-[-128px] relative py-8 border-[0.0625rem] border-border_primary bg-white rounded-[0.25rem]">
              <div className="flex items-center justify-center">
                <Image
                  src={userProfile?.avatar_url || ProfileImage.avatar}
                  alt="Avatar"
                  className="rounded-full w-[175px] object-cover"
                  width={175}
                  height={500}
                />
              </div>
              <p className="text-[28px] font-medium text-text_primary text-center pt-2">
                {userProfile?.username}
              </p>
              <div className="flex items-center justify-center pt-2">
                {[...Array(userProfile?.ratings || 0)].map((_, index) => (
                  <FontAwesomeIcon
                    icon={faStar}
                    key={index}
                    className="text-[14px] text-[#D6DAE1]"
                  />
                ))}
              </div>
              <div className="w-full mt-4 space-y-3 px-4">
                <div className="flex justify-between items-center">
                  <div className="text-text_secondary">
                    {goToProfileLanguage?.member_since}
                  </div>
                  <div className="text-third font-medium">
                    {formatDateToLong(userProfile?.member_since)}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-text_secondary">
                    {goToProfileLanguage?.job_count}
                  </div>
                  <div className="text-third font-medium">
                    1.2K {goToProfileLanguage?.times}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-text_secondary">
                    {goToProfileLanguage?.average_response_time}
                  </div>
                  <div className="text-third font-medium">
                    34 {goToProfileLanguage?.minutes}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-text_secondary">
                    {goToProfileLanguage?.success_rate}
                  </div>
                  <div className="text-third font-medium">100%</div>
                </div>
              </div>
              {userProfile?.bio && (
                <div className="mt-6 px-6">
                  <div className="text-text_secondary px-4 py-3 border border-border_secondary rounded-[4px] max-w-full bg-[#FBFBFC]">
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
                        className="mt-2 text-text_primary font-sans text-sm font-medium underline"
                      >
                        {goToProfileLanguage?.see_more}
                      </button>
                    )}
                  </div>
                </div>
              )}

              <Link
                href="/seller-account-setting/freelance-profile"
                target="_blank"
                className="absolute top-4 right-4"
              >
                <FontAwesomeIcon
                  icon={faEdit}
                  className="text-[18px] text-text_secondary"
                />
              </Link>
            </div>
            <div className="w-full sm:w-[320px] mt-4 relative border-[0.0625rem] border-border_primary bg-white rounded-[0.25rem]">
              <div className="max-w-4xl mx-auto">
                <div className="p-6">
                  {/* Education Section */}
                  <div className="bg-white rounded-lg pb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-blue-600 font-medium">
                        {goToProfileLanguage?.education_title}
                      </h2>
                      <Link
                        href="/user/edit/education"
                        className="text-gray-500"
                      >
                        <SquarePen className="w-[16px] text-gray-500" />
                      </Link>
                    </div>
                    {userProfile && userProfile?.education.length > 0 ? (
                      <div className="flex flex-col gap-4">
                        {userProfile?.education.map((education: Education) => {
                          return (
                            <div
                              key={education.id}
                              className="text-[14px] leading-[1.65] p-0 font-sans font-medium"
                            >
                              <p className="text-text_primary break-words line-clamp-2">
                                {education?.school_name}
                              </p>
                              <p className="text-text_secondary break-words line-clamp-2">
                                {education?.major}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm">
                        {goToProfileLanguage?.not_provided}
                      </div>
                    )}
                  </div>
                  <hr className="bg-border_secondary h-[1px] block w-full border-none m-0 box-content" />
                  {/* Work Experience Section */}
                  <div className="bg-white rounded-lg py-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-blue-600 font-medium">
                        {goToProfileLanguage?.experience_title}
                      </h2>
                      <Link
                        href="/user/edit/experience"
                        className="text-gray-500"
                      >
                        <SquarePen className="w-[16px] text-gray-500" />
                      </Link>
                    </div>
                    {userProfile && userProfile?.work_experience.length > 0 ? (
                      <div className="flex flex-col gap-4">
                        {userProfile?.work_experience.map(
                          (experience: WorkExperience) => {
                            return (
                              <div
                                key={experience.id}
                                className="px-4 py-3 border border-border_secondary rounded-[4px] max-w-full bg-[#FBFBFC] font-sans"
                              >
                                <p className="text-text_primary text-[0.875rem] leading-[1.65] p-0 line-clamp-5 break-words font-medium">
                                  {experience?.company_name}
                                </p>
                                <p className="text-text_secondary text-[0.875rem] leading-[1.65] p-0 line-clamp-5 break-words pt-2">
                                  {experience?.position}
                                </p>
                                <p className="text-text_secondary text-[0.875rem] leading-[1.65] p-0 line-clamp-5 break-words">
                                  {experience?.start_month}{" "}
                                  {experience?.start_year} -{" "}
                                  {experience?.start_month}{" "}
                                  {experience?.start_year}
                                </p>
                              </div>
                            );
                          }
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm">
                        {goToProfileLanguage?.not_provided}
                      </div>
                    )}
                  </div>
                  <hr className="bg-border_secondary h-[1px] block w-full border-none m-0 box-content" />

                  {/* Skills Section */}
                  <div className="bg-white rounded-lg py-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-blue-600 font-medium">
                        {goToProfileLanguage?.skill_title}
                      </h2>
                      <Link href="/user/edit/skills" className="text-gray-500">
                        <SquarePen className="w-[16px] text-gray-500" />
                      </Link>
                    </div>
                    {userProfile && userProfile?.skill.length > 0 ? (
                      <div className="flex flex-col gap-4">
                        {userProfile?.skill.map((skill: Skill) => {
                          return (
                            <div
                              key={skill.id}
                              className="flex flex-row justify-between gap-[0.75rem] items-center text-[14px] leading-[1.65] p-0 font-sans font-medium"
                            >
                              <p className="text-text_primary break-words line-clamp-2 font-sans leading-[16.1px] p-0 font-medium">
                                {skill?.skill_name}
                              </p>
                              <p className="text-[#08439B] px-[0.625rem] py-[0.25rem] rounded-[0.375rem] leading-[16.1px] font-sans bg-secondary break-words line-clamp-2">
                                {skill?.level_name}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm">
                        {goToProfileLanguage?.not_provided}
                      </div>
                    )}
                  </div>
                  <hr className="bg-border_secondary h-[1px] block w-full border-none m-0 box-content" />

                  {/* Languages Section */}
                  <div className="bg-white rounded-lg py-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-blue-600 font-medium">
                        {goToProfileLanguage?.language_title}
                      </h2>
                      <Link
                        href="/user/edit/languages"
                        className="text-gray-500"
                      >
                        <SquarePen className="w-[16px] text-gray-500" />
                      </Link>
                    </div>
                    {userProfile && userProfile?.language.length > 0 ? (
                      <div className="flex flex-col gap-4">
                        {userProfile?.language.map(
                          (language: LanguageSkill) => {
                            return (
                              <div
                                key={language.id}
                                className="flex flex-row justify-between gap-[0.75rem] items-center text-[14px] leading-[1.65] p-0 font-sans font-medium"
                              >
                                <p className="text-text_primary break-words line-clamp-2 font-sans leading-[16.1px] p-0 font-medium">
                                  {language?.lang}
                                </p>
                                <p className="text-[#08439B] px-[0.625rem] py-[0.25rem] rounded-[0.375rem] leading-[16.1px] font-sans bg-secondary break-words line-clamp-2">
                                  {language?.level_name}
                                </p>
                              </div>
                            );
                          }
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm">
                        {goToProfileLanguage?.not_provided}
                      </div>
                    )}
                  </div>
                  <hr className="bg-border_secondary h-[1px] block w-full border-none m-0 box-content" />

                  {/* Certifications Section */}
                  <div className="bg-white rounded-lg py-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-blue-600 font-medium">
                        {goToProfileLanguage?.certification_title}
                      </h2>
                      <Link
                        href="/user/edit/certifications"
                        className="text-gray-500"
                      >
                        <SquarePen className="w-[16px] text-gray-500" />
                      </Link>
                    </div>
                    {userProfile && userProfile?.cert_and_award.length > 0 ? (
                      <div className="flex flex-col gap-4">
                        {userProfile?.cert_and_award.map(
                          (cert: Certificate) => {
                            return (
                              <div
                                key={cert.id}
                                className="text-[14px] leading-[1.65] p-0 font-sans font-medium"
                              >
                                <p className="text-text_primary break-words line-clamp-2 font-sans leading-[16.1px] p-0 font-medium">
                                  {cert?.name}
                                </p>
                              </div>
                            );
                          }
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm">
                        {goToProfileLanguage?.not_provided}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </aside>
          <section className="w-full px-4">
            <h2 className="pt-[3rem] text-[28px] font-medium text-text_primary w-full">
              {interpolateDouble(goToProfileLanguage?.work_title || "", {
                username: userProfile?.username,
              })}
            </h2>
            <section className="mt-4 grid grid-cols-1 md:grid-cols-[repeat(3,minmax(1px,1fr))] gap-5">
              {userProfile?.services.map((_, index) => (
                <CategoryCard key={index} />
              ))}
            </section>
            <div className="mt-8">
              <div className="border-b border-border_primary mb-6">
                <div className="flex -mb-px">
                  <button
                    className={`mr-6 py-2 text-sm font-medium border-b-2 ${
                      activeTab === "reviews"
                        ? "text-third border-third"
                        : "text-text_secondary border-transparent hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("reviews")}
                  >
                    {goToProfileLanguage?.review_tab} (928)
                  </button>
                  <button
                    className={`py-2 text-sm font-medium border-b-2 ${
                      activeTab === "clients"
                        ? "text-third border-third"
                        : "text-text_secondary border-transparent hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("clients")}
                  >
                    {goToProfileLanguage?.freelancer_review} (1)
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-b border-border_primary pb-6">
                  <div className="flex items-start mb-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3 text-gray-600 font-bold">
                      B
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-text_primary">
                            BBLL
                          </h4>
                          <span className="text-sm text-text_secondary">
                            23/02/2025
                          </span>
                        </div>
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 text-yellow-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="ml-1 font-medium text-text_primary">
                            5.0
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-b border-border_primary pb-6">
                  <div className="flex items-start mb-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3 text-gray-600 font-bold">
                      B
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-text_primary">
                            BBLL
                          </h4>
                        </div>
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 text-yellow-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="ml-1 font-medium text-text_primary">
                            5.0
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default CurrentProfileFreelance;
