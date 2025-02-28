"use client";
import { ProfileIcon } from "@/constants/icons";
import { ProfileImage } from "@/constants/images";
import Image from "next/image";
import React, { useState } from "react";

type TabType = "account" | "contact" | "location" | "business";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState<TabType>("account");
  const [selectedCountry, setSelectedCountry] = useState("foreign");

  const renderTabContent = () => {
    switch (activeTab) {
      case "account":
        return (
          <div>
            <div className="border-1 border-border_primary rounded-lg bg-white py-6">
              <div className="border-b-1 px-6">
                <h2 className="text-[16px] font-medium mb-2 text-text_primary">
                  ข้อมูลบัญชี
                </h2>
                <p className="text-gray-600 mb-6 text-[14px] font-sans">
                  กำหนดข้อมูลเบื้องต้นของคุณ
                </p>
              </div>

              <div className="flex justify-center my-8 px-6">
                <div className="relative">
                  <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
                    <Image
                      src={ProfileImage.avatar}
                      alt="avatar"
                      className="w-full h-full rounded-full"
                    />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2">
                    <svg
                      className="w-4 h-4 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-6 px-6 font-sans">
                <div>
                  <label className="block text-sm text-text_primary font-semibold mb-2">
                    ชื่อผู้ใช้ (Username)
                  </label>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">
                      fastwork.co/user/
                    </span>
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-text_secondary font-sans"
                      defaultValue="uykpfzno"
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-text_primary font-semibold text-gray-600 mb-2">
                    ชื่อที่ใช้แสดงในระบบ
                  </label>
                  <p className="text-[12px] text-gray-500 mb-2">
                    ตรงนี้คือชื่อที่ผู้บันทึกการเพื่อสร้างความน่าเชื่อถือ
                  </p>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-text_secondary"
                    defaultValue="uykpfzno"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm text-text_primary font-semibold text-gray-600 mb-2">
                    วันเกิด (ปี ค.ศ.)
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-text_secondary">
                      <option>14</option>
                    </select>
                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-text_secondary">
                      <option>ตุลาคม</option>
                    </select>
                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-text_secondary">
                      <option>2009</option>
                    </select>
                  </div>
                </div>
                <div className="self-end w-fit">
                  <button className="w-full bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    บันทึก
                  </button>
                </div>
              </div>
            </div>
            <div className="border-1 border-border_primary rounded-lg bg-white mt-5 p-6 flex flex-row justify-between">
              <div className="text-[16px] text-text_primary font-medium">
                password
                <p className="text-[14px] text-text_secondary font-normal">
                  Manage passwords in the fastwork system
                </p>
              </div>
              <div className="self-end w-fit">
                <button className="w-full bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Set a password
                </button>
              </div>
            </div>
          </div>
        );

      case "contact":
        return (
          <div className="">
            <div className="bg-white rounded-lg shadow-sm border-1 border-border_primary mb-6">
              <div className="border-b p-6">
                <h2 className="text-[16px] font-medium mb-2 text-text_primary">
                  ข้อมูลติดต่อ
                </h2>
                <p className="text-gray-600 text-[14px] font-sans">
                  เพื่อให้เราสามารถติดต่อคุณได้
                </p>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-[14px] font-sans text-text_primary font-semibold mb-1">
                    อีเมลที่ติดต่อได้
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 py-2 px-3 bg-gray-50 border border-gray-200 rounded text-gray-700">
                      vutruonggiang452002@gmail.com
                    </div>
                    <button className="text-blue-600 hover:underline font-medium">
                      เปลี่ยน
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm text-text_primary font-semibold text-gray-600 mb-1 font-sans">
                    เบอร์โทรศัพท์ที่ติดต่อได้ (ในประเทศไทย)
                  </h3>
                  <p className="text-[12px] text-gray-500 mb-2 font-sans">
                    หากใช้เบอร์ต่างประเทศ กรุณาติดต่อคุยผ่านเมล์ล่อย
                    เพื่อทำการยืนยัน
                  </p>
                  <div className="flex gap-4">
                    <input
                      type="tel"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="ระบุเบอร์โทร"
                      defaultValue="uykpfzno"
                    />
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                      ยืนยัน
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="">
              <div className="bg-white rounded-lg text-sm text-text_primary font-semibold font-sans mb-6">
                <div className="p-6 border-b">
                  <h2 className="text-[16px] font-medium mb-2 text-text_primary">
                    ข้อมูลที่อยู่
                  </h2>
                  <p className="text-gray-600 text-[14px] font-sans">
                    เพื่อให้เราสามารถส่งของ และเอกสารให้คุณได้
                  </p>
                </div>

                <div className="p-6 flex flex-col gap-6 border-b">
                  <div>
                    <h3 className="text-base font-medium mb-3">
                      ที่อยู่ปัจจุบัน
                    </h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <label className="flex items-center py-3 px-4 border border-gray-200 rounded-lg cursor-pointer">
                        <input
                          type="radio"
                          name="country"
                          defaultValue="thailand"
                          checked={selectedCountry === "thailand"}
                          onChange={(e) => setSelectedCountry(e.target.value)}
                          className="text-blue-600 mr-3"
                        />
                        <span>ประเทศไทย</span>
                      </label>
                      <label className="flex items-center py-3 px-4 border border-gray-200 rounded-lg cursor-pointer bg-blue-50 border-blue-600">
                        <input
                          type="radio"
                          name="country"
                          defaultValue="foreign"
                          checked={selectedCountry === "foreign"}
                          onChange={(e) => setSelectedCountry(e.target.value)}
                          className="text-blue-600 mr-3"
                        />
                        <span>ต่างประเทศ</span>
                      </label>
                    </div>
                    <div className="relative">
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 appearance-none bg-white pr-10">
                        <option>Vietnam</option>
                      </select>
                      <svg
                        className="w-5 h-5 text-gray-500 absolute right-3 top-3"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                  <div className="self-end w-fit ">
                    <button className="w-full bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                      บันทึก
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "location":
        return (
          <div>
            <div className="border-1 border-border_primary rounded-lg bg-white py-6">
              <div className="border-b-1 px-6">
                <h2 className="text-[16px] font-medium mb-2 text-text_primary">
                  ข้อมูลเพื่อจ้างในนามบุคคล
                </h2>
                <p className="text-gray-600 mb-6 text-[14px] font-sans">
                  สำหรับออกเอกสาร การจ้างแบบบุคคลธรรมดา
                </p>
              </div>
              <div className="flex flex-col gap-6 px-6 pt-6 font-sans">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-text_primary font-semibold text-gray-600 mb-2">
                      ชื่อ
                    </label>
                    <input
                      type="text"
                      className="border w-full border-gray-300 rounded-lg px-3 py-2 text-text_secondary font-sans"
                      defaultValue="uykpfzno"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-text_primary font-semibold text-gray-600 mb-2">
                      นามสกุล
                    </label>
                    <input
                      type="text"
                      className="border w-full border-gray-300 rounded-lg px-3 py-2 text-text_secondary font-sans"
                      defaultValue="uykpfzno"
                      readOnly
                    />
                  </div>
                </div>
                <div className="self-end w-fit">
                  <button className="w-full bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    บันทึก
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "business":
        return (
          <div>
            <div className="mb-6">
              <Image
                src={ProfileIcon.hiring_info}
                alt="hiring-info"
                className="w-full h-full rounded-tl-lg rounded-tr-lg"
              />
              <div className="px-3 py-2 bg-[#E3EDFD] rounded-br-lg rounded-bl-lg">
                <ul className="font-sans">
                  <li>
                    <p className="text-[0.75rem] text-third">
                      • ผู้ว่าจ้างกรุณาขอสำเนาบัตรประชาชนจาก{" "}
                      <strong>“ฟรีแลนซ์”</strong> โดยตรง
                    </p>
                  </li>
                  <li>
                    <p className="text-[0.75rem] text-third">
                      • ผู้ว่าจ้างต้องออกหนังสือรับรองการหักภาษี ณ ที่จ่าย (ทวิ
                      50) เป็น <strong>“ชื่อของฟรีแลนซ์”</strong>{" "}
                      <span className="underline">(ดูตัวอย่างเอกสาร)</span>
                    </p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-1 border-border_primary rounded-lg bg-white py-6">
              <div className="border-b-1 px-6">
                <h2 className="text-[16px] font-medium mb-2 text-text_primary">
                  ข้อมูลเพื่อจ้างในนามบริษัท
                </h2>
                <p className="text-gray-600 mb-6 text-[14px] font-sans">
                  สำหรับออกเอกสาร การจ้างแบบบริษัท
                </p>
              </div>
              <div className="p-6">
                <label className="block text-sm text-text_primary font-semibold text-gray-600 mb-2">
                  เลขประจำตัวผู้เสียภาษี (บริษัท)
                </label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="ระบุเลขประจำตัวผู้เสียภาษี"
                    defaultValue=""
                  />
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    ค้นหาข้อมูลบริษัท
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="grid-container-desktop w-full min-h-screen py-8 bg-[#F6F7F8]">
      <div className="col-start-2 col-end-3">
        <div className="grid-cols-[286px_1fr] grid gap-6 items-start">
          <div>
            <p className="font-medium text-[16px] text-text_primary pb-[16px]">
              บัญชีของคุณ
            </p>
            <div className="flex flex-col">
              <button
                className={`flex items-center gap-2 px-6 py-4 border-l-4 ${
                  activeTab === "account"
                    ? "text-blue-600 border-l-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-800 border-l-transparent hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("account")}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>ข้อมูลบัญชี</span>
              </button>
              <button
                className={`flex items-center gap-2 px-6 py-4 border-l-4 ${
                  activeTab === "contact"
                    ? "text-blue-600 border-l-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-800 border-l-transparent hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("contact")}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>ข้อมูลติดต่อ</span>
              </button>
              <p className="font-medium text-[16px] text-text_primary py-[16px]">
                บัญชีของคุณ
              </p>
              <button
                className={`flex items-center gap-2 px-6 py-4 border-l-4 ${
                  activeTab === "location"
                    ? "text-blue-600 border-l-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-800 border-l-transparent hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("location")}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>ข้อมูลเพื่อจ้างในนามบุคคล</span>
              </button>
              <button
                className={`flex items-center gap-2 px-6 py-4 border-l-4 ${
                  activeTab === "business"
                    ? "text-blue-600 border-l-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-800 border-l-transparent hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("business")}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 3h18v18H3z" />
                  <path d="M3 9h18" />
                  <path d="M9 21V9" />
                </svg>
                <span>ข้อมูลเพื่อจ้างในนามบริษัท</span>
              </button>
            </div>
          </div>

          <div className="">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
