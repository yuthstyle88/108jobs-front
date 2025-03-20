"use client";
import { MessageImage } from "@/constants/images";
import { LanguageFile } from "@/constants/language";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { ChevronDown, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Chat = () => {
  const {
      data: languageData,
      isLoading,
      error,
    } = useGlobalTranslate(LanguageFile.CHAT);
  
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading data.</p>;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-[340px] border-r bg-white">
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

            <div className="flex items-center mt-6">
              <button className="flex items-center justify-between w-full py-2 px-3 text-sm text-gray-700 bg-gray-100 rounded-md">
                <span>{languageData?.label_filter_jobs}</span>
                <ChevronDown size={16} />
              </button>
            </div>

            <div className="flex items-center mt-3 gap-3 text-sm text-gray-600">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="w-[2.75rem] h-[26px] bg-gray-200  hover:bg-gray-300 peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-1/2 peer-checked:after:border-white after:content-[''] after:absolute after:top-[-3px] after:left-[-2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-8 after:w-8 after:scale-[0.64] after:shadow-toggle after:transition-all peer-checked:bg-third hover:peer-checked:bg-third"></div>
              </label>
              {languageData?.checkbox_unhired_only}
            </div>
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
                    <h4 className="font-medium text-sm text-text_primary">
                      Vanint
                    </h4>
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
              {languageData?.label_no_conversation}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
