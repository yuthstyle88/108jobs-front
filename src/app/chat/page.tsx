"use client";
import React from "react";
import Link from "next/link";
import { Bell, MessageCircle, ChevronDown, Search } from "lucide-react";

const Chat = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-fastwork-blue text-white py-3 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/chat" className="flex items-center mr-4">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2"
            >
              <path
                d="M21.2 8.4c.5.38.8.97.8 1.6 0 1.1-.9 2-2 2H10a2 2 0 1 1 0-4h10c1.1 0 2 .9 2 2"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 8v5.5a2.5 2.5 0 0 1-5 0V8"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 8v5.5a2.5 2.5 0 0 1-5 0V4"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-semibold text-lg">fastwork</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="/chat/messages"
            className="text-white hover:text-gray-200"
          >
            <MessageCircle size={20} />
          </Link>
          <Link
            href="/notifications"
            className="text-white hover:text-gray-200"
          >
            <Bell size={20} />
          </Link>
          <div className="flex items-center bg-white bg-opacity-10 rounded-full px-3 py-1">
            <span className="text-sm mr-1">0.00</span>
            <span className="bg-white text-fastwork-blue text-xs px-1 rounded">
              ฿
            </span>
          </div>
          <div className="flex items-center">
            <img
              src="/lovable-uploads/cbef2fc0-6fab-4481-9b0f-7b6f6ea8f307.png"
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <ChevronDown size={16} className="ml-1" />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 border-r bg-white">
          <div className="p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหาจากอะไร"
                className="w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:border-fastwork-blue"
              />
              <Search
                size={18}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>

            <div className="flex items-center mt-4">
              <button className="flex items-center justify-between w-full py-2 px-3 text-sm text-gray-700 bg-gray-100 rounded-md">
                <span>สาขางาน</span>
                <ChevronDown size={16} />
              </button>
            </div>

            <label className="flex items-center mt-3 text-sm text-gray-600">
              <input type="checkbox" className="mr-2 rounded" />
              แสดงเฉพาะช่องว่างที่ไม่ได้จ้าง
            </label>
          </div>

          <div className="border-t mt-4">
            <Link href="/chat/message" className="block">
              <div className="p-4 flex items-start bg-blue-50 border-l-4 border-fastwork-blue hover:bg-blue-100 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                  <img
                    src="/lovable-uploads/cbef2fc0-6fab-4481-9b0f-7b6f6ea8f307.png"
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <div className="flex items-center">
                    <h4 className="font-medium text-sm">Vanint</h4>
                    <span className="ml-2 text-xs text-gray-500">
                      #RSQCU4KL
                    </span>
                    <span className="ml-2 text-xs text-gray-400">เมื่อวาน</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">
                    สวัสดีครับ เหมือง่ายมาก ลูกค้า...
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-100 flex justify-center items-center p-4">
          <div className="text-center max-w-md">
            <img
              src="/lovable-uploads/bcd09398-a41e-4ac5-953a-2cb2f8e060fc.png"
              alt="Empty state"
              className="mx-auto w-40 h-40 object-contain"
            />
            <h3 className="mt-4 text-blue-800 font-medium">
              กรุณาเลือกออเดอร์ทางซ้ายมือ
            </h3>
            <p className="text-blue-800">เพื่อเริ่มสนทนา</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
