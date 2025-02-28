"use client";
import CategoryCard from "@/components/CategoryDetail/components/CategoryCard";
import { ProfileImage } from "@/constants/images";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";
const UserProfile = () => {
  const [activeTab, setActiveTab] = useState<"reviews" | "clients">("reviews");
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
                    className="text-[14px] text-[#e9b10c] "
                  />
                ))}
              </div>
              <div className="flex items-center justify-center w-full">
                <div className="mt-3 px-4 py-1 rounded-full flex items-center justify-center bg-[#1EB899] text-white w-fit">
                  <svg
                    className="w-4 h-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium">
                    Verified Freelance
                  </span>
                </div>
              </div>
              <div className="w-full mt-4 space-y-3 px-4">
                <div className="flex justify-between items-center">
                  <div className="text-text_secondary">เป็นสมาชิกเมื่อ</div>
                  <div className="text-third font-medium">08 มกราคม 2021</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-text_secondary">จำนวนงานแล้ว</div>
                  <div className="text-third font-medium">1.2K ครั้ง</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-text_secondary">เวลาตอบกลับเฉลี่ย</div>
                  <div className="text-third font-medium">34 นาที</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-text_secondary">อัตราการทำงานสำเร็จ</div>
                  <div className="text-third font-medium">100%</div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg text-sm bg-[#FBFBFC] text-text_secondary px-4 font-sans mx-4 border-1 border-border_primary">
                <p>
                  ประสบการณ์กว่า 10 ปี ทางด้าน Digital Marketing
                  เกี่ยวกับการรับจ้างทำ SEO สำหรับบุคคลและบริษัทฯชั้นนำในไทย
                  HTML CSS SASS ใส่ค่า Keyword ดัด หน้าแรกงานแล้วกว่า 100000 KW
                  จาก...
                </p>
                <button className="mt-2 hover:underline font-medium text-text_primary">
                  ดูทั้งหมด
                </button>
              </div>
            </div>
            <div className="w-[320px] mt-4 py-4 relative border-[0.0625rem] border-border_primary bg-white rounded-[0.25rem]">
              <div className="px-4">
                <h3 className="text-lg font-medium mb-3 text-third">
                  ทักษะความสามารถ
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="text-text_primary">SEO</div>
                    <div className="px-3 py-1 rounded-lg text-sm bg-secondary_custom text-third">
                      ระดับเชี่ยวชาญ
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-text_primary">Wordpress</div>
                    <div className="px-3 py-1 rounded-lg text-sm bg-secondary_custom text-third">
                      ระดับเชี่ยวชาญ
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-text_primary">HTML</div>
                    <div className="px-3 py-1 rounded-lg text-sm bg-secondary_custom text-third">
                      ระดับเชี่ยวชาญ
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section className="w-full">
            <h2 className="pt-8 pb-4 text-[28px] font-medium text-text_primary w-full">
            งานของ taratra
            </h2>
            <section className="grid grid-cols-[repeat(3,minmax(1px,1fr))] gap-5">
            {Array.from({ length: 2 }, (_, index) => (
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
                    รีวิวจากผู้ว่าจ้าง (928)
                  </button>
                  <button
                    className={`py-2 text-sm font-medium border-b-2 ${
                      activeTab === "clients"
                        ? "text-third border-third"
                        : "text-text_secondary border-transparent hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("clients")}
                  >
                    รีวิวจากฟรีแลนซ์ (1)
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

export default UserProfile;
