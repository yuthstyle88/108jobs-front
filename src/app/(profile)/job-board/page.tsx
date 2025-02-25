"use client";
import { ProfileImage } from "@/constants/images";
import Image from "next/image";
import React, { useState } from "react";

interface JobListing {
  id: number;
  title: string;
  category: string;
  jobType: string;
  budget: number;
  postedDate: string;
  deadline: string;
  isVerified?: boolean;
  isHighlighted?: boolean;
}

const JobBoard = () => {
  const [activeTab, setActiveTab] = useState<"myPosts" | "closedPosts">(
    "myPosts"
  );

  const jobListings: JobListing[] = [
    {
      id: 1,
      title: "ค้นหางานฟรีแลนซ์ที่สุวรรณภูมิฯ",
      category: "อื่นๆ",
      jobType: "ฟรีแลนซ์",
      budget: 400,
      postedDate: "25/02/2025 22:14",
      deadline: "-",
    },
    {
      id: 2,
      title: "ค้นหาคนเขียน floor plan ตารางสำนักงาน location ล็อบบี้เลส",
      category: "อื่นๆ",
      jobType: "ฟรีแลนซ์",
      budget: 100,
      postedDate: "25/02/2025 21:08",
      deadline: "-",
    },
    {
      id: 3,
      title: "ค้นหางานบริหารหานายบัญชี",
      category: "ธุรกิจและการเงิน",
      jobType: "หางานใหม่",
      budget: 1000,
      postedDate: "25/02/2025 20:48",
      deadline: "-",
      isHighlighted: true,
    },
    {
      id: 4,
      title: "ค้นหานักภาษาทับแลนซ์เป็นภาษาอังกฤษ",
      category: "ภาษา",
      jobType: "ฟรีแลนซ์",
      budget: 1500,
      postedDate: "25/02/2025 19:52",
      deadline: "-",
    },
    {
      id: 5,
      title: "ค้นหาคนตัดต่อคลิป ลง IG reels",
      category: "สื่อออนไลน์",
      jobType: "ฟรีแลนซ์",
      budget: 500,
      postedDate: "25/02/2025 18:23",
      deadline: "-",
    },
    {
      id: 6,
      title: "ค้นหาคนหาทำ backlink Guest post 1,000 บาท",
      category: "อื่นๆ",
      jobType: "ฟรีแลนซ์",
      budget: 1000,
      postedDate: "25/02/2025 17:33",
      deadline: "30/03/2025",
    },
    {
      id: 7,
      title:
        "ค้นหานักถ่าย footageสินค้าเกี่ยวกับผักสวีเกน ทั้งสตริเล็ต ลุคหรัวร็อตแร",
      category: "สื่อออนไลน์",
      jobType: "ฟรีแลนซ์",
      budget: 1000,
      postedDate: "25/02/2025 17:18",
      deadline: "02/03/2025",
    },
    {
      id: 8,
      title: "ค้นหาอ่านมาก Voice over จำนวน 2 เสียง",
      category: "นักพากย์เสียง",
      jobType: "ฟรีแลนซ์",
      budget: 500,
      postedDate: "25/02/2025 17:14",
      deadline: "25/02/2025",
    },
    {
      id: 9,
      title: "ค้นหาคนทำบนเกมออนไลน์ mini game",
      category: "สื่อออนไลน์",
      jobType: "ฟรีแลนซ์",
      budget: 5000,
      postedDate: "25/02/2025 17:13",
      deadline: "05/03/2025",
    },
    {
      id: 10,
      title: "ค้นหาหนังตราตลาดเป้าหมายอินเตอร์เฟส",
      category: "การตลาด",
      jobType: "ฟรีแลนซ์",
      budget: 100,
      postedDate: "25/02/2025 16:48",
      deadline: "-",
    },
    {
      id: 11,
      title: "ค้นหาทำยกตยติกtok 8 คลิป 8000.- สินค้าสมุนไพรสกินแคร์",
      category: "สื่อออนไลน์",
      jobType: "ฟรีแลนซ์",
      budget: 8000,
      postedDate: "25/02/2025 15:29",
      deadline: "22/03/2025",
    },
    {
      id: 12,
      title: "ค้นหาweb dev สำหรับโปรเจคฟินอล",
      category: "พัฒนาเว็บไซต์",
      jobType: "ฟรีแลนซ์",
      budget: 99999,
      postedDate: "25/02/2025 13:07",
      deadline: "-",
      isVerified: true,
    },
    {
      id: 13,
      title: "ค้นหารับสมัครพนักงาน ADS",
      category: "พัฒนาแอปพลิเคชั่น",
      jobType: "งานประจำ",
      budget: 30000,
      postedDate: "25/02/2025 12:40",
      deadline: "30/03/2025",
    },
    {
      id: 14,
      title: "ค้นหาStaff จ่านสัมนา",
      category: "อื่นๆ",
      jobType: "ฟรีแลนซ์",
      budget: 700,
      postedDate: "25/02/2025 11:47",
      deadline: "-",
    },
    {
      id: 15,
      title: "ค้นหาติดตั้ง VDO ระบบบริหารคุณภาพ ISO 9001 : 2015",
      category: "ธุรกิจและการเงิน",
      jobType: "ฟรีแลนซ์",
      budget: 2500,
      postedDate: "25/02/2025 09:53",
      deadline: "02/03/2025",
    },
    {
      id: 16,
      title: "ค้นหาช่างถ่ายภาพที่หมอมณพลสาย 4 วันที่ 30/3/68",
      category: "สุขภาพและชีวิต",
      jobType: "ฟรีแลนซ์",
      budget: 2000,
      postedDate: "25/02/2025 09:14",
      deadline: "30/03/2025",
    },
    {
      id: 17,
      title: "ค้นหาคนทำ SFX ด้วยตร",
      category: "สุขภาพและชีวิต",
      jobType: "ฟรีแลนซ์",
      budget: 300,
      postedDate: "25/02/2025 04:57",
      deadline: "-",
    },
    {
      id: 18,
      title: "ค้นหาคนสร้างร่างกานเผน tiktok",
      category: "อีเว้นต์เอเนเตอร์",
      jobType: "ฟรีแลนซ์",
      budget: 1500,
      postedDate: "25/02/2025 04:03",
      deadline: "-",
    },
    {
      id: 19,
      title: "ค้นหาผู้ให้กำลังฟื้นฟูออนไลน์",
      category: "งาน IoT",
      jobType: "ฟรีแลนซ์",
      budget: 2000,
      postedDate: "24/02/2025 22:15",
      deadline: "-",
    },
    {
      id: 20,
      title:
        "ค้นหาติดตั้นทำข้อ Mindset ความสำเร็จ 10 คลิป เอาตอนริบประเด็นต่างๆ",
      category: "สุขภาพและชีวิต",
      jobType: "ฟรีแลนซ์",
      budget: 1000,
      postedDate: "24/02/2025 21:46",
      deadline: "-",
    },
  ];

  return (
    <div className="bg-[#F6F9FE] ">
      <div className="max-w-[1280px] mx-auto py-8 px-4 md:px-6 lg:px-8 rounded-lg shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-blue-600 mb-1">
            บอร์ดประกาศงาน
          </h2>
          <p className="text-gray-600">
            ผู้ว่าจ้างโพสต์งานเพื่อหาคนที่ใช่ ฟรีแลนซ์เลือกงานที่สนใจ
          </p>
        </div>

        <div className="border-1 border-border_primary bg-white p-4 rounded-lg">
          <div className="border-b mb-6">
            <div className="flex -mb-px">
              <button
                className={`mr-6 py-2 text-sm font-medium border-b-2 ${
                  activeTab === "myPosts"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("myPosts")}
              >
                บอร์ดประกาศงาน
              </button>
              <button
                className={`py-2 text-sm font-medium border-b-2 ${
                  activeTab === "closedPosts"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("closedPosts")}
              >
                งานที่คุณลงประกาศ
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="w-full sm:w-48">
                <div className="relative">
                  <select className="appearance-none bg-white border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500">
                    <option value="">ค้นหาหมวดหมู่งาน</option>
                    <option value="design">ออกแบบกราฟิก</option>
                    <option value="writing">เขียนบทความ</option>
                    <option value="development">พัฒนาเว็บไซต์</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="w-full sm:w-48">
                <div className="relative">
                  <select className="appearance-none bg-white border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500">
                    <option value="">ลักษณะการจ้าง</option>
                    <option value="freelance">ฟรีแลนซ์</option>
                    <option value="fulltime">งานประจำ</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <a href="#" className="text-blue-600 text-sm hover:underline">
                อยากรับงานบนบอร์ดประกาศงาน ?
              </a>
              <button className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                ประกาศหาฟรีแลนซ์ (0/3)
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border-1 border-border_primary rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ชื่องาน
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    หมวดหมู่
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ลักษณะการจ้าง
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    งบประมาณ (บาท)
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ลงประกาศเมื่อ
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    สิ้นสุดงานภายใน
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobListings.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-start">
                        <div className="mr-2 mt-1">
                          {job.isVerified ? (
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3.5 w-3.5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          ) : (
                            <svg
                              className="h-5 w-5 text-gray-400"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9 12h6m-3-3v6M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                        <div>
                          <a
                            href="#"
                            className=" hover:text-blue-600 font-medium text-[14px] text-text_primary font-sans"
                          >
                            {job.title}
                          </a>
                          {job.isHighlighted && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              EN
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.jobType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {job.budget.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.postedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.deadline}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-center mt-8">
            <nav className="flex items-center">
              <a
                href="#"
                className="px-2 py-2 rounded border border-gray-300 text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">First</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M7.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L3.414 10l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="mx-1 px-2 py-2 rounded border border-gray-300 text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <span className="mx-3 text-gray-700">
                <span className="font-medium text-blue-600">1</span> จาก{" "}
                <span>35</span>
              </span>
              <a
                href="#"
                className="mx-1 px-2 py-2 rounded border border-gray-300 text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Next</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="px-2 py-2 rounded border border-gray-300 text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Last</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 6.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M12.293 15.707a1 1 0 010-1.414L16.586 10l-4.293-3.293a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </nav>
          </div>
        </div>

        <div className="mt-12 h-[148px] bg-[#D0E1FB] rounded-lg overflow-hidden flex justify-center items-center">
          <Image
            src={ProfileImage.job_board}
            alt="Job Board"
            className="w-auto h-full object-contain"
          />
        </div>

        <div className="text-center mt-8">
          <a
            href="#"
            className="text-blue-600 hover:underline inline-flex items-center"
          >
            ข้อรับข้อเสนอแนะเรื่องประกาศงาน
            <svg
              className="ml-1 w-4 h-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default JobBoard;
