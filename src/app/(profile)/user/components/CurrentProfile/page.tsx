"use client";
import Loading from "@/components/Loading";
import { ProfileImage } from "@/constants/images";
import { usePrivateFetchParams } from "@/hooks/api-hooks";
import {
  Certificate,
  Education,
  LanguageSkill,
  ProfileShow,
  Skill,
  WorkExperience,
} from "@/types/freelancerPofile";
import { formatDateToLong } from "@/utils/formatDateToLong";
import { faEdit, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
type Props = {
  username: string;
};
const CurrentProfile = ({ username }: Props) => {
  const { data: userProfile, isLoading } = usePrivateFetchParams<ProfileShow>(
    `/users/${username}`
  );

  console.log("data", userProfile);

  if (isLoading) return <Loading />;

  return (
    <main>
      <div className="relative bg-primary h-[200px]"></div>
      <div className="grid grid-cols-[1fr_1216px_1fr] w-full pb-16">
        <div className="col-start-2 col-end-3 gap-x-[4rem] flex items-start ">
          <aside>
            <div className="w-[320px] mt-[-128px] relative py-8 border-[0.0625rem] border-border_primary bg-white rounded-[0.25rem]">
              <div className="flex items-center justify-center">
                <Image
                  src={ProfileImage.avatar}
                  alt="Avatar"
                  className="rounded-full w-[175px] object-cover"
                />
              </div>
              <p className="text-[28px] font-medium text-text_primary text-center pt-2">
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
                <p className="text-[14px] text-text_primary">
                  Become a member when
                </p>
                <p className="text-[14px] text-third">
                  {formatDateToLong(userProfile?.member_since)}
                </p>
              </div>
              <div className="mt-6 px-6">
                <div className="text-text_secondary px-4 py-3 border border-border_secondary rounded-[4px] max-w-full bg-[#FBFBFC]">
                  <p className="text-text_secondary text-[0.875rem] leading-[1.65] p-0 line-clamp-5 break-words">
                    <i>{userProfile?.bio}</i>
                  </p>
                </div>
              </div>

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
            <div className="w-[320px] mt-4 relative border-[0.0625rem] border-border_primary bg-white rounded-[0.25rem]">
              <div className="max-w-4xl mx-auto">
                <div className="p-6">
                  {/* Education Section */}
                  <div className="bg-white rounded-lg pb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-blue-600 font-medium">
                        Trình độ học vấn
                      </h2>
                      <Link
                        href="/user/edit/education"
                        className="text-gray-500"
                      >
                        <FontAwesomeIcon
                          icon={faEdit}
                          className="text-[20px] text-gray-500"
                        />
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
                        Chưa cung cấp thông tin
                      </div>
                    )}
                  </div>
                  <hr className="bg-border_secondary h-[1px] block w-full border-none m-0 box-content" />
                  {/* Work Experience Section */}
                  <div className="bg-white rounded-lg py-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-blue-600 font-medium">
                        Kinh nghiệm làm việc
                      </h2>
                      <Link
                        href="/user/edit/experience"
                        className="text-gray-500"
                      >
                        <FontAwesomeIcon
                          icon={faEdit}
                          className="text-[20px] text-gray-500"
                        />
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
                        Chưa cung cấp thông tin
                      </div>
                    )}
                  </div>
                  <hr className="bg-border_secondary h-[1px] block w-full border-none m-0 box-content" />

                  {/* Skills Section */}
                  <div className="bg-white rounded-lg py-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-blue-600 font-medium">Kỹ năng</h2>
                      <Link
                        href="/user/edit/skills"
                        className="text-gray-500"
                      >
                        <FontAwesomeIcon
                          icon={faEdit}
                          className="text-[20px] text-gray-500"
                        />
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
                                Trình độ trung bình
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm">
                        Chưa cung cấp thông tin
                      </div>
                    )}
                  </div>
                  <hr className="bg-border_secondary h-[1px] block w-full border-none m-0 box-content" />

                  {/* Languages Section */}
                  <div className="bg-white rounded-lg py-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-blue-600 font-medium">Ngôn ngữ</h2>
                      <Link
                        href="/user/edit/languages"
                        className="text-gray-500"
                      >
                        <FontAwesomeIcon
                          icon={faEdit}
                          className="text-[20px] text-gray-500"
                        />
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
                                  Chuyên môn cao
                                </p>
                              </div>
                            );
                          }
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm">
                        Chưa cung cấp thông tin
                      </div>
                    )}
                  </div>
                  <hr className="bg-border_secondary h-[1px] block w-full border-none m-0 box-content" />

                  {/* Certifications Section */}
                  <div className="bg-white rounded-lg py-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-blue-600 font-medium">
                        Chứng chỉ và giải thưởng
                      </h2>
                      <Link
                        href="/user/edit/certifications"
                        className="text-gray-500"
                      >
                        <FontAwesomeIcon
                          icon={faEdit}
                          className="text-[20px] text-gray-500"
                        />
                      </Link>
                    </div>
                    {userProfile && userProfile?.language.length > 0 ? (
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
                        Chưa cung cấp thông tin
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </aside>
          <section className="w-full">
            <h2 className="py-[3rem] text-[28px] font-medium text-text_primary w-full">
              The work of {userProfile?.username}
            </h2>
            <div className="grid grid-cols-[1fr_1fr_1fr] border-b-[2px] border-b-border_primary">
              <div className="relative border-b-2 border-border_primary hover:text-third duration-150 flex justify-center items-center cursor-pointer px-1 py-3 font-bold text-third  after:absolute after:bottom-[-3px] after:h-[2px] after:w-full after:bg-third">
                Reviews from freelancers
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default CurrentProfile;
