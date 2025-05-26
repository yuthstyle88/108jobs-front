"use client";
import { JobDetailIcon } from "@/constants/icons";
import { CategoriesImage, MessageImage } from "@/constants/images";
import { useChatLanguage } from "@/contexts/ChatLanguage";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Paperclip,
  Phone,
  Send,
  Smile,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
// import { useSocket } from "../hooks/useSocket";
// import { useSession } from "next-auth/react";

const ChatMessage = () => {
  const { languageData: chatLanguageData } = useChatLanguage();

  const [isEmploymentOpen, setIsEmploymentOpen] = useState(true);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // const { data: session } = useSession();

  // const token = session?.accessToken || "";
  // const partnerId = "ba26ecd5-8ed9-4bea-8571-d6c624e9e3e0";

  // const { sendMessage } = useSocket({
  //   token,
  //   partnerId,
  //   onMessage: (event) => {
  //     const data = JSON.parse(event.data);
  //     console.log("Received:", data);
  //   },
  // });

  const toggleEmployment = () => {
    setIsEmploymentOpen(!isEmploymentOpen);
  };

  const toggleDocuments = () => {
    setIsDocumentsOpen(!isDocumentsOpen);
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${scrollHeight}px`;
    }
  }, [messageText]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // if (messageText.trim()) {
      //   sendMessage({
      //     event: "send_message",
      //     content: messageText,
      //     // bổ sung sender_id, timestamp, ...
      //   });
      //   setMessageText("");
      // }
    }
  };
  return (
    <>
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Chat Header */}
        <div className="border-b p-4 flex justify-between items-center bg-white">
          <div className="flex items-center gap-2">
            <Image
              src={MessageImage.chat_avt}
              alt="User"
              className="w-10 h-10 object-cover rounded-full"
            />
            <div className="mr-4">
              <span className="text-sm font-medium text-text_primary">
                Vanint
              </span>
              <span className="text-xs text-gray-500 ml-2">#RSQCU4KL</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-gray-100 p-2 rounded hover:bg-gray-200">
              <Phone size={18} className="text-third" />
            </button>
            <Link href="#" className="text-blue-500 hover:underline text-sm">
              {chatLanguageData?.guide}
            </Link>
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
                <Image
                  src={CategoriesImage.seo_job}
                  alt="seo_job"
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
                  <p>{chatLanguageData?.unselect_warning}</p>
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
                ref={textareaRef}
                placeholder={chatLanguageData?.type_message_here}
                className="text-text_primary flex-1 px-3 py-2 resize-none focus:outline-none min-h-[40px] max-h-[150px]"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                style={{ height: "auto", overflowY: "hidden" }}
              ></textarea>
              <button className="bg-white px-3 text-gray-400 hover:text-gray-600">
                <Smile size={20} />
              </button>
            </div>
            <button
              className="ml-3 text-blue-500 hover:text-blue-600"
              onClick={() => {
                setMessageText("");
              }}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Service Details */}
      <div className="w-80 flex flex-col border-l bg-white h-full">
        {/* Title */}
        <div className="px-4 py-6 border-b">
          <h3 className="text-gray-800 font-medium">
            {chatLanguageData?.details}
          </h3>
        </div>

        {/* Security Message */}
        <div className="p-4 bg-[#DBE8FC] flex items-center">
          <Image
            src={JobDetailIcon.guarantee}
            alt="seo_job"
            className="w-5 mr-4"
          />
          <p className="text-sm text-gray-700">
            {chatLanguageData?.secure_payment_note}
          </p>
        </div>

        {/* Service Description */}
        <div className="p-4 border-b">
          <div className="flex">
            <div className="w-12 h-12 rounded bg-gray-200 overflow-hidden mr-3 flex-shrink-0">
              <Image
                src={CategoriesImage.seo_job}
                alt="seo_job"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm text-text_primary font-sans line-clamp-2">
                Increase traffic and high quality backlinks, push the website to
                be ...
              </p>
            </div>
          </div>
        </div>

        {/* Employment Information */}
        <div className="border-b">
          <button
            className="flex items-center justify-between w-full p-4 text-sm hover:bg-gray-50 transition-colors"
            onClick={toggleEmployment}
          >
            <div className="flex items-center text-blue-600">
              <span className="inline-block mr-2">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </span>
              <span>ข้อมูลการจ้างงาน</span>
            </div>
            {isEmploymentOpen ? (
              <ChevronUp size={16} color="blue" />
            ) : (
              <ChevronDown size={16} color="blue" />
            )}
          </button>

          {isEmploymentOpen && (
            <div className="px-4 pb-4 animate-fade-in">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">เลขคำสั่งซื้อ</span>
                <div className="flex items-center">
                  <span className="text-green-600 font-medium">LPC8527T</span>
                  <button className="ml-1 text-gray-400 hover:text-gray-600">
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Employment Documents */}
        <div className="border-b">
          <button
            className="flex items-center justify-between w-full p-4 text-sm hover:bg-gray-50 transition-colors"
            onClick={toggleDocuments}
          >
            <div className="flex items-center text-blue-600">
              <span className="inline-block mr-2">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </span>
              <span>เอกสารจ้างงาน</span>
            </div>
            {isDocumentsOpen ? (
              <ChevronUp size={16} color="blue" />
            ) : (
              <ChevronDown size={16} color="blue" />
            )}
          </button>

          {isDocumentsOpen && (
            <div className="px-4 pb-4 animate-fade-in">
              <p className="text-sm text-gray-500 text-center">
                ยังไม่มีเอกสาร
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatMessage;
