"use client";

import { API_ROUTES } from "@/api/endpoints";
import LoadingBlur from "@/components/LoadingBlur";
import { JobDetailIcon } from "@/constants/icons";
import {
  CategoriesImage,
  MessageImage,
  ProfileImage,
} from "@/constants/images";
import { useChatLanguage } from "@/contexts/ChatLanguage";
import { useWebSocket } from "@/contexts/RealtimeChatContext";
import {
  usePrivateFetch,
  usePrivateImagePost
} from "@/hooks/api-hooks";
import { ChatResponse } from "@/types/chat";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Paperclip,
  Send,
  Smile,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { mutate } from "swr";

type MessageForm = {
  message: string;
  file_url?: string;
  file_type?: string;
};

type ChatMessage = {
  id: string;
  sender_id: string;
  partner_id: string;
  content: string;
  created_at: string;
  is_owner: boolean;
  file_url?: string;
  file_type?: string;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString("th-TH", { month: "long" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const ChatSection = () => {
  const { languageData: chatLanguageData } = useChatLanguage();
  const [isEmploymentOpen, setIsEmploymentOpen] = useState(true);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedFile, setSelectedFile] = useState<{
    file_url: string;
    file_type: string;
    file_name: string;
  } | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { register, handleSubmit, reset, watch } = useForm<MessageForm>();

  const onMessage = useCallback((event: MessageEvent) => {
    const data = JSON.parse(event.data);
    setMessages((prev) => {
      if (prev.some((msg) => msg.id === data.id)) return prev;
      return [...prev, data];
    });
  }, []);

  console.log("messages", messages);

  const { sendMessage, partnerId } = useWebSocket("chat-message", onMessage);

  const { data: chatData, isLoading: isChatLoading } = usePrivateFetch<
    ChatResponse[]
  >(API_ROUTES.chat.get_chat_history, {
    revalidateOnFocus: true,
    dedupingInterval: 10000,
  });

  const { trigger: uploadFile, isMutating: isUploading } = usePrivateImagePost(
    API_ROUTES.chat.upload_file
  );

  const currentRoom = chatData?.find((room) => room.job.id === partnerId);

  const onSubmit = (data: MessageForm) => {
    const message = data.message?.trim() || "";

    if (!message && !selectedFile) return;

    sendMessage({
      message,
      file_url: selectedFile?.file_url || "",
      file_type: selectedFile?.file_type || "",
    });

    reset();
    setSelectedFile(null);
    mutate(API_ROUTES.chat.get_chat_history);
    setTimeout(() => resizeTextarea(), 0);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = (await uploadFile(formData)) as {
        file_url: string;
        file_type: string;
        file_name: string;
      };

      setSelectedFile({
        file_url: result.file_url,
        file_type: result.file_type,
        file_name: result.file_name,
      });
    } catch (err) {
      console.error("Upload file failed", err);
    }
  };

  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  useEffect(() => {
    resizeTextarea();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("message")]);

  const toggleEmployment = () => setIsEmploymentOpen((prev) => !prev);
  const toggleDocuments = () => setIsDocumentsOpen((prev) => !prev);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isChatLoading) return <LoadingBlur text="" />;

  return (
    <>
      {/* Chat area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="border-b p-4 flex justify-between items-center bg-white">
          <div className="flex items-center gap-2">
            <Image
              src={currentRoom?.partner_avatar || ProfileImage.avatar}
              alt="User"
              width={40}
              height={40}
              className="w-10 h-10 object-cover rounded-full"
            />
            <div className="mr-4">
              <span className="text-sm font-medium text-text_primary">
                {currentRoom?.partner_display_name}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="#"
              className="text-third hover:bg-gray-100 text-[14px] px-4 py-2 rounded-sm border-border_primary border-1"
            >
              {chatLanguageData?.guide}
            </Link>
          </div>
        </div>
        {/* Chat messages */}
        <div
          data-testid="chat-list"
          className="flex-1 overflow-y-auto p-4 bg-gray-50"
        >
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4 max-w-md ml-auto">
            <div className="bg-white shadow-sm rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {currentRoom?.job.title}
                  </h4>
                  <div className="mt-2 text-sm">
                    <p className="text-gray-700">
                      ราคา : {currentRoom?.job.base_price} บาท
                    </p>
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
              <p className="font-medium text-text_primary">
                รายละเอียดแพ็คเกจ:
              </p>
              <ul className="mt-1 space-y-1 text-gray-700">
                <li>• งานบริษัท/แบรนด์คุณภาพ 1 ชิ้น</li>
                <li>• แก้ไม่เกินครั้งละ 3 ครั้ง</li>
                <li>• ระยะเวลาโปรเจกต์งาน 4-7 วัน</li>
                <li>• มอบแบบไฟล์หลากหลาย 3 ชิ้น</li>
              </ul>
            </div>

            <div className="mt-3 text-sm">
              <p className="font-medium text-text_primary">บริการพิเศษ:</p>
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
          {messages.map((msg, index) => {
            const isIncoming = !msg.is_owner === true;
            const currentMsgDate = formatDate(msg.created_at);
            const prevMsgDate =
              index > 0 ? formatDate(messages[index - 1].created_at) : null;

            const showDateLabel = currentMsgDate !== prevMsgDate;

            return (
              <div data-testid="chat-message" key={msg.id || index}>
                {showDateLabel && (
                  <div className="w-full flex justify-center my-4">
                    <div className="inline-block rounded-[10px] bg-border_secondary p-1 min-w-[120px] text-[#728197] text-[12.8px] text-center">
                      {currentMsgDate}
                    </div>
                  </div>
                )}

                <div
                  className={`flex mb-2 ${
                    isIncoming ? "justify-start" : "justify-end"
                  }`}
                >
                  {isIncoming && (
                    <Image
                      src={currentRoom?.partner_avatar || MessageImage.chat_avt}
                      alt="avatar"
                      width={24}
                      height={24}
                      className="w-6 h-6 rounded-full mr-2 self-end"
                    />
                  )}
                  <div
                    className={`flex flex-col gap-1 items-start ${
                      isIncoming ? "items-start" : "items-end"
                    }`}
                  >
                    <p className="font-sans px-3 text-[12.8px] text-[#728197] mt-1 text-right">
                      {new Date(msg.created_at).toLocaleTimeString("th-TH", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <div
                      className={`max-w-xs px-3 py-2 rounded-xl text-base font-sans ${
                        isIncoming
                          ? "bg-gray-200 text-gray-800 rounded-bl-none"
                          : "bg-blue-500 text-white rounded-br-none"
                      }`}
                    >
                      <div className="break-words whitespace-pre-line">
                        {msg.content && <p>{msg.content}</p>}

                        {msg.file_url && (
                          <>
                            {msg.file_type?.startsWith("image/") ? (
                              <Image
                                src={msg.file_url}
                                alt="uploaded file"
                                className="mt-2 max-w-xs rounded border"
                              />
                            ) : msg.file_type?.startsWith("audio/") ? (
                              <audio controls className="mt-2 w-full">
                                <source
                                  src={msg.file_url}
                                  type={msg.file_type}
                                />
                                Your browser does not support the audio element.
                              </audio>
                            ) : (
                              <a
                                href={msg.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline mt-2 block"
                              >
                                📎 Download file
                              </a>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={endRef} />
        </div>

        {/* Message input */}
        <div className="border-t px-4 py-3 bg-white">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <div className="flex items-start w-full">
              <input
                type="file"
                id="fileInput"
                className="hidden"
                onChange={handleFileUpload}
              />
              <label
                htmlFor="fileInput"
                className="text-gray-400 hover:text-gray-600 mr-3 cursor-pointer"
              >
                {isUploading ? (
                  <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                ) : (
                  <Paperclip size={20} />
                )}
              </label>

              <div className="flex-1 border rounded-lg overflow-hidden flex">
                <textarea
                  {...register("message")}
                  ref={textareaRef}
                  placeholder={chatLanguageData?.type_message_here}
                  className="text-text_primary flex-1 px-3 py-2 resize-none focus:outline-none min-h-[40px] max-h-[150px] overflow-y-auto break-words whitespace-pre-wrap"
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
            </div>

            {selectedFile && (
              <div className="px-3 py-2 text-sm bg-gray-100 rounded w-full flex items-center justify-between gap-2">
                <div className="flex-1 overflow-hidden">
                  {selectedFile.file_type.startsWith("image/") ? (
                    <Image
                      src={selectedFile.file_url}
                      alt="preview"
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded border"
                    />
                  ) : selectedFile.file_type.startsWith("audio/") ? (
                    <audio controls className="w-full">
                      <source
                        src={selectedFile.file_url}
                        type={selectedFile.file_type}
                      />
                      Your browser does not support the audio element.
                    </audio>
                  ) : (
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-blue-600 font-medium truncate">
                        {selectedFile.file_name}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-red-500 text-xs"
                >
                  ✕
                </button>
              </div>
            )}
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
                {currentRoom?.job.title}
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
