"use client";
import { MessageImage } from "@/constants/images";
import { ChevronDown, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Chat = () => {
  return (
    <div className="min-h-screen flex flex-col">
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
                  <Image
                    src={MessageImage.chat_avt}
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
            <Image
              src={MessageImage.chat_message}
              alt="User"
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
