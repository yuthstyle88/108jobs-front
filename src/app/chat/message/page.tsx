import React from "react";
import Link from "next/link";
import {
  Bell,
  MessageCircle,
  ChevronDown,
  Search,
  Phone,
  ChevronUp,
  Send,
  Paperclip,
  Smile,
} from "lucide-react";

const ChatMessage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-fastwork-blue text-white py-3 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center mr-4">
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
          <Link href="/messages" className="text-white hover:text-gray-200">
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
            <div className="p-4 flex items-start bg-blue-50 border-l-4 border-fastwork-blue">
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
                  <span className="ml-2 text-xs text-gray-500">#RSQCU4KL</span>
                  <span className="ml-2 text-xs text-gray-400">เมื่อวาน</span>
                </div>
                <p className="text-sm text-gray-700 mt-1">
                  สวัสดีครับ เหมือง่ายมาก ลูกค้า...
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="border-b p-4 flex justify-between items-center bg-white">
            <div className="flex items-center">
              <div className="mr-4">
                <span className="text-sm font-medium">Vanint</span>
                <span className="text-xs text-gray-500 ml-2">#RSQCU4KL</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-gray-100 p-2 rounded hover:bg-gray-200">
                <Phone size={18} className="text-gray-600" />
              </button>
              <a href="#" className="text-blue-500 hover:underline text-sm">
                คู่มือการใช้งาน
              </a>
              <a href="#" className="text-blue-500 hover:underline text-sm">
                รายละเอียด
              </a>
            </div>
          </div>

          {/* Service Info */}
          <div className="bg-gray-100 p-3 flex justify-between items-center">
            <span className="text-gray-600 text-sm">เลือกที่นี่</span>
            <span className="text-xs text-gray-500">20 วัน</span>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {/* Message box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4 max-w-md ml-auto">
              <div className="bg-white shadow-sm rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      LOGO Design and BRAND ID Tea Designer high level ใครทำดี
                      Global
                    </h4>
                    <div className="mt-2 text-sm">
                      <p className="text-gray-700">ราคา : 6,900 บาท</p>
                    </div>
                  </div>
                  <img
                    src="/lovable-uploads/cbef2fc0-6fab-4481-9b0f-7b6f6ea8f307.png"
                    alt="Service"
                    className="w-16 h-12 object-cover rounded"
                  />
                </div>
              </div>

              <div className="mt-3 text-sm">
                <p className="font-medium">รายละเอียดแพ็คเกจ:</p>
                <ul className="mt-1 space-y-1 text-gray-700">
                  <li>• งานบริษัท/แบรนด์คุณภาพ 1 ชิ้น</li>
                  <li>• แก้ไม่เกินครั้งละ 3 ครั้ง</li>
                  <li>• ระยะเวลาโปรเจกต์งาน 4-7 วัน</li>
                  <li>• มอบแบบไฟล์หลากหลาย 3 ชิ้น</li>
                </ul>
              </div>

              <div className="mt-3 text-sm">
                <p className="font-medium">บริการพิเศษ:</p>
                <ul className="mt-1 space-y-1 text-gray-700">
                  <li>• ไฟล์ๆ นามบัตร</li>
                  <li>• ไฟล์ความละเอียดสูง พร้อมนำไปใช้ 500DPI</li>
                  <li>• แถม : Corporate Identity</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-center my-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mx-auto max-w-lg">
                <div className="flex">
                  <div className="text-yellow-600 mr-2">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  </div>
                  <div className="text-sm text-gray-700">
                    <p>
                      คุณเลือก
                      'หยิบรายการที่เลือกส่งไปยังแชทตามการเบราว์ซ์ของฟรีแลนซ์มา'
                      จากโอเพนแชทของลูกค้ามาที่แชทนี้แล้ว
                      ลูพามาดูว่าฟรีแลนซ์กำลังขายอะไรอยู่
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* More messages */}
            <div className="bg-gray-200 rounded-lg p-4 my-4 max-w-lg">
              <p className="text-gray-700 text-sm">
                [รับงาน ผมขอกรีฟทั้งหมดนะครับ] สรุปสิ่งที่ผมเข้าใจตาม [โจทย์]
                กรุณาแจ้งรายละเอียดกรีฟเพิ่มเติมถ้าใดๆ (ประเภท คอนเซปต์
                ความรู้สึกที่ต้องการสื่อ)
              </p>
            </div>

            <div className="text-center text-sm text-gray-500 my-4">
              --- 20 วัน ---
            </div>

            <div className="bg-gray-200 rounded-lg p-4 my-4 max-w-lg">
              <p className="text-gray-700 text-sm">
                โมเดิร์น บริษัท ส่วนตัวก็อัพไฟล์แอดมินส่งมาบอกว่า
                อยากได้มีดีไซน์เรียบๆ ทันสมัยหน่อย ฟอนต์ที่ดูดี สีไม่เลอะเทอะ
                ให้ดูแพงหน่อย
              </p>
              <p className="text-gray-500 text-xs mt-2">---</p>
            </div>

            <div className="bg-gray-200 rounded-lg p-4 my-4 max-w-lg">
              <p className="text-gray-700 text-sm">
                **1. ข้อมูลทั่วไปของลูกค้า**
                <br />
                - บริษัท/แบรนด์เรียกว่าอะไร กลุ่มเป้าหมายคือใคร
                สินค้า/บริการขายให้แก่ใคร?
                <br />- คู่แข่งบนท้องตลาดมีใคร และตัวเองดีต่างจากผู้อื่นอย่างไร?
                (ถ้ามี เพพ, ความยืดเยื่อ เป็นต้น)
              </p>
            </div>

            {/* More message chunks... */}
            <div className="bg-blue-50 rounded-lg p-4 my-4 max-w-md ml-auto">
              <p className="text-gray-700 text-sm">
                สวัสดีครับ เหมือง่ายมาก ลูกค้าเรียบร้อยแล้ว ได้สเตาท์
              </p>
            </div>

            <div className="bg-gray-200 rounded-lg p-4 my-4 max-w-lg">
              <p className="text-gray-700 text-sm">
                ลูกค้าเป็นอย่างไรบ้างครับ ตอบได้ครบทุกข้อมั้ย
              </p>
            </div>
          </div>

          {/* Message Input */}
          <div className="border-t px-4 py-3 bg-white">
            <div className="flex items-center">
              <button className="text-gray-400 hover:text-gray-600 mr-3">
                <Paperclip size={20} />
              </button>
              <div className="flex-1 border rounded-lg overflow-hidden flex">
                <textarea
                  placeholder="พิมพ์ข้อความที่นี่"
                  className="flex-1 px-3 py-2 resize-none focus:outline-none min-h-[40px]"
                  rows={1}
                ></textarea>
                <button className="bg-white px-3 text-gray-400 hover:text-gray-600">
                  <Smile size={20} />
                </button>
              </div>
              <button className="ml-3 text-blue-500 hover:text-blue-600">
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Service Details */}
        <div className="w-64 border-l bg-white overflow-y-auto">
          <div className="p-4 border-b">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <span className="text-blue-600 text-sm">
                มอบหมายงาน / จ่ายเพิ่ม
              </span>
            </div>
          </div>

          <div className="p-4 border-b">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-500"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="mt-3 text-center">
                <h4 className="font-medium text-gray-800">
                  มอบหมายงาน / จ่ายเพิ่ม fastwork
                </h4>
              </div>
            </div>
          </div>

          <div className="p-4 border-b">
            <h4 className="font-medium text-gray-700 mb-2">ข้อมูลทั่วไป</h4>
            <div className="text-sm text-gray-600">
              <p className="mb-1">ชื่อแพ็คเกจ:</p>
              <p className="font-medium mb-2">RSQCU4KL</p>
            </div>
          </div>

          <div className="p-4 border-b">
            <h4 className="font-medium text-gray-700 mb-2">รายละเอียดงาน</h4>
            <button className="flex items-center justify-between w-full py-2 text-sm text-gray-600">
              <span>เอกสารแนบ</span>
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
