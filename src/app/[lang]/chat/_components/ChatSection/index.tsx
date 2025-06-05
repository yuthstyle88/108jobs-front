"use client";
import { JobDetailIcon } from "@/constants/icons";
import { CategoriesImage, MessageImage } from "@/constants/images";
import { useChatLanguage } from "@/contexts/ChatLanguage";
import { useWebSocket } from "@/contexts/RealtimeChatContext";
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
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

type MessageForm = {
  message: string;
};

type ChatMessage = {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

const ChatSection = () => {
  const { languageData: chatLanguageData } = useChatLanguage();
  const [isEmploymentOpen, setIsEmploymentOpen] = useState(true);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  const onMessage = useCallback((event: MessageEvent) => {
    const data = JSON.parse(event.data);

    setMessages((prev) => {
      if (prev.some((msg) => msg.id === data.id)) return prev;
      return [...prev, data];
    });
  }, []);

  const { sendMessage, partnerId } = useWebSocket("chat-message", onMessage);

  const { register, handleSubmit, reset } = useForm<MessageForm>();

  const onSubmit = (data: MessageForm) => {
    if (data.message.trim()) {
      sendMessage({ message: data.message });
      reset();
    }
  };

  const toggleEmployment = () => {
    setIsEmploymentOpen(!isEmploymentOpen);
  };

  const toggleDocuments = () => {
    setIsDocumentsOpen(!isDocumentsOpen);
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Chat area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
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

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.map((msg, index) => {
            const isIncoming = msg.sender_id === partnerId;
            return (
              <div
                key={msg.id || index}
                className={`flex mb-2 ${
                  isIncoming ? "justify-start" : "justify-end"
                }`}
              >
                {isIncoming && (
                  <Image
                    src={MessageImage.chat_avt}
                    alt="avatar"
                    className="w-6 h-6 rounded-full mr-2 self-end"
                  />
                )}
                <div
                  className={`max-w-xs px-3 py-2 rounded-xl text-sm ${
                    isIncoming
                      ? "bg-gray-200 text-gray-800 rounded-bl-none"
                      : "bg-blue-500 text-white rounded-br-none"
                  }`}
                >
                  <p>{msg.content}</p>
                  <p className="text-[10px] text-gray-400 mt-1 text-right">
                    {new Date(msg.created_at).toLocaleTimeString("th-TH", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>

        {/* Message input */}
        <div className="border-t px-4 py-3 bg-white">
          <form onSubmit={handleSubmit(onSubmit)} className="flex items-center">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 mr-3"
            >
              <Paperclip size={20} />
            </button>
            <div className="flex-1 border rounded-lg overflow-hidden flex">
              <textarea
                {...register("message")}
                placeholder={chatLanguageData?.type_message_here}
                className="text-text_primary flex-1 px-3 py-2 resize-none focus:outline-none min-h-[40px] max-h-[150px]"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(onSubmit)();
                  }
                }}
              />
              <button
                type="button"
                className="bg-white px-3 text-gray-400 hover:text-gray-600"
              >
                <Smile size={20} />
              </button>
            </div>
            <button
              type="submit"
              className="ml-3 text-blue-500 hover:text-blue-600"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>

      {/* Sidebar (optional) */}
      <div className="w-80 flex flex-col border-l bg-white h-full">
        <div className="px-4 py-6 border-b">
          <h3 className="text-gray-800 font-medium">
            {chatLanguageData?.details}
          </h3>
        </div>

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

        {/* Employment Info */}
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

export default ChatSection;
