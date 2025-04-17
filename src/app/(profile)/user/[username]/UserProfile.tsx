"use client";
import { ProfileImage } from "@/constants/images";
import { faEdit, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

import { Pencil } from "lucide-react";
import Link from "next/link";
import { usePrivateFetchParams } from "@/hooks/api-hooks";
import { API_ROUTES_SELLER } from "@/api/endpoints";
import Loading from "@/components/Loading";
type Props = {
    username: string;
};
const UserProfile = ({ username }: Props) => {
  
  const {data,isLoading} = usePrivateFetchParams(`/users/${username}`)

  console.log("data", data);

  if(isLoading) return <Loading/>
  
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
                  alt="avatar"
                  className="rounded-full w-[175px] object-cover"
                />
              </div>
              <p className="text-[28px] font-medium text-text_primary text-center pt-2">
                uykpfzno
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
                <p className="text-[14px] text-third">February 15, 2025</p>
              </div>
              <div className="mt-6 px-6">
                <div className="text-text_secondary px-4 py-3 border border-border_secondary rounded-[4px] max-w-full bg-[#FBFBFC]">
                  <p className="text-text_secondary text-[0.875rem] leading-[1.65] p-0 line-clamp-5 break-words">
                    <i>http://localhost:3000/profilehttp</i>
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
                <div className="space-y-6 px-6">
                  {/* Education Section */}
                  <div className="bg-white rounded-lg py-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-blue-600 font-medium">
                        Trình độ học vấn
                      </h2>
                      <Link
                        href="/profile/edit/education"
                        className="text-gray-500"
                      >
                        <FontAwesomeIcon
                          icon={faEdit}
                          className="text-[20px] text-gray-500"
                        />
                      </Link>
                    </div>
                    <div className="text-gray-500 text-sm">
                      Chưa cung cấp thông tin
                    </div>
                  </div>
                  <hr className="bg-border_secondary h-[1px] block w-full border-none m-0 box-content" />
                  {/* Work Experience Section */}
                  <div className="bg-white rounded-lg py-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-blue-600 font-medium">
                        Kinh nghiệm làm việc
                      </h2>
                      <Link
                        href="/profile/edit/experience"
                        className="text-gray-500"
                      >
                        <FontAwesomeIcon
                          icon={faEdit}
                          className="text-[20px] text-gray-500"
                        />
                      </Link>
                    </div>
                    <div className="text-gray-500 text-sm">
                      Chưa cung cấp thông tin
                    </div>
                  </div>
                  <hr className="bg-border_secondary h-[1px] block w-full border-none m-0 box-content" />

                  {/* Skills Section */}
                  <div className="bg-white rounded-lg py-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-blue-600 font-medium">Kỹ năng</h2>
                      <Link
                        href="/profile/edit/skills"
                        className="text-gray-500"
                      >
                        <FontAwesomeIcon
                          icon={faEdit}
                          className="text-[20px] text-gray-500"
                        />
                      </Link>
                    </div>
                    <div className="text-gray-500 text-sm">
                      Chưa cung cấp thông tin
                    </div>
                  </div>
                  <hr className="bg-border_secondary h-[1px] block w-full border-none m-0 box-content" />

                  {/* Languages Section */}
                  <div className="bg-white rounded-lg py-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-blue-600 font-medium">Ngôn ngữ</h2>
                      <Link
                        href="/profile/edit/languages"
                        className="text-gray-500"
                      >
                        <FontAwesomeIcon
                          icon={faEdit}
                          className="text-[20px] text-gray-500"
                        />
                      </Link>
                    </div>
                    <div className="text-gray-500 text-sm">
                      Chưa cung cấp thông tin
                    </div>
                  </div>
                  <hr className="bg-border_secondary h-[1px] block w-full border-none m-0 box-content" />

                  {/* Certifications Section */}
                  <div className="bg-white rounded-lg py-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-blue-600 font-medium">
                        Chứng chỉ và giải thưởng
                      </h2>
                      <Link
                        href="/profile/edit/certifications"
                        className="text-gray-500"
                      >
                        <FontAwesomeIcon
                          icon={faEdit}
                          className="text-[20px] text-gray-500"
                        />
                      </Link>
                    </div>
                    <div className="text-gray-500 text-sm">
                      Chưa cung cấp thông tin
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
          <section className="w-full">
            <h2 className="py-[3rem] text-[28px] font-medium text-text_primary w-full">
              The work of uykpfzno
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

export default UserProfile;
